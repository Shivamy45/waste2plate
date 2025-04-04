"use client";
import { useState } from "react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<nav className="flex items-center justify-between px-5">
			<div>
				<Image src="/logo.png" alt="Logo" width={80} height={80} />
			</div>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<Link href="/" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}>
								Home
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/faqs" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}>
								Join Us
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<div className="relative">
							<Button
								variant="outline"
								className={
									"btn"
								}
								onClick={() => setDropdownOpen(!dropdownOpen)}
								onMouseEnter={() =>
									setDropdownOpen(!dropdownOpen)
								}
								onMouseLeave={() =>
									setDropdownOpen(!dropdownOpen)
								}>
								Free Food
							</Button>
							{dropdownOpen && (
								<div className="absolute mt-2 w-48 bg-white border rounded shadow-md">
									<Link
										href="/food-alerts"
										className="block px-4 py-2 hover:bg-gray-100">
										Food Giveaways
									</Link>
									<Link
										href="/dashboard"
										className="block px-4 py-2 hover:bg-gray-100">
										Donate Food
									</Link>
								</div>
							)}
						</div>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/faqs" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}>
								FAQs
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<Button
				asChild
				className={"btn text-black"}>
				<Link href="/sign-in">Login</Link>
			</Button>
		</nav>
	);
};

export default Navbar;
