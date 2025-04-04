import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import React, { useState } from "react";

import { ToastContainer, toast, Slide } from "react-toastify";

const FoodAlertCard = ({ alert }) => {
	const [claimed, setClaimed] = useState(false);
	const handleClaim = async () => {
		if (claimed) {
			setClaimed(false);
			try {
				const alertRef = doc(db, "food_alerts", alert.id);
				await updateDoc(alertRef, {
					slots: alert.slots + 1,
				});
				toast("You slot has been cancelled!");
			} catch (error) {
				console.error("Error cancelling:", error);
				toast("Failed to cancel.");
			}
		} else if (alert.slots <= 0) {
			// alert("No slots left!");
			toast("No slots left!");
			return;
		} else {
			try {
				const alertRef = doc(db, "food_alerts", alert.id);
				await updateDoc(alertRef, {
					slots: alert.slots - 1,
				});
				setClaimed(true);
				toast("You have claimed this giveaway!");
			} catch (error) {
				console.error("Error claiming alert:", error);
				toast("Failed to claim giveaway.");
			}
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
					{/* Uncomment below when location linking is needed */}
					{/*
					<Link
						href={`https://www.google.com/maps?q=${alert.location?.latitude},${alert.location?.longitude}`}
						target="_blank"
					>
						<Button variant="outline">View Location</Button>
					</Link>
					*/}
					<Button variant="outline" disabled>
						View Location
					</Button>

					<Button
						onClick={handleClaim}
						className="bg-orange-500 hover:bg-orange-600 text-white">
						{claimed ? "Cancel" : "Claim"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default FoodAlertCard;
