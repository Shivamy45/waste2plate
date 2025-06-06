"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { auth, messaging } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getToken } from "firebase/messaging";

const Navbar = () => {
	const router = useRouter();
	const [showNotifications, setShowNotifications] = useState(false);
	const [isBellShaking, setIsBellShaking] = useState(false);
	const [isBellClicking, setIsBellClicking] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const bellRef = useRef(null);
	const dropdownRef = useRef(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Function to navigate to the home page when the logo is clicked
	const navigateHome = (e) => {
		e.preventDefault();
		router.push("/");
	};

	// Function to handle bell click with animation
	const handleBellClick = (e) => {
		e.preventDefault();
		if (isBellClicking) return;

		setIsBellClicking(true);
		setIsBellShaking(true);
		setShowNotifications(!showNotifications);

		// Use requestAnimationFrame for smoother animation
		requestAnimationFrame(() => {
			setTimeout(() => {
				setIsBellShaking(false);
				setIsBellClicking(false);
			}, 500);
		});
	};

	// Add click outside handler
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				showNotifications &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target) &&
				bellRef.current &&
				!bellRef.current.contains(event.target)
			) {
				setShowNotifications(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showNotifications]);

	useEffect(() => {
		if (!messaging) return;

		// Listen for foreground messages
		const unsubscribe = onMessage(messaging, (payload) => {
			console.log("Received foreground message:", payload);

			// Add new notification to the list
			setNotifications((prev) => [
				{
					id: Date.now(),
					message: payload.notification?.body || "New notification",
					time: "Just now",
					title: payload.notification?.title || "New Alert",
				},
				...prev,
			]);

			// Trigger bell shake animation
			setIsBellShaking(true);
			setTimeout(() => setIsBellShaking(false), 500);

			// Show toast notification
			toast.info(
				<div>
					<h3 className="font-semibold">
						{payload.notification?.title}
					</h3>
					<p>{payload.notification?.body}</p>
				</div>,
				{
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				}
			);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (user && messaging) {
			requestNotificationPermission();
		}
	}, [user]);

	const requestNotificationPermission = async () => {
		try {
			const permission = await Notification.requestPermission();
			if (permission === "granted") {
				const token = await getToken(messaging, {
					vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
				});
				console.log("FCM Token:", token);
			}
		} catch (error) {
			console.error("Error getting FCM token:", error);
		}
	};

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			toast.success("Signed out successfully");
			router.push("/");
		} catch (error) {
			console.error("Error signing out:", error);
			toast.error("Error signing out");
		}
	};

	if (loading) {
		return null;
	}

	return (
		<nav className="flex items-center justify-between px-5 py-2 mb-1 bg-white/30 backdrop-blur-md border-b border-white/20 fixed top-0 left-0 right-0 z-50">
			{/* Logo Section */}
			<Link href="/" className="block">
				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{ duration: 0.1 }}
					className="cursor-pointer">
					<Image
						src="/logo.png"
						alt="Logo"
						height={80}
						width={120}
					/>
				</motion.div>
			</Link>

			{/* Navigation Menu */}
			<ul className="flex items-center gap-8">
				<motion.li
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.1 }}>
					<Link
						href="/"
						className="block text-gray-700 hover:text-orange-500 transition-colors font-medium py-2 px-3">
						Home
					</Link>
				</motion.li>
				<motion.li
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.1 }}>
					<Link
						href="https://chat.whatsapp.com/HnCutFbUzJ4LUlkbRiF1Qz"
						className="block text-gray-700 hover:text-orange-500 transition-colors font-medium py-2 px-3">
						Join Us
					</Link>
				</motion.li>
				<motion.li
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.1 }}>
					<Link
						href="/faqs"
						className="block text-gray-700 hover:text-orange-500 transition-colors font-medium py-2 px-3">
						FAQs
					</Link>
				</motion.li>
				<motion.li
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.1 }}>
					<Link
						href="/terms"
						className="block text-gray-700 hover:text-orange-500 transition-colors font-medium py-2 px-3">
						Terms & Condition
					</Link>
				</motion.li>
			</ul>

			{/* Notification Icon */}
			<div className="flex gap-4 justify-center items-center">
				<motion.div
					ref={bellRef}
					className="relative cursor-pointer group p-2"
					onClick={handleBellClick}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					transition={{ duration: 0.1 }}
					style={{ pointerEvents: isBellClicking ? "none" : "auto" }}>
					<FaBell
						size={24}
						className={`text-gray-700 group-hover:text-orange-500 transition-colors ${
							isBellShaking ? "animate-bell-shake" : ""
						}`}
					/>
					{/* Notification Badge */}
					{notifications.length > 0 && (
						<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
							{notifications.length}
						</span>
					)}
				</motion.div>

				{/* Notifications Dropdown */}
				{showNotifications && (
					<motion.div
						ref={dropdownRef}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						className="absolute top-16 right-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
						<div className="px-4 py-2 border-b border-gray-100">
							<h3 className="font-semibold text-gray-800">
								Notifications
							</h3>
						</div>
						<div className="max-h-96 overflow-y-auto">
							{notifications.length > 0 ? (
								notifications.map((notification) => (
									<motion.div
										key={notification.id}
										className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
										whileHover={{ x: 5 }}>
										<h4 className="font-medium text-gray-900">
											{notification.title}
										</h4>
										<p className="text-sm text-gray-600">
											{notification.message}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											{notification.time}
										</p>
									</motion.div>
								))
							) : (
								<div className="px-4 py-6 text-center text-gray-500">
									No notifications yet
								</div>
							)}
						</div>
					</motion.div>
				)}

				<Link href="/login" className="block">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ duration: 0.1 }}
						className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-100 shadow-md hover:shadow-lg hover:shadow-orange-200/50 group cursor-pointer w-full h-full">
						<div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
						<span className="relative flex items-center gap-2">
							Login
							<svg
								className="w-4 h-4 transition-transform duration-100 group-hover:translate-x-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 7l5 5m0 0l-5 5m5-5H6"
								/>
							</svg>
						</span>
					</motion.button>
				</Link>
			</div>

			{/* Add the animation keyframes to the global styles */}
			<style jsx global>{`
				@keyframes bell-shake {
					0% {
						transform: rotate(0deg);
					}
					25% {
						transform: rotate(-15deg);
					}
					50% {
						transform: rotate(15deg);
					}
					75% {
						transform: rotate(-10deg);
					}
					100% {
						transform: rotate(0deg);
					}
				}
				.animate-bell-shake {
					animation: bell-shake 0.5s ease-in-out;
					transform-origin: top center;
				}
			`}</style>
		</nav>
	);
};

export default Navbar;
