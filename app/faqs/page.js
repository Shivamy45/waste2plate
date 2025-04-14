"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
	{
		question: "What is Waste2Plate?",
		answer: "Waste2Plate is a platform that connects food donors with those in need, helping to reduce food waste and fight hunger in our communities.",
	},
	{
		question: "How does the donation process work?",
		answer: "As a food donor, you can list available food items on our platform. Receivers can browse these listings and request the food they need. We facilitate the connection and ensure safe food handling practices.",
	},
	{
		question: "Is there any cost involved?",
		answer: "No, Waste2Plate is completely free to use. Our mission is to reduce food waste and help those in need without any financial barriers.",
	},
	{
		question: "What types of food can be donated?",
		answer: "We accept non-perishable food items, fresh produce, and prepared food that meets food safety standards. All donations must be properly packaged and within their safe consumption period.",
	},
	{
		question: "How do I ensure food safety?",
		answer: "We provide guidelines for safe food handling and storage. All donors must follow these guidelines, and we encourage receivers to verify the condition of food before accepting it.",
	},
	{
		question: "Can I donate as an individual or only as a business?",
		answer: "Both individuals and businesses can donate food through our platform. We welcome all types of donors who want to help reduce food waste.",
	},
];

export default function FAQPage() {
	const [openIndex, setOpenIndex] = useState(null);

	const toggleFAQ = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 mt-12 pt-12 pb-12 px-4 sm:px-6 lg:px-8">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-3xl mx-auto">
				<div className="text-center mb-12">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-600 mb-4">
						Frequently Asked Questions
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="text-gray-600 text-lg">
						Find answers to common questions about Waste2Plate
					</motion.p>
				</div>

				<div className="space-y-4">
					{faqs.map((faq, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 * index }}
							className="bg-white/80 backdrop-blur-md rounded-xl shadow-md overflow-hidden border border-orange-100">
							<button
								onClick={() => toggleFAQ(index)}
								className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
								<span className="text-lg font-medium text-gray-800">
									{faq.question}
								</span>
								<motion.div
									animate={{
										rotate: openIndex === index ? 180 : 0,
									}}
									transition={{ duration: 0.3 }}
									className="text-orange-500">
									{openIndex === index ? (
										<FaChevronUp />
									) : (
										<FaChevronDown />
									)}
								</motion.div>
							</button>

							<AnimatePresence>
								{openIndex === index && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="overflow-hidden">
										<div className="px-6 py-4 bg-orange-50/50">
											<p className="text-gray-600">
												{faq.answer}
											</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.8 }}
					className="mt-12 text-center">
					<p className="text-gray-600 mb-4">
						Still have questions? Contact our support team
					</p>
					<a
						href="/contact"
						className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200">
						Contact Support
					</a>
				</motion.div>
			</motion.div>
		</div>
	);
}
