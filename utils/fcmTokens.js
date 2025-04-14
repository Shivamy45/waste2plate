import { db } from "@/firebase/config";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { getAuth } from "firebase/auth";

// Function to store FCM token for a user
export async function storeFCMToken(uid, token) {
    try {
        const tokenRef = doc(db, "fcm_tokens", uid);
        await setDoc(tokenRef, {
            uid,
            token,
            subscribedAt: serverTimestamp()
        }, { merge: true });
        
        console.log("FCM token stored successfully");
        return true;
    } catch (error) {
        console.error("Error storing FCM token:", error);
        throw error;
    }
}

// Function to remove FCM token for a user
export async function removeFCMToken(uid) {
    try {
        const tokenRef = doc(db, "fcm_tokens", uid);
        await deleteDoc(tokenRef);
        
        console.log("FCM token removed successfully");
        return true;
    } catch (error) {
        console.error("Error removing FCM token:", error);
        throw error;
    }
}

// Function to get FCM token for a user
export const getFCMToken = async () => {
    try {
        const auth = getAuth();
        const messaging = getMessaging();
        
        // Get the current user
        const user = auth.currentUser;
        if (!user) {
            throw new Error("No authenticated user");
        }

        // Get the FCM token
        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (!token) {
            throw new Error("No FCM token available");
        }

        // Store the token in the database
        await fetch("/api/store-fcm-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                uid: user.uid,
                token,
            }),
        });

        return token;
    } catch (error) {
        console.error("Error getting FCM token:", error);
        return null;
    }
}; 