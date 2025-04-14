import { db } from "@/firebase/config";
import { 
    doc, 
    setDoc, 
    updateDoc, 
    collection, 
    serverTimestamp, 
    getDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { sendNotification } from "./sendNotification";

// Generate a 6-digit passkey
const generatePasskey = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Post a new food alert
export const postFoodAlert = async (alertData) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        const alertRef = doc(collection(db, "food_alerts"));
        const alertId = alertRef.id;

        const alert = {
            ...alertData,
            id: alertId,
            provider_uid: user.uid,
            status: "available",
            timestamp: serverTimestamp(),
            claims: {},
            reports: {},
            attended_ids: []
        };

        await setDoc(alertRef, alert);
        return alertId;
    } catch (error) {
        console.error("Error posting food alert:", error);
        throw error;
    }
};

// Cancel a food alert
export const cancelAlert = async (alertId) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        const alertRef = doc(db, "food_alerts", alertId);
        const alertDoc = await getDoc(alertRef);

        if (!alertDoc.exists()) {
            throw new Error("Alert not found");
        }

        const alert = alertDoc.data();
        if (alert.provider_uid !== user.uid) {
            throw new Error("Not authorized to cancel this alert");
        }

        // Notify all claimed users
        const claims = alert.claims || {};
        for (const [uid, claim] of Object.entries(claims)) {
            await sendNotification(
                uid,
                "Food Alert Cancelled",
                `The food alert from ${alert.restaurant_name} has been cancelled.`
            );
        }

        await updateDoc(alertRef, {
            status: "cancelled",
            cancelledAt: serverTimestamp()
        });

        return true;
    } catch (error) {
        console.error("Error cancelling alert:", error);
        throw error;
    }
};

// Claim a food alert
export const claimAlert = async (alertId) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        const alertRef = doc(db, "food_alerts", alertId);
        const alertDoc = await getDoc(alertRef);

        if (!alertDoc.exists()) {
            throw new Error("Alert not found");
        }

        const alert = alertDoc.data();
        if (alert.status !== "available") {
            throw new Error("Alert is not available for claiming");
        }

        // Generate passkey
        const passkey = generatePasskey();

        // Update alert with claim
        await updateDoc(alertRef, {
            [`claims.${user.uid}`]: {
                passkey,
                claimedAt: serverTimestamp()
            }
        });

        // Notify provider
        await sendNotification(
            alert.provider_uid,
            "New Claim",
            `Someone has claimed your food alert from ${alert.restaurant_name}.`
        );

        return passkey;
    } catch (error) {
        console.error("Error claiming alert:", error);
        throw error;
    }
};

// Unclaim a food alert
export const unclaimAlert = async (alertId) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        const alertRef = doc(db, "food_alerts", alertId);
        const alertDoc = await getDoc(alertRef);

        if (!alertDoc.exists()) {
            throw new Error("Alert not found");
        }

        const alert = alertDoc.data();
        if (!alert.claims?.[user.uid]) {
            throw new Error("You haven't claimed this alert");
        }

        // Remove claim
        await updateDoc(alertRef, {
            [`claims.${user.uid}`]: deleteDoc()
        });

        // Notify provider
        await sendNotification(
            alert.provider_uid,
            "Claim Removed",
            `Someone has unclaimed your food alert from ${alert.restaurant_name}.`
        );

        return true;
    } catch (error) {
        console.error("Error unclaiming alert:", error);
        throw error;
    }
};

// Confirm attendance using passkey
export const confirmAttendance = async (alertId, passkey) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        const alertRef = doc(db, "food_alerts", alertId);
        const alertDoc = await getDoc(alertRef);

        if (!alertDoc.exists()) {
            throw new Error("Alert not found");
        }

        const alert = alertDoc.data();
        if (alert.provider_uid !== user.uid) {
            throw new Error("Not authorized to confirm attendance");
        }

        // Find the claim with matching passkey
        const claims = alert.claims || {};
        const claimEntry = Object.entries(claims).find(([_, claim]) => claim.passkey === passkey);

        if (!claimEntry) {
            throw new Error("Invalid passkey");
        }

        const [consumerUid, claim] = claimEntry;

        // Update alert with attendance confirmation
        await updateDoc(alertRef, {
            attended_ids: arrayUnion(consumerUid),
            [`claims.${consumerUid}`]: deleteDoc()
        });

        // Notify consumer
        await sendNotification(
            consumerUid,
            "Attendance Confirmed",
            `Your attendance has been confirmed for the food alert from ${alert.restaurant_name}.`
        );

        return true;
    } catch (error) {
        console.error("Error confirming attendance:", error);
        throw error;
    }
};

// Report a food alert
export const reportAlert = async (alertId, reason) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("User not authenticated");
        }

        const alertRef = doc(db, "food_alerts", alertId);
        const reportRef = doc(collection(alertRef, "reports"));
        
        const report = {
            reporter_uid: user.uid,
            reason,
            reported_at: serverTimestamp()
        };

        await setDoc(reportRef, report);

        // Notify provider
        const alertDoc = await getDoc(alertRef);
        const alert = alertDoc.data();
        
        await sendNotification(
            alert.provider_uid,
            "Alert Reported",
            `Your food alert from ${alert.restaurant_name} has been reported.`
        );

        return true;
    } catch (error) {
        console.error("Error reporting alert:", error);
        throw error;
    }
}; 