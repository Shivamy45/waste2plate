// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize messaging only in browser environment
let messaging = null;
if (typeof window !== "undefined") {
	try {
		messaging = getMessaging(app);

		// Register service worker
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/firebase-messaging-sw.js")
				.then((registration) => {
					console.log("Service Worker registered:", registration);

					// Configure VAPID key for web push notifications
					getToken(messaging, {
						vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
						serviceWorkerRegistration: registration,
					}).catch((err) => {
						console.error("Error getting FCM token:", err);
					});
				})
				.catch((err) => {
					console.error("Service Worker registration failed:", err);
				});
		}
	} catch (err) {
		console.error("Error initializing messaging:", err);
	}
}

export { app, auth, db, messaging, RecaptchaVerifier };
