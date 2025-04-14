"use client";
import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { storeFCMToken, removeFCMToken } from "@/utils/fcmTokens";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function FCMTokenManager() {
    useEffect(() => {
        const setupFCM = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                
                if (!user) return;

                // Request notification permission
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    toast.error("Please enable notifications to receive alerts");
                    return;
                }

                // Get FCM token
                const messaging = getMessaging();
                const token = await getToken(messaging, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
                });

                if (token) {
                    // Store the token
                    await storeFCMToken(user.uid, token);
                    
                    // Handle foreground messages
                    onMessage(messaging, (payload) => {
                        toast.custom((t) => (
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                                <h3 className="font-semibold text-gray-900">
                                    {payload.notification?.title}
                                </h3>
                                <p className="text-gray-600">
                                    {payload.notification?.body}
                                </p>
                            </div>
                        ));
                    });
                }
            } catch (error) {
                console.error("Error setting up FCM:", error);
            }
        };

        setupFCM();

        // Cleanup function to remove token when component unmounts
        return () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                removeFCMToken(user.uid).catch(console.error);
            }
        };
    }, []);

    return null; // This component doesn't render anything
} 