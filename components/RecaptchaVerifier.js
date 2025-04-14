import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, getAuth } from "firebase/auth";
import { app } from "../firebase/config";

const RecaptchaVerifierComponent = ({ onVerifierReady }) => {
	const [isBrowser, setIsBrowser] = useState(false);
	const recaptchaVerifierRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		// Guard against SSR
		if (typeof window === "undefined") return;

		// Set browser state
		setIsBrowser(true);

		const initializeRecaptcha = async () => {
			try {
				// Check if recaptcha is already initialized globally
				if (window.recaptchaVerifier) {
					console.log("Using existing reCAPTCHA instance");
					recaptchaVerifierRef.current = window.recaptchaVerifier;
					if (onVerifierReady) {
						onVerifierReady(recaptchaVerifierRef.current);
					}
					return;
				}

				// Clear existing recaptcha if any
				if (recaptchaVerifierRef.current) {
					try {
						recaptchaVerifierRef.current.clear();
					} catch (error) {
						console.warn(
							"Error clearing existing reCAPTCHA:",
							error
						);
					}
				}

				// Ensure container exists
				const container = document.getElementById(
					"recaptcha-container"
				);
				if (!container) {
					console.log("Waiting for reCAPTCHA container...");
					return;
				}

				// Initialize Firebase Auth
				const auth = getAuth(app);
				if (!auth) {
					console.error("Firebase Auth initialization failed");
					return;
				}

				// Create reCAPTCHA options without disabling verification
				const recaptchaOptions = {
					size: "invisible",
					callback: (response) => {
						console.log("reCAPTCHA verified:", response);
					},
					"expired-callback": () => {
						console.log("reCAPTCHA expired");
					},
				};

				console.log(
					"Initializing new reCAPTCHA instance with options:",
					recaptchaOptions
				);
				recaptchaVerifierRef.current = new RecaptchaVerifier(
					"recaptcha-container",
					recaptchaOptions,
					auth
				);

				// Store in window for reuse
				window.recaptchaVerifier = recaptchaVerifierRef.current;

				if (onVerifierReady) {
					onVerifierReady(recaptchaVerifierRef.current);
				}

				console.log("reCAPTCHA initialized successfully");
			} catch (error) {
				console.error("Error initializing reCAPTCHA:", error);
			}
		};

		// Try to initialize reCAPTCHA immediately
		initializeRecaptcha();

		// Cleanup
		return () => {
			if (recaptchaVerifierRef.current) {
				try {
					recaptchaVerifierRef.current.clear();
					console.log("reCAPTCHA cleared");
				} catch (error) {
					console.error("Error clearing reCAPTCHA:", error);
				}
			}
		};
	}, [onVerifierReady]);

	// Return null during SSR
	if (!isBrowser) {
		return null;
	}

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
