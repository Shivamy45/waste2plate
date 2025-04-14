import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase-admin/firestore";

export async function sendNotification(recipientUid, title, body, data = {}) {
    try {
        const db = getFirestore();
        const tokenDoc = await db.collection("fcm_tokens").doc(recipientUid).get();

        if (!tokenDoc.exists) {
            console.error("No FCM token found for user:", recipientUid);
            return false;
        }

        const { token } = tokenDoc.data();
        const messaging = getMessaging();

        const message = {
            token,
            notification: {
                title,
                body,
            },
            data,
        };

        await messaging.send(message);
        return true;
    } catch (error) {
        console.error("Error sending notification:", error);
        return false;
    }
} 