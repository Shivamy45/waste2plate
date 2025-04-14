"use client";
import { useState } from "react";
import { db } from "@/firebase/config";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

export default function ClaimFoodAlert({ alertId, onClaimSuccess }) {
    const [isClaiming, setIsClaiming] = useState(false);
    const auth = getAuth();

    const handleClaim = async () => {
        if (!auth.currentUser) {
            toast.error("Please log in to claim food");
            return;
        }

        setIsClaiming(true);
        try {
            // Start a batch write to ensure both operations succeed or fail together
            const batch = db.batch();

            // Update the food alert status
            const alertRef = doc(db, "food_alerts", alertId);
            batch.update(alertRef, {
                status: "claimed"
            });

            // Create a new claimed alert document
            const claimedAlertRef = collection(db, "claimed_alerts");
            const claimedAlertData = {
                food_alert_id: alertId,
                consumer_uid: auth.currentUser.uid,
                claimedAt: serverTimestamp()
            };
            batch.set(claimedAlertRef, claimedAlertData);

            // Commit the batch
            await batch.commit();

            toast.success("Food claimed successfully!");
            if (onClaimSuccess) {
                onClaimSuccess();
            }
        } catch (error) {
            console.error("Error claiming food:", error);
            toast.error("Failed to claim food. Please try again.");
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
            {isClaiming ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Claiming...
                </div>
            ) : (
                "Claim Food"
            )}
        </button>
    );
} 