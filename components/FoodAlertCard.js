"use client";
import { motion } from "framer-motion";
import { FaUtensils, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import ClaimFoodAlert from "./ClaimFoodAlert";

export default function FoodAlertCard({ alert, userLocation }) {
	const { 
		id,
		restaurant_name,
		food_type,
		quantity,
		discount,
		location,
		status,
		timestamp
	} = alert;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white rounded-xl shadow-lg overflow-hidden"
		>
			<div className="p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold text-gray-900">{restaurant_name}</h3>
					<span className={`px-3 py-1 rounded-full text-sm font-medium ${
						status === "available" ? "bg-green-100 text-green-800" :
						status === "claimed" ? "bg-yellow-100 text-yellow-800" :
						"bg-red-100 text-red-800"
					}`}>
						{status}
					</span>
				</div>

				<div className="space-y-4">
					<div className="flex items-center text-gray-600">
						<FaUtensils className="mr-2" />
						<span>{food_type}</span>
					</div>

					<div className="flex items-center text-gray-600">
						<FaMapMarkerAlt className="mr-2" />
						<span>{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Location not available"}</span>
					</div>

					<div className="flex items-center text-gray-600">
						<FaClock className="mr-2" />
						<span>{new Date(timestamp?.toDate()).toLocaleString()}</span>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="bg-gray-50 p-3 rounded-lg">
							<p className="text-sm text-gray-500">Quantity</p>
							<p className="font-medium">{quantity}</p>
						</div>
						<div className="bg-gray-50 p-3 rounded-lg">
							<p className="text-sm text-gray-500">Discount</p>
							<p className="font-medium">{discount}</p>
						</div>
					</div>
				</div>

				{status === "available" && (
					<div className="mt-6">
						<ClaimFoodAlert 
							alertId={id}
							onClaimSuccess={() => {
								// Refresh the alerts list or update UI
							}}
						/>
					</div>
				)}
			</div>
		</motion.div>
	);
}
