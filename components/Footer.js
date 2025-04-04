import Image from "next/image";
import Link from "next/link";
import React from "react";
const Footer = () => {
	return (
		<footer className="flex bg-black items-center justify-between text-gray-300 px-5">
			<div className="flex justify-center items-center">
                <Image src="/logo.png" alt="Logo" width={60} height={60} />
                <span>Waste2Plate</span>
			</div>
            <div>
                <ul className="flex gap-4">
                    <li>
                        <span>&copy; Waste2Plate. All rights reserverd.</span>
                    </li>
                    <li>
                        <Link href={"/github"}>Github</Link>
                    </li>
                    <li>
                        <Link href={"/linkedin"}>LinkedIn</Link>
                    </li>
                    <li>
                        <Link href={"/instagram"}>Instagram</Link>
                    </li>
                </ul>
            </div>
		</footer>
	);
};

export default Footer;
