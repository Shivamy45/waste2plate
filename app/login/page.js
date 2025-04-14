"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import RecaptchaVerifierComponent from '../../components/RecaptchaVerifier';

const LoginPage = () => {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [otp, setOtp] = useState("");
	const [showOtpInput, setShowOtpInput] = useState(false);
	const [role, setRole] = useState("giver");
	const [isLoading, setIsLoading] = useState(false);
	const [confirmationResult, setConfirmationResult] = useState(null);
	const router = useRouter();
	const recaptchaVerifierRef = useRef(null);

	const handleRecaptchaReady = (verifier) => {
		recaptchaVerifierRef.current = verifier;
	};

	const handleSendOtp = async (e) => {
		e.preventDefault();
		if (!recaptchaVerifierRef.current) {
			toast.error("reCAPTCHA not initialized");
			return;
		}

		try {
			setIsLoading(true);
			const auth = getAuth();
			const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
			
			const confirmationResult = await signInWithPhoneNumber(
				auth,
				formattedPhoneNumber,
				recaptchaVerifierRef.current
			);
			
			setConfirmationResult(confirmationResult);
			setShowOtpInput(true);
			toast.success("OTP sent successfully!");
		} catch (error) {
			console.error("Error sending OTP:", error);
			toast.error("Failed to send OTP. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		if (!confirmationResult) {
			toast.error("No OTP verification in progress");
			return;
		}

		try {
			setIsLoading(true);
			const result = await confirmationResult.confirm(otp);
			const user = result.user;
			
			// Check if user exists in Firestore
			const userDocRef = doc(db, "users", user.uid);
			const userDoc = await getDoc(userDocRef);
			
			if (!userDoc.exists()) {
				// Create new user document
				await setDoc(userDocRef, {
					uid: user.uid,
					phoneNumber: user.phoneNumber,
					role: role,
					createdAt: new Date().toISOString(),
					lastLogin: new Date().toISOString()
				});
			} else {
				// Update last login time for existing user
				await setDoc(userDocRef, {
					lastLogin: new Date().toISOString()
				}, { merge: true });
			}
			
			// Redirect based on role
			if (role === "giver") {
				router.push("/provider");
			} else {
				router.push("/consumer");
			}
		} catch (error) {
			console.error("Error verifying OTP:", error);
			toast.error("Invalid OTP. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
			>
				<h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Login</h1>
				
				<form className="mt-8 space-y-6" onSubmit={showOtpInput ? handleVerifyOtp : handleSendOtp}>
					<div className="rounded-md shadow-sm -space-y-px">
						{!showOtpInput ? (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number
									</label>
									<input
										type="tel"
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
										placeholder="Enter your phone number"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Role
									</label>
									<select
										value={role}
										onChange={(e) => setRole(e.target.value)}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									>
										<option value="giver">Food Provider</option>
										<option value="receiver">Food Receiver</option>
									</select>
								</div>
							</>
						) : (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Enter OTP
								</label>
								<input
									type="text"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									placeholder="Enter OTP"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									required
								/>
							</div>
						)}
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading}
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
						>
							{isLoading ? (
								<span className="absolute left-0 inset-y-0 flex items-center pl-3">
									<svg
										className="animate-spin h-5 w-5 text-white"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								</span>
							) : null}
							{showOtpInput ? "Verify OTP" : "Send OTP"}
						</button>
					</div>
				</form>
				<RecaptchaVerifierComponent onVerifierReady={handleRecaptchaReady} />
			</motion.div>
			<ToastContainer />
		</div>
	);
};

export default LoginPage;
