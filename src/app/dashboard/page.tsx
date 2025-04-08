"use client";

import { useState } from "react";
import { CreditProfile } from "./CreditProfile";
import { LendingInterface } from "./LendingInterface";
import { motion } from "framer-motion";
import { MarketStats } from "./MarketStats";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";

export default function Home() {
	const [creditScore, setCreditScore] = useState(720);
	const [healthFactor, setHealthFactor] = useState(Infinity);
	const [lastUpdated, setLastUpdated] = useState("2 hours ago");
	const [borrowRate, setBorrowRate] = useState(10);

	return (
		<div className="flex min-h-screen flex-col bg-black text-white">
			{/* <Header /> */}

			<main className="flex-1 py-2">
				<motion.section
					className="container mx-auto px-4"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Credit Profile */}
					<motion.div
						className="relative overflow-hidden py-1 mb-2 md:py-5"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h2 className="mb-4 text-xl font-bold">Profile</h2>
						<CreditProfile
							creditScore={creditScore}
							healthFactor={healthFactor}
							lastUpdated={lastUpdated}
							borrowRate={borrowRate}
						/>{" "}
					</motion.div>

					{/* Lending Interface */}
					<motion.div
						className="relative overflow-hidden py-1 mb-2 md:py-5"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<h2 className="mb-4 text-xl font-bold">Lending & Borrowing</h2>
						<LendingInterface />
					</motion.div>

					{/* Market Stats */}

					<motion.div
						className="relative overflow-hidden py-1 mb-2 md:py-5"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<h2 className="mb-4 text-xl font-bold">Market Statistics</h2>

						<MarketStats />
					</motion.div>
				</motion.section>
			</main>

			{/* <Footer /> */}
		</div>
	);
}
