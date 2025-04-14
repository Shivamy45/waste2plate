"use client";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "../../firebase/config";
import { motion, AnimatePresence } from "framer-motion";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";

export default function LoginPage() {
	const [isSignup, setIsSignup] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("giver");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	useEffect(() => {
		const roleFromUrl = searchParams.get("role");
		const signupFromUrl = searchParams.get("signup");
		
		if (roleFromUrl) {
			setRole(roleFromUrl);
		}
		if (signupFromUrl === "true") {
			setIsSignup(true);
		}
	}, [searchParams]);

	const handleSubmit = async () => {
		if (isLoading) return; // Prevent multiple clicks
		
		try {
			setIsLoading(true);
			let userCredential;

			if (isSignup) {
				// Signup flow
				userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				await setDoc(doc(db, "users", userCredential.user.uid), {
					email,
					role,
				});
			} else {
				// Login flow
				userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
			}

			// Get user role from Firestore
			const userRef = doc(db, "users", userCredential.user.uid);
			const userSnap = await getDoc(userRef);
			const userData = userSnap.data();

			// Redirect based on role
			if (userData?.role === "giver") {
				router.push("/dashboard");
			} else {
				router.push("/user-page");
			}
		} catch (err) {
			toast(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 mt-12 pt-12">
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
			
			{/* Background Blobs */}
			<motion.div 
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="absolute -top-40 -left-40 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-50"
			/>
			<motion.div 
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-50"
			/>

			<motion.div 
				layout
				className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6 relative z-10 border border-orange-100"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<motion.div 
					layout
					className="text-center"
					transition={{ duration: 0.3 }}
				>
					<AnimatePresence mode="wait">
						<motion.h1 
							key={isSignup ? "signup" : "login"}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600"
						>
							{isSignup ? "Create Account" : "Welcome Back"}
						</motion.h1>
					</AnimatePresence>
					<AnimatePresence mode="wait">
						<motion.p 
							key={isSignup ? "signup-sub" : "login-sub"}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="text-gray-600 mt-2"
						>
							{isSignup ? "Join our community today" : "Sign in to continue"}
						</motion.p>
					</AnimatePresence>
				</motion.div>

				<motion.div 
					layout
					className="space-y-4"
					transition={{ 
						duration: 0.4,
						ease: "easeInOut",
						layout: { duration: 0.3 }
					}}
				>
					<AnimatePresence mode="wait">
						<motion.div 
							key="email-field"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="space-y-2"
						>
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</motion.div>
					</AnimatePresence>

					<AnimatePresence mode="wait">
						<motion.div 
							key="password-field"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							className="space-y-2"
						>
							<label className="block text-sm font-medium text-gray-700">Password</label>
							<input
								type="password"
								placeholder="Enter your password"
								className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</motion.div>
					</AnimatePresence>

					<AnimatePresence mode="wait">
						{isSignup && (
							<motion.div 
								key="role-selection"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ 
									duration: 0.3,
									ease: "easeInOut",
									height: { duration: 0.2 }
								}}
								className="space-y-3 pt-2"
							>
								<label className="block text-sm font-medium text-gray-700">Select Role</label>
								<div className="grid grid-cols-2 gap-3">
									<motion.label 
										whileHover={{ scale: 1.02 }}
										className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
											role === "giver" 
												? "border-orange-500 bg-orange-50" 
												: "border-gray-200 hover:border-orange-200"
										}`}
									>
										<input
											type="radio"
											name="role"
											value="giver"
											checked={role === "giver"}
											onChange={() => setRole("giver")}
											className="hidden"
										/>
										<div className={`w-4 h-4 rounded-full border-2 ${
											role === "giver" ? "border-orange-500 bg-orange-500" : "border-gray-300"
										}`} />
										<span className="text-sm">Giver</span>
									</motion.label>

									<motion.label 
										whileHover={{ scale: 1.02 }}
										className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
											role === "receiver" 
												? "border-orange-500 bg-orange-50" 
												: "border-gray-200 hover:border-orange-200"
										}`}
									>
										<input
											type="radio"
											name="role"
											value="receiver"
											checked={role === "receiver"}
											onChange={() => setRole("receiver")}
											className="hidden"
										/>
										<div className={`w-4 h-4 rounded-full border-2 ${
											role === "receiver" ? "border-orange-500 bg-orange-500" : "border-gray-300"
										}`} />
										<span className="text-sm">Receiver</span>
									</motion.label>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence mode="wait">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							transition={{ duration: 0.2 }}
							onClick={handleSubmit}
							disabled={isLoading}
							className={`relative w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-orange-200/50 group ${
								isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
							}`}
						>
							<div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
							<AnimatePresence mode="wait">
								<motion.span 
									key={isLoading ? "loading" : isSignup ? "signup" : "login"}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 10 }}
									transition={{ duration: 0.2 }}
									className="relative flex items-center justify-center gap-2"
								>
									{isLoading ? (
										<>
											<svg 
												className="animate-spin h-5 w-5 text-white" 
												xmlns="http://www.w3.org/2000/svg" 
												fill="none" 
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<circle 
													className="opacity-25" 
													cx="12" 
													cy="12" 
													r="10" 
													stroke="currentColor" 
													strokeWidth="4"
												/>
												<path 
													className="opacity-75" 
													fill="currentColor" 
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											<span>Processing...</span>
										</>
									) : (
										<>
											<span>{isSignup ? "Create Account" : "Sign In"}</span>
											<svg 
												className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
												fill="none" 
												stroke="currentColor" 
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path 
													strokeLinecap="round" 
													strokeLinejoin="round" 
													strokeWidth={2} 
													d="M13 7l5 5m0 0l-5 5m5-5H6" 
												/>
											</svg>
										</>
									)}
								</motion.span>
							</AnimatePresence>
						</motion.button>
					</AnimatePresence>
				</motion.div>

				<AnimatePresence mode="wait">
					<motion.div 
						key={isSignup ? "signup-switch" : "login-switch"}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="text-center"
					>
						<p className="text-sm text-gray-600">
							{isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
							<button
								onClick={() => setIsSignup(!isSignup)}
								className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-300 cursor-pointer"
							>
								{isSignup ? "Sign in here" : "Create one here"}
							</button>
						</p>
					</motion.div>
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
