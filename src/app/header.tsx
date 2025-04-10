"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
	const router = useRouter();

	const handleNavigation = (sectionId: string) => (event: React.MouseEvent) => {
		event.preventDefault(); // Prevent default link behavior

		const isHome = window.location.pathname === "/";

		if (isHome) {
			// Scroll to the section if already on the homepage
			document
				.getElementById(sectionId)
				?.scrollIntoView({ behavior: "smooth" });
		} else {
			// Navigate to home and set hash
			router.push(`/#${sectionId}`);
		}
	};

	return (
		<header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
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
				<nav className="hidden md:flex">
					<ul className="flex space-x-8">
						<li>
							<Link
								href="/dashboard"
								className="text-sm text-zinc-400 transition-colors hover:text-white"
							>
								Dashboard
							</Link>
						</li>
						<li>
							<Link
								href="#features"
								onClick={handleNavigation("features")}
								className="text-sm text-zinc-400 transition-colors hover:text-white"
							>
								Features
							</Link>
						</li>
						<li>
							<Link
								href="#how-it-works"
								onClick={handleNavigation("how-it-works")}
								className="text-sm text-zinc-400 transition-colors hover:text-white"
							>
								How It Works
							</Link>
						</li>
						<li>
							<Link
								href="#benefits"
								onClick={handleNavigation("benefits")}
								className="text-sm text-zinc-400 transition-colors hover:text-white"
							>
								Benefits
							</Link>
						</li>
						<li>
							<Link
								href="#faq"
								onClick={handleNavigation("faq")}
								className="text-sm text-zinc-400 transition-colors hover:text-white"
							>
								FAQ
							</Link>
						</li>
					</ul>
				</nav>
				<div className="flex items-center gap-4">
					<ConnectButton />
				</div>
			</div>
		</header>
	);
}
