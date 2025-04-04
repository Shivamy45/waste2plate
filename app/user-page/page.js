"use client";
import FoodAlertCard from "@/components/FoodAlertCard";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MainPage = () => {
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null); // Store logged-in user

	// Fetch the logged-in user
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => unsubscribe(); // Cleanup
	}, []);

	// Function to update user location in Firestore
	const updateUserLocation = (latitude, longitude) => {
		if (!user?.uid) return; // Ensure user is logged in

		const userDocRef = doc(db, "users", user.uid); // Reference to the user's document
		updateDoc(userDocRef, {
			location: { latitude, longitude },
		})
			.then(() => console.log("User location updated"))
			.catch((error) => console.error("Error updating location:", error));
	};

	// Fetch User Location when user logs in
	useEffect(() => {
		if (user && "geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					updateUserLocation(latitude, longitude);
				},
				(error) => console.error("Error getting location:", error),
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
			);
		}
	}, [user]);

	// Fetch Real-time Food Alerts
	useEffect(() => {
		const unsubscribe = onSnapshot(
			collection(db, "food_alerts"),
			(snapshot) => {
				const fetchedAlerts = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setAlerts(fetchedAlerts);
				setLoading(false);
			},
			(error) => {
				console.error("Error fetching food alerts:", error);
				setLoading(false);
			}
		);

		return () => unsubscribe(); // Cleanup on unmount
	}, []);

	if (loading) return <p className="text-center mt-10">Loading...</p>;

	return (
		<div className="p-4 bg-origin-padding grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {alerts.length === 0 ? (
        <p className="col-span-full text-center">No food alerts available.</p>
    ) : (
        alerts.map((alert) => (
            <FoodAlertCard key={alert.id} alert={alert} />
        ))
    )}
</div>
	);
};

export default MainPage;
