"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const page = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 mt-12 pt-12">
			<main className="container mx-auto px-4 py-12">
				{/* Hero Section */}
				<motion.section 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-20 relative"
				>
					<motion.div 
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="absolute -top-20 -left-20 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-50"
					/>
					<motion.div 
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-200 rounded-full blur-3xl opacity-50"
					/>
					<h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600 relative z-10">
						Discover Free Food Near You
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed relative z-10">
						Connect with local food providers or find hungry customers. 
						FoodAlert brings fresh food options right to your fingertips!
					</p>
				</motion.section>

				{/* Cards Section */}
				<div className="relative max-w-5xl mx-auto mb-20">
					<div className="relative z-10 grid md:grid-cols-2 gap-8">
						{/* Consumer Card */}
						<motion.div 
							whileHover={{ scale: 1.02, y: -5 }}
							className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-orange-100 hover:border-orange-200 transition-all duration-300 group"
						>
							<div className="p-8">
								<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-200 transition-colors duration-300">
									<svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">
									Are you a Consumer?
								</h3>
								<p className="text-gray-600 mb-8 leading-relaxed">
									Discover local food deals, special offers,
									and fresh meals delivered to your doorstep.
								</p>
								<Link href="/login?role=receiver&signup=true" className="block w-full h-full">
									<button className="w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-100 shadow-lg cursor-pointer active:scale-95">
										Get Started
									</button>
								</Link>
							</div>
						</motion.div>

						{/* Provider Card */}
						<motion.div 
							whileHover={{ scale: 1.02, y: -5 }}
							className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-green-100 hover:border-green-200 transition-all duration-300 group"
						>
							<div className="p-8">
								<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
									<svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
									</svg>
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-green-600 transition-colors duration-300">
									Are you a Provider?
								</h3>
								<p className="text-gray-600 mb-8 leading-relaxed">
									Reach more customers, reduce food waste, and
									grow your food business with our platform.
								</p>
								<Link href="/login?role=giver&signup=true" className="block w-full h-full">
									<button className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-100 shadow-lg cursor-pointer active:scale-95">
										Get Started
									</button>
								</Link>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Process Section */}
				<div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-20 border border-orange-100 relative overflow-hidden">
					<motion.div 
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5 }}
						className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full blur-3xl opacity-30"
					/>
					{/* Main quote */}
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-12 relative z-10"
					>
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							"You hate food waste. So do we. Let's fix it together."
						</h1>
						<div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
					</motion.div>

					{/* Four steps grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
						{/* Step 1 */}
						<motion.div 
							whileHover={{ scale: 1.05, y: -5 }}
							className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:border-orange-200 transition-all duration-300 group"
						>
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors duration-300">
								<span className="text-orange-500 font-bold">1</span>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">SIGN UP</h3>
							<p className="text-gray-600 leading-relaxed">
								Whether you're a student, a professional, or just someone who cares about reducing food waste, join us and save food.
							</p>
						</motion.div>

						{/* Step 2 */}
						<motion.div 
							whileHover={{ scale: 1.05, y: -5 }}
							className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:border-orange-200 transition-all duration-300 group"
						>
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors duration-300">
								<span className="text-orange-500 font-bold">2</span>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">VERIFY EMAILS</h3>
							<p className="text-gray-600 leading-relaxed">
								Check your inbox to confirm your email and activate your account. Once verified, you'll start receiving updates on available free food near you.
							</p>
						</motion.div>

						{/* Step 3 */}
						<motion.div 
							whileHover={{ scale: 1.05, y: -5 }}
							className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:border-orange-200 transition-all duration-300 group"
						>
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors duration-300">
								<span className="text-orange-500 font-bold">3</span>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">RECEIVE ALERTS</h3>
							<p className="text-gray-600 leading-relaxed">
								Set up email and mobile notifications to get real-time updates on available free food in your area.
							</p>
						</motion.div>

						{/* Step 4 */}
						<motion.div 
							whileHover={{ scale: 1.05, y: -5 }}
							className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:border-orange-200 transition-all duration-300 group"
						>
							<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors duration-300">
								<span className="text-orange-500 font-bold">4</span>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">PICKUP FOOD</h3>
							<p className="text-gray-600 leading-relaxed">
								End food waste by picking up free food at or by collecting surplus food from participating locations, events, and businesses.
							</p>
						</motion.div>
					</div>

					{/* CTA Section */}
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="mt-16 text-center relative z-10"
					>
						<h2 className="text-3xl font-bold text-gray-800 mb-6">HELP SAVE FOOD TODAY</h2>
						<Link href="/donate" className="inline-block">
							<button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-200 cursor-pointer">
								Donate Now
							</button>
						</Link>
					</motion.div>
				</div>
			</main>
		</div>
	);
};

export default page;
