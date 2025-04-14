"use client";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const foodAlertSchema = z.object({
	giveawayName: z.string().min(1, "Required"),
	orgName: z.string().min(1, "Required"),
	city: z.string().min(1, "Required"),
	address: z.string().min(1, "Required"),
	description: z.string().min(1, "Required"),
	foodType: z.enum(["veg", "nonVeg"]),
	startTime: z.string().min(1, "Required"),
	endTime: z.string().min(1, "Required"),
	slots: z.coerce.number().min(1, "Must be at least 1"),
});

const INDIAN_CITIES = [
	"Ahmedabad",
	"Ayodhya",
	"Bangalore",
	"Chennai",
	"Delhi",
	"Gorakhpur",
	"Hyderabad",
	"Kolkata",
	"Lucknow",
	"Mumbai",
	"Patna",
	"Pune",
	"Surat",
	"Jaipur",
	"Indore",
	"Nagpur",
	"Kanpur",
];

export default function FoodAlertForm() {
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [filteredCities, setFilteredCities] = useState([]);
	const [location, setLocation] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const inputRef = useRef(null);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(foodAlertSchema),
	});

	// Get user location on component mount
	useEffect(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setLocation({
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					});
				},
				(error) => {
					console.error("Error getting location:", error.message);
					//alert("Please allow location access for accurate results.");
					toast("Please allow location access for accurate results.");
				},
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
			//alert("Geolocation is not supported by your browser.");
			toast("Geolocation is not supported by your browser.");
		}
	}, []);

	// Filter city suggestions
	useEffect(() => {
		setFilteredCities(
			INDIAN_CITIES.filter((city) =>
				city.toLowerCase().startsWith(query.toLowerCase())
			).sort()
		);
	}, [query]);

	const handleCitySelect = (cityName) => {
		setQuery(cityName);
		setValue("city", cityName);
		setShowSuggestions(false);
	};

	const handleClickOutside = (e) => {
		if (inputRef.current && !inputRef.current.contains(e.target)) {
			setShowSuggestions(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	const onSubmit = async (data) => {
		if (isSubmitting) return; // Prevent multiple submissions
		
		setIsSubmitting(true);
		try {
			// Add location to form data
			const formData = {
				...data,
				location: {
					latitude: location?.latitude || 0,
					longitude: location?.longitude || 0,
				},
			};

			// Submit form data
			const response = await fetch("/api/food-alerts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error("Failed to submit form");
			}

			toast.success("Food alert created successfully!");
			reset();
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("Failed to create food alert. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="text-black p-6 rounded-xl shadow-lg max-w-2xl mx-auto border-2 border-black">
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
			<h2 className="text-center text-2xl mb-4 font-bold">
				Food Giveaway Page
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-lg">Name</Label>
						<Input
							className="border-black text-black"
							{...register("giveawayName")}
						/>
						<p className="text-red-500 text-sm">
							{errors.giveawayName?.message}
						</p>
					</div>
					<div>
						<Label className="text-lg">Organizer</Label>
						<Input
							className="border-black text-black"
							{...register("orgName")}
						/>
						<p className="text-red-500 text-sm">
							{errors.orgName?.message}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="relative" ref={inputRef}>
						<Label className="text-lg">City</Label>
						<Input
							type="text"
							value={query}
							onFocus={() => setShowSuggestions(true)}
							onChange={(e) => {
								setQuery(e.target.value);
								setShowSuggestions(true);
							}}
							className="border border-black p-2 rounded w-full text-black"
						/>
						{showSuggestions && filteredCities.length > 0 && (
							<ul className="absolute bg-white border w-full z-10 rounded shadow max-h-40 overflow-y-auto">
								{filteredCities.map((city) => (
									<li
										key={city}
										className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
										onClick={() => handleCitySelect(city)}>
										{city}
									</li>
								))}
							</ul>
						)}
						<p className="text-red-500 text-sm">
							{errors.city?.message}
						</p>
						<input type="hidden" {...register("city")} />
					</div>
					<div>
						<Label className="text-lg">Address</Label>
						<Input
							className="border-black text-black"
							{...register("address")}
						/>
						<p className="text-red-500 text-sm">
							{errors.address?.message}
						</p>
					</div>
				</div>

				<div>
					<Label className="text-lg">Description</Label>
					<Textarea
						className="border-black text-black"
						{...register("description")}
					/>
				</div>

				<div>
					<Label className="text-lg">Food Type</Label>
					<RadioGroup
						className="flex space-x-4"
						onValueChange={(val) => setValue("foodType", val)}>
						<RadioGroupItem value="veg" id="veg" />
						<Label htmlFor="veg">Veg</Label>
						<RadioGroupItem value="nonVeg" id="nonVeg" />
						<Label htmlFor="nonVeg">Non-Veg</Label>
					</RadioGroup>
					<p className="text-red-500 text-sm">
						{errors.foodType?.message}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label className="text-lg">Start Time</Label>
						<Input
							type="time"
							className="border-black text-black"
							{...register("startTime")}
						/>
					</div>
					<div>
						<Label className="text-lg">End Time</Label>
						<Input
							type="time"
							className="border-black text-black"
							{...register("endTime")}
						/>
					</div>
				</div>

				<div>
					<Label className="text-lg">No. of Slots Available</Label>
					<Input
						type="number"
						className="border-black text-black"
						{...register("slots")}
						min={1}
					/>
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					className={`w-full bg-orange-500 hover:bg-orange-600 text-white ${
						isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
					}`}
				>
					{isSubmitting ? (
						<>
							<svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Submitting...
						</>
					) : (
						"Create Alert"
					)}
				</Button>
			</form>
		</div>
	);
}
