import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import { motion } from "framer-motion";
import Link from "next/link";

const FoodAlertCard = ({ alert, userLocation }) => {
	const [claimed, setClaimed] = useState(false);
	const [distanceKm, setDistanceKm] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const buttonRef = useRef(null);

	// Fetch road distance from your API
	const getRoadDistance = async () => {
		if (!userLocation || !alert.location) return;

		const origin = `${userLocation.latitude},${userLocation.longitude}`;
		const destination = `${alert.location.latitude},${alert.location.longitude}`;

		try {
			const res = await fetch("/api/distance", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ origin, destination }),
			});

			const data = await res.json();

			if (res.ok && data.distance) {
				setDistanceKm(data.distance); // "4.6 km"
			} else {
				console.error("API error:", data);
			}
		} catch (error) {
			console.error("Error fetching road distance:", error);
		}
	};

	useEffect(() => {
		getRoadDistance();
	}, [userLocation, alert.location]);

	const handleClaim = async (e) => {
		e.preventDefault(); // Prevent event bubbling
		if (isLoading) return;
		
		setIsLoading(true);
		try {
			if (claimed) {
				setClaimed(false);
				const alertRef = doc(db, "food_alerts", alert.id);
				await updateDoc(alertRef, {
					slots: alert.slots + 1,
				});
				toast("Your slot has been cancelled!");
			} else if (alert.slots <= 0) {
				toast("No slots left!");
			} else {
				const alertRef = doc(db, "food_alerts", alert.id);
				await updateDoc(alertRef, {
					slots: alert.slots - 1,
				});
				setClaimed(true);
				toast("You have claimed this giveaway!");
			}
		} catch (error) {
			console.error("Error:", error);
			toast("Failed to process your request.");
		} finally {
			setIsLoading(false);
		}
	};

	if (!alert) return null;

	return (
		<Card className="w-full max-w-md shadow-lg rounded-2xl">
			<ToastContainer
				position="top-right"
				autoClose={1000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick={false}
				rtl={false}
				theme="dark"
				transition={Slide}
			/>

			<CardHeader>
				<CardTitle className="text-xl font-semibold">
					{alert.orgName || "Unknown"}
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-2">
				<div className="flex items-center gap-2 text-gray-600">
					<Utensils className="w-5 h-5 text-orange-500" />
					<span className="text-lg font-medium">
						{alert.foodType}
					</span>
				</div>

				<div className="flex items-center gap-2 text-gray-600">
					<MapPin className="w-5 h-5 text-red-500" />
					<span>{alert.city || "N/A"}</span>
				</div>

				<p className="text-gray-700">Quantity: {alert.slots}</p>

				<div className="flex justify-between mt-4">
					<div>
						{distanceKm && (
							<p className="text-gray-600 text-sm">
								Distance: {distanceKm}
							</p>
						)}
					</div>

					<Link href={`/alert/${alert.id}`} className="block">
						<motion.button
							ref={buttonRef}
							onClick={handleClaim}
							disabled={isLoading}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{ duration: 0.1 }}
							className={`w-full h-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg ${
								isLoading ? 'opacity-75 cursor-not-allowed' : ''
							}`}
						>
							{isLoading ? (
								<>
									<svg className="animate-spin h-4 w-4 mr-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Processing...
								</>
							) : (
								claimed ? "Cancel" : "Claim"
							)}
						</motion.button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};

export default FoodAlertCard;
