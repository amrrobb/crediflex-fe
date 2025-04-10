"use client";

import { CreditProfile } from "./CreditProfile";
import { LendingInterface } from "./LendingInterface";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { DisconnectedInterface } from "./DisconnectedInterface";
// import { MarketStats } from "./MarketStats";

export default function Dashboard() {
	const { isConnected } = useAccount();

	return (
		<div className="flex min-h-screen flex-col bg-black text-white">
			<main className="flex-1 py-2">
				<motion.section
					className="container mx-auto px-4"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					{isConnected ? (
						<>
							{/* Credit Profile */}
							<motion.div
								className="relative overflow-hidden py-1 mb-2 md:py-5"
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								<h2 className="mb-4 text-xl font-bold">Profile</h2>
								<CreditProfile />
							</motion.div>

							{/* Lending Interface */}
							<motion.div
								className="relative overflow-hidden py-1 mb-2 md:py-5"
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.6 }}
							>
								<h2 className="mb-4 text-xl font-bold">Lending & Borrowing</h2>
								<LendingInterface />
							</motion.div>

							{/* Market Stats */}

							{/* <motion.div
								className="relative overflow-hidden py-1 mb-2 md:py-5"
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.8 }}
							>
								<h2 className="mb-4 text-xl font-bold">Market Statistics</h2>

								<MarketStats />
							</motion.div> */}
						</>
					) : (
						<>
							<motion.div
								className="relative overflow-hidden py-10 px-10 mb-2 md:py-5"
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								<DisconnectedInterface />
							</motion.div>
						</>
					)}
				</motion.section>
			</main>
		</div>
	);
}
