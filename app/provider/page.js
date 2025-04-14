"use client";
import FoodAlertForm from "../../components/FoodAlertForm";
import React from "react";
import { motion } from "framer-motion";

const ProviderPage = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="flex justify-center">
					<FoodAlertForm />
				</motion.div>
			</div>
		</motion.div>
	);
};

export default ProviderPage;
