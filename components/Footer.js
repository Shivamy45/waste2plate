"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
	return (
		<footer className="bg-white/30 backdrop-blur-md border-t border-white/20 text-gray-800 px-5 py-8 w-full">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Logo and Description */}
					<div className="flex flex-col items-center md:items-start">
						<Image
							src="/logo.png"
							alt="Waste2Plate Logo"
							width={120}
							height={60}
							className="mb-4"
						/>
						<p className="text-gray-600 text-sm max-w-xs text-center md:text-left">
							Transforming food waste into opportunities, one plate at a time.
						</p>
					</div>

					{/* Quick Links */}
					<div className="flex flex-col items-center md:items-start">
						<h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
						<ul className="space-y-2">
							<motion.li whileHover={{ x: 5 }}>
								<Link href="/" className="text-gray-600 hover:text-orange-500 transition-colors">
									Home
								</Link>
							</motion.li>
							<motion.li whileHover={{ x: 5 }}>
								<Link href="/about" className="text-gray-600 hover:text-orange-500 transition-colors">
									About Us
								</Link>
							</motion.li>
							<motion.li whileHover={{ x: 5 }}>
								<Link href="/contact" className="text-gray-600 hover:text-orange-500 transition-colors">
									Contact
								</Link>
							</motion.li>
						</ul>
					</div>

					{/* Social Links */}
					<div className="flex flex-col items-center md:items-start">
						<h3 className="text-lg font-semibold mb-4 text-gray-800">Connect With Us</h3>
						<div className="flex space-x-4">
							<motion.a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.1 }}
								className="text-gray-600 hover:text-orange-500 transition-colors"
							>
								<FaGithub size={24} />
							</motion.a>
							<motion.a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.1 }}
								className="text-gray-600 hover:text-orange-500 transition-colors"
							>
								<FaLinkedin size={24} />
							</motion.a>
							<motion.a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								whileHover={{ scale: 1.1 }}
								className="text-gray-600 hover:text-orange-500 transition-colors"
							>
								<FaInstagram size={24} />
							</motion.a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-6 border-t border-gray-200 text-center">
					<p className="text-gray-600 text-sm">
						&copy; {new Date().getFullYear()} Waste2Plate. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
