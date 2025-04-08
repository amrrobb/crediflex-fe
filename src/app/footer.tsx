"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Footer() {
	return (
		<motion.footer className="border-t border-zinc-800 bg-black py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<Link href="/">
						<div className="flex items-center gap-2">
							<Image
								src="/logo-cropped.png"
								alt="Crediflex"
								width={25}
								height={25}
							/>
							<span className="text-xl font-bold tracking-tight text-white">
								Crediflex
							</span>
						</div>
					</Link>
					<div className="flex gap-8">
						<Link href="#" className="text-sm text-zinc-400 hover:text-white">
							Terms
						</Link>
						<Link href="#" className="text-sm text-zinc-400 hover:text-white">
							Privacy
						</Link>
						<Link href="#" className="text-sm text-zinc-400 hover:text-white">
							Docs
						</Link>
						<Link href="#" className="text-sm text-zinc-400 hover:text-white">
							Governance
						</Link>
						<Link href="#" className="text-sm text-zinc-400 hover:text-white">
							Security
						</Link>
					</div>
					<div className="text-sm text-zinc-500">
						© {new Date().getFullYear()} Crediflex Protocol
					</div>
				</div>
			</div>
		</motion.footer>
	);
}
