importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCI_zcqmopGiL5QUhqBU5jM1JiSXdDnpSY",
    authDomain: "waste2plate-d48ef.firebaseapp.com",
    projectId: "waste2plate-d48ef",
    storageBucket: "waste2plate-d48ef.firebasestorage.app",
    messagingSenderId: "1058481796438",
    appId: "1:1058481796438:web:feb6a0aac76c7056bcd2f7",
    measurementId: "G-6GSN8WG7LV"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
}); 