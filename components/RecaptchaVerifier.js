import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, getAuth } from "firebase/auth";
import { app } from "../firebase/config";

const RecaptchaVerifierComponent = ({ onVerifierReady }) => {
	const [isBrowser, setIsBrowser] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const recaptchaVerifierRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		if (typeof window === "undefined") return;
		setIsBrowser(true);

		const initializeRecaptcha = async () => {
			if (isInitialized) {
				console.log("reCAPTCHA already initialized, skipping...");
				return;
			}

			try {
				// Clear existing reCAPTCHA if any
				if (recaptchaVerifierRef.current) {
					try {
						recaptchaVerifierRef.current.clear();
					} catch (err) {
						console.warn("Error clearing existing reCAPTCHA:", err);
					}
				}

				if (window.recaptchaVerifier) {
					console.log("Cleaning up old global reCAPTCHA");
					delete window.recaptchaVerifier;
				}

				const container = document.getElementById("recaptcha-container");
				if (!container) {
					console.log("Waiting for reCAPTCHA container...");
					return;
				}

				const auth = getAuth(app);
				if (!auth) {
					console.error("Firebase Auth not initialized");
					return;
				}

				recaptchaVerifierRef.current = new RecaptchaVerifier(
					"recaptcha-container",
					{
						size: "invisible",
						callback: (response) => {
							console.log("reCAPTCHA verified:", response);
						},
						"expired-callback": () => {
							console.log("reCAPTCHA expired");
						}
					},
					auth
				);

				window.recaptchaVerifier = recaptchaVerifierRef.current;

				if (onVerifierReady) {
					onVerifierReady(recaptchaVerifierRef.current);
				}

				setIsInitialized(true);
				console.log("reCAPTCHA initialized");
			} catch (error) {
				console.error("Error initializing reCAPTCHA:", error);
			}
		};

		initializeRecaptcha();

		return () => {
			try {
				if (recaptchaVerifierRef.current) {
					recaptchaVerifierRef.current.clear();
					console.log("reCAPTCHA cleared on unmount");
				}
				delete window.recaptchaVerifier;
				setIsInitialized(false);
			} catch (error) {
				console.error("Error cleaning up reCAPTCHA:", error);
			}
		};
	}, [onVerifierReady, isInitialized]);

	if (!isBrowser) return null;

	return (
		<div
			id="recaptcha-container"
			ref={containerRef}
			className="hidden"
			aria-hidden="true"
			style={{ display: "none" }}
		/>
	);
};

export default RecaptchaVerifierComponent;
