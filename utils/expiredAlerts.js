import { db } from "@/firebase/config";
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

// Function to check and handle expired alerts
export async function handleExpiredAlerts() {
    try {
        // Get all available alerts
        const alertsRef = collection(db, "food_alerts");
        const q = query(alertsRef, where("status", "==", "available"));
        const querySnapshot = await getDocs(q);

        const now = new Date();
        const expiredAlerts = [];

        // Check each alert for expiration
        querySnapshot.forEach((doc) => {
            const alert = doc.data();
            const alertTimestamp = alert.timestamp?.toDate();
            
            // Consider an alert expired if it's older than 24 hours
            if (alertTimestamp && (now - alertTimestamp) > 24 * 60 * 60 * 1000) {
                expiredAlerts.push({
                    id: doc.id,
                    ...alert
                });
            }
        });

        // Process expired alerts
        for (const alert of expiredAlerts) {
            // Start a batch write
            const batch = db.batch();

            // Create expired alert document
            const expiredAlertRef = collection(db, "expired_alerts");
            const expiredAlertData = {
                food_alert_id: alert.id,
                restaurant_name: alert.restaurant_name,
                expiredAt: serverTimestamp(),
                original_timestamp: alert.timestamp
            };
            batch.set(expiredAlertRef, expiredAlertData);

            // Update original alert status
            const alertRef = doc(db, "food_alerts", alert.id);
            batch.update(alertRef, {
                status: "expired"
            });

            // Commit the batch
            await batch.commit();
        }

        return expiredAlerts.length;
    } catch (error) {
        console.error("Error handling expired alerts:", error);
        throw error;
    }
}

// Function to get expired alerts
export async function getExpiredAlerts() {
    try {
        const expiredAlertsRef = collection(db, "expired_alerts");
        const q = query(expiredAlertsRef);
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting expired alerts:", error);
        throw error;
    }
} 