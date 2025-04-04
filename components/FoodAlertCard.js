import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Utensils } from "lucide-react";

const FoodAlertCard = () => {
	// const FoodAlertCard = ({ alert }) => {
	return (
		<Card className="w-full max-w-md shadow-lg rounded-2xl">
			<CardHeader>
				<CardTitle className="text-xl font-semibold">
					MRH foods
					{/* {alert.restaurant_name} */}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex items-center gap-2 text-gray-600">
					<Utensils className="w-5 h-5 text-orange-500" />
					<span className="text-lg font-medium">
						{/* {alert.food_type} */}
						Veg
					</span>
				</div>
				<div className="flex items-center gap-2 text-gray-600">
					<MapPin className="w-5 h-5 text-red-500" />
					<span>Delhi</span>
					{/* <span>{alert.location}</span> */}
				</div>
				<p className="text-gray-700">Quantity: 23</p>
				{/* <p className="text-gray-700">Quantity: {alert.quantity}</p> */}
				<p className="text-green-600 font-medium">
					{/* Discount: {alert.discount} */}
					Discount: 100%
				</p>
				<div className="flex justify-between mt-4">
					<Link href={`https://www.google.com`} target="_blank">
						{/* <Link
						href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
						target="_blank"> */}
						<Button variant="outline">View Location</Button>
					</Link>
					<Button className="bg-orange-500 hover:bg-orange-600 text-white">
						Claim
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default FoodAlertCard;
