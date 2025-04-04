import Image from "next/image";
import Link from "next/link";
import React from "react";

export Footer = () => {
    return (
        <footer className="flex items-center justify-between text-gray-800 px-5 py-3">
            <div className="flex justify-center items-center">
                <Image src="/logo.png" alt="Waste2Plate Logo" width={120} height={60} />
            </div>
            <div>
                <ul className="flex gap-4">
                    <li>
                        <span>&copy; Waste2Plate. All rights reserved.</span>
                    </li>
                    <li>
                        <Link href="https://github.com">Github</Link>
                    </li>
                    <li>
                        <Link href="https://linkedin.com">LinkedIn</Link>
                    </li>
                    <li>
                        <Link href="https://instagram.com">Instagram</Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};
