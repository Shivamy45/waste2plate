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
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaClock, FaUtensils, FaBuilding, FaUser, FaInfoCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const foodAlertSchema = z.object({
	restaurant_name: z.string().min(1, "Restaurant name is required"),
	food_type: z.string().min(1, "Food type is required"),
	quantity: z.number().min(1, "Quantity must be at least 1"),
	discount: z.string().min(1, "Discount is required"),
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
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [filteredCities, setFilteredCities] = useState([]);
	const [location, setLocation] = useState(null);
	const [locationPermission, setLocationPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
	const [isSubmitting, setIsSubmitting] = useState(false);
	const inputRef = useRef(null);
	const [formData, setFormData] = useState({
		food_type: '',
		quantity: '',
		description: '',
		location: null,
		expiry_time: '',
		conditions: []
	});
	const [errors, setErrors] = useState({});
	const [locationError, setLocationError] = useState('');
	const [loading, setLoading] = useState(false);
	const [nearbyAlerts, setNearbyAlerts] = useState([]);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors: formErrors },
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
					setLocationPermission('granted');
				},
				(error) => {
					if (error.code === error.PERMISSION_DENIED) {
						setLocationPermission('denied');
						toast.error("Location access denied. Please enable location access for better results.");
					} else {
						console.error("Error getting location:", error.message);
					}
				},
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
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

	useEffect(() => {
		// Check if user is logged in
		const auth = getAuth();
		if (!auth.currentUser) {
			router.push('/login');
			toast.error('Please log in to create a food alert');
		}
	}, [router]);

	useEffect(() => {
		getNearbyAlerts();
	}, []);

	const getNearbyAlerts = async () => {
		try {
			const alertsRef = collection(db, 'food_alerts');
			const q = query(
				alertsRef,
				where('status', '==', 'active'),
				orderBy('created_at', 'desc'),
				limit(5)
			);
			const querySnapshot = await getDocs(q);
			const alerts = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			}));
			setNearbyAlerts(alerts);
		} catch (error) {
			console.error('Error fetching nearby alerts:', error);
			toast.error('Failed to fetch nearby alerts');
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.food_type) newErrors.food_type = 'Food type is required';
		if (!formData.quantity) newErrors.quantity = 'Quantity is required';
		if (!formData.description) newErrors.description = 'Description is required';
		if (!formData.location) newErrors.location = 'Location is required';
		if (!formData.expiry_time) newErrors.expiry_time = 'Expiry time is required';
		if (formData.conditions.length === 0) newErrors.conditions = 'At least one condition is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmitForm = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			toast.error('Please fill in all required fields');
			return;
		}

		try {
			setIsSubmitting(true);
			const auth = getAuth();
			const user = auth.currentUser;

			if (!user) {
				throw new Error('User not authenticated');
			}

			const db = getFirestore();
			const foodAlertsRef = collection(db, 'food_alerts');

			const alertData = {
				...formData,
				provider_id: user.uid,
				provider_name: user.displayName || 'Anonymous Provider',
				status: 'active',
				created_at: serverTimestamp(),
				claimed_by: null,
				passkey: null
			};

			await addDoc(foodAlertsRef, alertData);
			
			toast.success('Food alert created successfully!');
			router.push('/provider/dashboard');
			getNearbyAlerts();
		} catch (error) {
			console.error('Error creating food alert:', error);
			toast.error(error.message || 'Failed to create food alert');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleLocationSelect = (location) => {
		setFormData(prev => ({ ...prev, location }));
		setLocationError('');
	};

	const handleConditionToggle = (condition) => {
		setFormData(prev => ({
			...prev,
			conditions: prev.conditions.includes(condition)
				? prev.conditions.filter(c => c !== condition)
				: [...prev.conditions, condition]
		}));
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-5xl font-bold text-gray-900 mb-4">
						Create Food Alert
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Help reduce food waste by sharing information about available food items in your area.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-white rounded-3xl shadow-2xl overflow-hidden"
				>
					<div className="grid grid-cols-1 lg:grid-cols-2">
						{/* Left side - Form */}
						<div className="p-10 lg:p-14">
							<motion.form onSubmit={handleSubmitForm} className="space-y-10">
								<div className="space-y-8">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										<div className="space-y-3">
											<Label className="text-base font-medium text-gray-700">Restaurant Name</Label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<FaUser className="h-6 w-6 text-gray-400" />
												</div>
												<Input
													className="pl-12 h-12 text-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500"
													{...register("restaurant_name")}
													placeholder="Enter restaurant name"
												/>
											</div>
											{formErrors.restaurant_name && (
												<p className="text-red-500 text-sm">{formErrors.restaurant_name.message}</p>
											)}
										</div>

										<div className="space-y-3">
											<Label className="text-base font-medium text-gray-700">Food Type</Label>
											<div className="relative">
												<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
													<FaUtensils className="h-6 w-6 text-gray-400" />
												</div>
												<select
													{...register("food_type")}
													className={`pl-12 h-12 text-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500 ${
														errors.food_type ? 'border-red-500' : ''
													}`}
												>
													<option value="">Select food type</option>
													<option value="vegetarian">Vegetarian</option>
													<option value="non-vegetarian">Non-Vegetarian</option>
													<option value="vegan">Vegan</option>
												</select>
											</div>
											{errors.food_type && (
												<p className="text-red-500 text-sm">{errors.food_type}</p>
											)}
										</div>
									</div>

									<div className="space-y-3">
										<Label className="text-base font-medium text-gray-700">Quantity</Label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<FaUtensils className="h-6 w-6 text-gray-400" />
											</div>
											<Input
												type="number"
												className={`pl-12 h-12 text-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500 ${
													errors.quantity ? 'border-red-500' : ''
												}`}
												{...register("quantity", { valueAsNumber: true })}
												min={1}
												placeholder="Enter quantity"
											/>
										</div>
										{errors.quantity && (
											<p className="text-red-500 text-sm">{errors.quantity}</p>
										)}
									</div>

									<div className="space-y-3">
										<Label className="text-base font-medium text-gray-700">Discount</Label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
												<FaInfoCircle className="h-6 w-6 text-gray-400" />
											</div>
											<Input
												className="pl-12 pt-4 text-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500 min-h-[150px]"
												{...register("discount")}
												placeholder="e.g., 50%"
											/>
										</div>
										{errors.discount && (
											<p className="text-red-500 text-sm">{errors.discount.message}</p>
										)}
									</div>
								</div>

								<div className="space-y-3">
									<Label className="text-base font-medium text-gray-700">Description</Label>
									<Textarea
										{...register("description")}
										className={`mt-1 block w-full rounded-md border-gray-200 focus:border-pink-500 focus:ring-pink-500 ${
											errors.description ? 'border-red-500' : ''
										}`}
										placeholder="Describe the food items..."
									/>
									{errors.description && (
										<p className="text-red-500 text-sm">{errors.description}</p>
									)}
								</div>

								<div className="space-y-3">
									<Label className="text-base font-medium text-gray-700">Location</Label>
									<LocationPicker onLocationSelect={handleLocationSelect} />
									{locationError && (
										<p className="text-red-500 text-sm">{locationError}</p>
									)}
									{errors.location && (
										<p className="text-red-500 text-sm">{errors.location}</p>
									)}
								</div>

								<div className="space-y-3">
									<Label className="text-base font-medium text-gray-700">Expiry Time</Label>
									<Input
										type="datetime-local"
										{...register("expiry_time")}
										className={`mt-1 block w-full rounded-md border-gray-200 focus:border-pink-500 focus:ring-pink-500 ${
											errors.expiry_time ? 'border-red-500' : ''
										}`}
									/>
									{errors.expiry_time && (
										<p className="text-red-500 text-sm">{errors.expiry_time}</p>
									)}
								</div>

								<div className="space-y-3">
									<Label className="text-base font-medium text-gray-700">Conditions</Label>
									<div className="mt-2 space-y-2">
										{['Must bring container', 'Must collect within 1 hour', 'No delivery available'].map((condition) => (
											<label key={condition} className="flex items-center">
												<input
													type="checkbox"
													{...register("conditions")}
													value={condition}
													onChange={(e) => handleConditionToggle(e.target.value)}
													className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
												/>
												<span className="ml-2 text-sm text-gray-700">{condition}</span>
											</label>
										))}
									</div>
									{errors.conditions && (
										<p className="text-red-500 text-sm">{errors.conditions}</p>
									)}
								</div>

								<Button
									type="submit"
									disabled={isSubmitting}
									className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg transition-all duration-300 ${
										isSubmitting
											? "bg-gray-400 cursor-not-allowed"
											: "bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 shadow-lg hover:shadow-xl"
									}`}
								>
									{isSubmitting ? (
										<div className="flex items-center justify-center">
											<svg className="animate-spin h-6 w-6 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Creating Alert...
										</div>
									) : (
										"Create Food Alert"
									)}
								</Button>
							</motion.form>
						</div>

						{/* Right side - Info */}
						<div className="bg-gradient-to-br from-pink-600 to-orange-500 p-10 lg:p-14 text-white">
							<div className="h-full flex flex-col justify-center">
								<h2 className="text-3xl font-bold mb-8">Why Create a Food Alert?</h2>
								<ul className="space-y-8">
									<li className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
											</svg>
										</div>
										<div>
											<h3 className="text-xl font-semibold mb-2">Reduce Food Waste</h3>
											<p className="text-pink-100 text-lg">Help prevent good food from going to waste by sharing it with those in need.</p>
										</div>
									</li>
									<li className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
											</svg>
										</div>
										<div>
											<h3 className="text-xl font-semibold mb-2">Help Your Community</h3>
											<p className="text-pink-100 text-lg">Make a positive impact by connecting surplus food with people who need it.</p>
										</div>
									</li>
									<li className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
											</svg>
										</div>
										<div>
											<h3 className="text-xl font-semibold mb-2">Easy Process</h3>
											<p className="text-pink-100 text-lg">Simple form to quickly share information about available food items.</p>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
			<ToastContainer
				position="top-right"
				autoClose={1000}
				hideProgressBar={false}
				newestOnTop={true}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			{nearbyAlerts.length > 0 && (
				<div className="mt-12">
					<h2 className="text-3xl font-bold text-gray-900 mb-6">Nearby Alerts</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{nearbyAlerts.map(alert => (
							<motion.div
								key={alert.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="bg-white p-6 rounded-lg shadow-md space-y-4"
							>
								<h3 className="text-xl font-semibold text-gray-900">{alert.restaurant_name}</h3>
								<p className="text-gray-600">{alert.description}</p>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-500">{alert.location ? `${alert.location.latitude}, ${alert.location.longitude}` : 'Location not provided'}</span>
									<span className="text-sm text-gray-500">{alert.quantity} kg</span>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
