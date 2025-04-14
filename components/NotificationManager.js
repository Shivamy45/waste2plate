"use client";

import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase/config';
import { toast } from 'react-toastify';

const NotificationManager = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        checkNotificationPermission();
    }, []);

    const checkNotificationPermission = async () => {
        try {
            if (!messaging) {
                console.log('Firebase messaging not initialized');
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                });
                
                if (token) {
                    console.log('FCM Token:', token);
                    setIsSubscribed(true);
                }
            }
        } catch (error) {
            console.error('Error checking notification permission:', error);
        }
    };

    const requestNotificationPermission = async () => {
        try {
            if (!messaging) {
                toast.error('Firebase messaging not initialized');
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                });
                
                if (token) {
                    console.log('FCM Token:', token);
                    setIsSubscribed(true);
                    toast.success('Notifications enabled successfully!');
                }
            } else {
                toast.error('Please enable notifications to receive alerts');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            toast.error('Failed to enable notifications');
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            {!isSubscribed ? (
                <button
                    onClick={requestNotificationPermission}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    Enable Notifications
                </button>
            ) : (
                <p className="text-green-600 font-medium">
                    Notifications are enabled ✓
                </p>
            )}
        </div>
    );
};

export default NotificationManager; 