"use client";
import React from "react";
import { motion } from "framer-motion";

const TermsPage = () => {
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<motion.div
			className="max-w-4xl mx-auto px-4 py-12 mt-12 text-gray-800"
			initial="hidden"
			animate="visible"
			variants={containerVariants}>
			<motion.div variants={itemVariants} className="text-center mb-16">
				<h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
					Terms & Conditions
				</h1>
				<p className="text-sm text-gray-500">
					Last Updated: {new Date().toLocaleDateString()}
				</p>
			</motion.div>

			<motion.div variants={itemVariants} className="space-y-16">
				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Introduction
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						By using the Waste2Plate Application, you agree to all
						terms & conditions and acknowledge your responsibility
						to check for updates regularly. If you do not agree with
						these terms, please do not use the Application.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Use of the Application
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						The app provides alerts about free food available on
						university campuses to reduce food waste and address
						hunger.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Conditions
					</h2>
					<ul className="space-y-4 text-gray-700 text-lg">
						<li className="flex items-start gap-3">
							<span className="text-pink-500 font-semibold min-w-[120px]">
								Eligibility:
							</span>
							<span>Must be 18 or older.</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-pink-500 font-semibold min-w-[120px]">
								Rules:
							</span>
							<span>
								Follow all posted rules and event host
								instructions.
							</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-pink-500 font-semibold min-w-[120px]">
								Inherent Risks:
							</span>
							<span>
								You assume all risks including allergies,
								dietary issues, and foodborne illness.
							</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-pink-500 font-semibold min-w-[120px]">
								Accuracy:
							</span>
							<span>
								Hosts are responsible for alert accuracy.
								Waste2Plate is not liable for inaccuracies.
							</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-pink-500 font-semibold min-w-[120px]">
								Privacy:
							</span>
							<span>
								Your data is handled according to our Privacy
								Policy.
							</span>
						</li>
						<li className="flex items-start gap-3">
							<span className="text-pink-500 font-semibold min-w-[120px]">
								Governing Law:
							</span>
							<span>Governed by laws of Florida, USA.</span>
						</li>
					</ul>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Disclaimer & Liability
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						The app is provided "as is." Waste2Plate disclaims all
						warranties and is not liable for any damages arising
						from use.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Indemnification
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						You agree to defend and hold harmless Waste2Plate and
						its affiliates from any claims or liabilities related to
						your use of the Application.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Intellectual Property
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						All app content belongs to Waste2Plate. You may not use
						or reproduce content without permission.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Privacy Policy
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						Your personal data (e.g., email, name) is used to
						provide services and improve the app. Data may be shared
						with service providers and affiliates under certain
						conditions.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Security
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						We strive to protect your data but cannot guarantee 100%
						security over the internet.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Children's Privacy
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						The service is not intended for users under 13. If such
						data is found, it will be deleted.
					</p>
				</section>

				<section className="relative">
					<div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></div>
					<h2 className="text-3xl font-semibold text-pink-500 mb-6">
						Changes
					</h2>
					<p className="text-gray-700 leading-relaxed text-lg">
						Terms and the privacy policy may change. Continued use
						means you accept these updates.
					</p>
				</section>
			</motion.div>

			<motion.footer
				variants={itemVariants}
				className="text-sm text-gray-600 mt-16 text-center border-t border-gray-200 pt-8"></motion.footer>
		</motion.div>
	);
};

export default TermsPage;
