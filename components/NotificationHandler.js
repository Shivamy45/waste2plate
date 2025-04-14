"use client";

import { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import { toast } from 'react-toastify';

const NotificationHandler = () => {
    useEffect(() => {
        const messaging = getMessaging();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Received foreground message:', payload);

            toast.info(
                <div>
                    <h3 className="font-semibold">{payload.notification.title}</h3>
                    <p>{payload.notification.body}</p>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return null;
};

export default NotificationHandler; 