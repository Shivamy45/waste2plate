"use client";
import { useState } from "react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { useRouter } from "next/navigation";

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const router = useRouter();

	return (
		<nav className="flex items-center justify-between px-5 py-2">
			<div>
				<Image src="/logo.png" alt="Logo" width={120} height={80} />
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
						<Link href="/faqs" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}>
								FAQs
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<Link href="/faqs" legacyBehavior passHref>
							<NavigationMenuLink
								className={navigationMenuTriggerStyle()}>
								Contact Us
							</NavigationMenuLink>
						</Link>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<div className="flex gap-4 justify-center items-center">
				<div className="rounded-3xl p-2 cursor-pointer border-2">
					<FaBell size={21} />
				</div>
			</div>
					{/* if(isSignup=? */}
		</nav>
	);
};

export default Navbar;
