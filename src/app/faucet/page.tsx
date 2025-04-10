"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaucetInterface } from "./FaucetInterface";
import { SupplyInterface } from "./SupplyInterface";
import { DisconnectedInterface } from "../dashboard/DisconnectedInterface";
import { useAccount } from "wagmi";

export default function FaucetPage() {
	// Mock wallet connection state for UI preview
	const { isConnected } = useAccount();

	return (
		<div className="flex min-h-screen flex-col bg-black text-white">
			<main className="flex-1 py-2">
				<motion.section
					className="container mx-auto px-4"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<motion.div
						className="relative overflow-hidden py-1 mb-2 md:py-5"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h1 className="text-3xl font-bold mb-6">Faucet & Supply</h1>
						<p className="text-zinc-400 mb-8">
							Get testnet tokens and supply them to the Crediflex protocol for
							testing purposes.
						</p>
					</motion.div>

					{isConnected ? (
						<motion.div
							className="relative overflow-hidden py-1 mb-2 md:py-5"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<Tabs defaultValue="faucet" className="w-full">
								<TabsList className="w-full bg-zinc-800 border border-zinc-700 mb-6">
									<TabsTrigger
										value="faucet"
										className="flex-1 data-[state=active]:bg-zinc-700"
									>
										Get Test Tokens
									</TabsTrigger>
									<TabsTrigger
										value="supply"
										className="flex-1 data-[state=active]:bg-zinc-700"
									>
										Supply to Protocol
									</TabsTrigger>
								</TabsList>

								<TabsContent value="faucet">
									<FaucetInterface />
								</TabsContent>

								<TabsContent value="supply">
									<SupplyInterface />
								</TabsContent>
							</Tabs>
						</motion.div>
					) : (
						<motion.div
							className="relative overflow-hidden py-10 px-10 mb-2 md:py-5"
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
						>
							<DisconnectedInterface />
						</motion.div>
					)}
				</motion.section>
			</main>
		</div>
	);
}
