"use client";

import Link from "next/link";
import {
	ArrowRight,
	BarChart3,
	ChevronRight,
	Lock,
	Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/reactbits/ShinyText";
import BlurText from "@/components/reactbits/BlurText";

export default function Home() {
	const handleAnimationComplete = () => {
		console.log("Animation completed!");
	};

	return (
		<div className="flex min-h-screen flex-col bg-black text-white">
			<main className="flex-1">
				{/* Hero Section */}
				<motion.section
					className="relative overflow-hidden py-20 md:py-32"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black"></div>
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-3xl text-center">
							<div className="flex justify-center mb-20">
								<Image
									src="/logo-cropped.png"
									alt="Crediflex"
									width={200}
									height={200}
								/>
							</div>
							<div className="flex items-center justify-center text-center">
								<BlurText
									text="Borrow More With Less Collateral"
									delay={150}
									animateBy="words"
									direction="top"
									onAnimationComplete={handleAnimationComplete}
									className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl flex flex-wrap justify-center items-center text-center"
								/>
							</div>
							{/* </h1> */}
							<p className="mb-10 text-lg text-zinc-400 md:text-xl">
								Crediflex is an Undercollateralized Lending Protocol that
								introduces a novel approach to borrowing assets in decentralized
								finance (DeFi).
							</p>
							<div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
								{/* <Button className="w-full font-semibold bg-white text-black hover:bg-zinc-200 sm:w-auto text-xl py-6 px-8"> */}
								<Button className="text-xl py-6 px-8 transition-transform transform hover:scale-105">
									<Link href="/dashboard">
										<ShinyText
											text="Launch App"
											disabled={false}
											speed={5}
											className="custom-class"
										/>
									</Link>
								</Button>
								{/* <Button
									variant="outline"
									className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
								>
									Learn More
								</Button> */}
							</div>
						</div>
					</div>
				</motion.section>

				{/* Features Section */}
				<motion.section
					id="features"
					className="border-t border-zinc-800 py-20"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
								Redefining DeFi Lending
							</h2>
							<p className="mb-12 text-zinc-400">
								Leverage on-chain activity-based credit scoring to unlock new
								borrowing possibilities.
							</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							<motion.div
								className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700"
								whileHover={{ scale: 1.05 }}
							>
								<div className="mb-4 inline-flex rounded-full bg-zinc-800 p-3">
									<BarChart3 className="h-6 w-6 text-zinc-200" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-white">
									Credit Scoring
								</h3>
								<p className="text-zinc-400">
									Our protocol analyzes your on-chain activity to establish a
									credit score, enabling undercollateralized loans.
								</p>
							</motion.div>
							<motion.div
								className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700"
								whileHover={{ scale: 1.05 }}
							>
								<div className="mb-4 inline-flex rounded-full bg-zinc-800 p-3">
									<Lock className="h-6 w-6 text-zinc-200" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-white">
									Undercollateralized Loans
								</h3>
								<p className="text-zinc-400">
									Borrow more assets than you collateralize, maximizing capital
									efficiency in your DeFi strategy.
								</p>
							</motion.div>
							<motion.div
								className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-zinc-700"
								whileHover={{ scale: 1.05 }}
							>
								<div className="mb-4 inline-flex rounded-full bg-zinc-800 p-3">
									<Shield className="h-6 w-6 text-zinc-200" />
								</div>
								<h3 className="mb-2 text-xl font-semibold text-white">
									Risk Management
								</h3>
								<p className="text-zinc-400">
									Advanced risk assessment algorithms ensure protocol stability
									while offering competitive rates.
								</p>
							</motion.div>
						</div>
					</div>
				</motion.section>

				{/* How It Works */}
				<motion.section
					id="how-it-works"
					className="border-t border-zinc-800 py-20"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
								How Crediflex Works
							</h2>
							<p className="mb-12 text-zinc-400">
								A simple process to access undercollateralized loans based on
								your on-chain reputation.
							</p>
						</div>
						<div className="mx-auto max-w-4xl">
							<div className="relative">
								<div className="absolute left-8 top-0 h-full w-px bg-zinc-800 md:left-1/2"></div>
								<div className="space-y-12">
									{/* Step 1 */}
									<motion.div
										className="relative flex flex-col md:flex-row"
										initial={{ opacity: 0, x: -50 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.5, delay: 0.6 }}
									>
										<div className="flex md:w-1/2 md:pr-8">
											<div className="mr-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white md:ml-auto">
												<span className="text-xl font-bold">1</span>
											</div>
											<div className="pt-3 md:text-right">
												<h3 className="text-xl font-semibold text-white">
													Connect Wallet
												</h3>
												<p className="mt-2 text-zinc-400">
													Link your wallet to begin the credit assessment
													process.
												</p>
											</div>
										</div>
										<div className="hidden md:block md:w-1/2"></div>
									</motion.div>

									{/* Step 2 */}
									<motion.div
										className="relative flex flex-col md:flex-row"
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.5, delay: 0.8 }}
									>
										<div className="hidden md:block md:w-1/2"></div>
										<div className="flex md:w-1/2 md:pl-8">
											<div className="mr-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
												<span className="text-xl font-bold">2</span>
											</div>
											<div className="pt-3">
												<h3 className="text-xl font-semibold text-white">
													Credit Assessment
												</h3>
												<p className="mt-2 text-zinc-400">
													Our protocol analyzes your on-chain activity to
													determine your credit score.
												</p>
											</div>
										</div>
									</motion.div>

									{/* Step 3 */}
									<motion.div
										className="relative flex flex-col md:flex-row"
										initial={{ opacity: 0, x: -50 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.5, delay: 1.0 }}
									>
										<div className="flex md:w-1/2 md:pr-8">
											<div className="mr-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white md:ml-auto">
												<span className="text-xl font-bold">3</span>
											</div>
											<div className="pt-3 md:text-right">
												<h3 className="text-xl font-semibold text-white">
													Deposit Collateral
												</h3>
												<p className="mt-2 text-zinc-400">
													Deposit a portion of the assets you wish to borrow as
													collateral.
												</p>
											</div>
										</div>
										<div className="hidden md:block md:w-1/2"></div>
									</motion.div>

									{/* Step 4 */}
									<motion.div
										className="relative flex flex-col md:flex-row"
										initial={{ opacity: 0, x: 50 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.5, delay: 1.2 }}
									>
										<div className="hidden md:block md:w-1/2"></div>
										<div className="flex md:w-1/2 md:pl-8">
											<div className="mr-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white">
												<span className="text-xl font-bold">4</span>
											</div>
											<div className="pt-3">
												<h3 className="text-xl font-semibold text-white">
													Access Loans
												</h3>
												<p className="mt-2 text-zinc-400">
													Borrow more than your collateral based on your credit
													score and protocol limits.
												</p>
											</div>
										</div>
									</motion.div>
								</div>
							</div>
						</div>
					</div>
				</motion.section>

				{/* Benefits Section */}
				<motion.section
					id="benefits"
					className="border-t border-zinc-800 bg-zinc-900 py-20"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 1.4 }}
				>
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
								Benefits of Crediflex
							</h2>
							<p className="mb-12 text-zinc-400">
								Unlock the full potential of your crypto assets with our
								innovative lending protocol.
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<motion.div
								className="rounded-lg border border-zinc-800 bg-black p-6"
								whileHover={{ scale: 1.05 }}
							>
								<h3 className="mb-3 text-lg font-semibold text-white">
									Capital Efficiency
								</h3>
								<p className="text-zinc-400">
									Maximize your borrowing power without locking up excessive
									collateral.
								</p>
							</motion.div>
							<motion.div
								className="rounded-lg border border-zinc-800 bg-black p-6"
								whileHover={{ scale: 1.05 }}
							>
								<h3 className="mb-3 text-lg font-semibold text-white">
									Competitive Rates
								</h3>
								<p className="text-zinc-400">
									Enjoy favorable interest rates based on your on-chain credit
									score.
								</p>
							</motion.div>
							<motion.div
								className="rounded-lg border border-zinc-800 bg-black p-6"
								whileHover={{ scale: 1.05 }}
							>
								<h3 className="mb-3 text-lg font-semibold text-white">
									Flexible Terms
								</h3>
								<p className="text-zinc-400">
									Choose from various loan durations and repayment options.
								</p>
							</motion.div>
							<motion.div
								className="rounded-lg border border-zinc-800 bg-black p-6"
								whileHover={{ scale: 1.05 }}
							>
								<h3 className="mb-3 text-lg font-semibold text-white">
									Build Credit
								</h3>
								<p className="text-zinc-400">
									Improve your on-chain credit score with successful loan
									repayments.
								</p>
							</motion.div>
							<motion.div
								className="rounded-lg border border-zinc-800 bg-black p-6"
								whileHover={{ scale: 1.05 }}
							>
								<h3 className="mb-3 text-lg font-semibold text-white">
									Transparent Process
								</h3>
								<p className="text-zinc-400">
									All credit scoring and loan terms are fully transparent and
									verifiable on-chain.
								</p>
							</motion.div>
							<motion.div
								className="rounded-lg border border-zinc-800 bg-black p-6"
								whileHover={{ scale: 1.05 }}
							>
								<h3 className="mb-3 text-lg font-semibold text-white">
									Decentralized
								</h3>
								<p className="text-zinc-400">
									Fully decentralized protocol with no central authority or
									intermediaries.
								</p>
							</motion.div>
						</div>
					</div>
				</motion.section>

				{/* CTA Section */}
				<motion.section
					className="border-t border-zinc-800 py-20"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 1.6 }}
				>
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-zinc-900 to-black p-8 text-center shadow-lg md:p-12">
							<h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
								Ready to Experience the Future of DeFi Lending?
							</h2>
							<p className="mb-8 text-zinc-400">
								Join Crediflex today and unlock the full potential of your
								crypto assets with undercollateralized loans.
							</p>
							<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
								<Button className="w-full bg-white text-black hover:bg-zinc-200 sm:w-auto">
									Launch App
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white sm:w-auto"
								>
									Read Documentation
								</Button>
							</div>
						</div>
					</div>
				</motion.section>

				{/* FAQ Section */}
				<motion.section
					id="faq"
					className="border-t border-zinc-800 py-20"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 1.8 }}
				>
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
								Frequently Asked Questions
							</h2>
							<p className="mb-12 text-zinc-400">
								Find answers to common questions about Crediflex.
							</p>
						</div>
						<div className="mx-auto max-w-3xl divide-y divide-zinc-800">
							<div className="py-6">
								<details className="group">
									<summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white">
										<span>How is my credit score calculated?</span>
										<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
									</summary>
									<p className="mt-4 text-zinc-400">
										Your credit score is calculated based on various on-chain
										factors including transaction history, wallet age, previous
										lending activities, and asset holdings. Our algorithm
										analyzes these factors to determine your creditworthiness.
									</p>
								</details>
							</div>
							<div className="py-6">
								<details className="group">
									<summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white">
										<span>What is the maximum loan-to-value ratio?</span>
										<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
									</summary>
									<p className="mt-4 text-zinc-400">
										The maximum loan-to-value ratio depends on your credit
										score. Users with excellent scores can borrow up to 300% of
										their collateral value, while new users typically start at
										120-150%.
									</p>
								</details>
							</div>
							<div className="py-6">
								<details className="group">
									<summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white">
										<span>What happens if I can&apos;t repay my loan?</span>
										<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
									</summary>
									<p className="mt-4 text-zinc-400">
										If you&apos;re unable to repay your loan by the due date,
										your collateral will be liquidated. Additionally, your
										credit score will be negatively affected, reducing your
										borrowing capacity for future loans.
									</p>
								</details>
							</div>
							<div className="py-6">
								<details className="group">
									<summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white">
										<span>Which assets can I use as collateral?</span>
										<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
									</summary>
									<p className="mt-4 text-zinc-400">
										Crediflex currently supports major cryptocurrencies
										including ETH, WBTC, and several stablecoins as collateral.
										We&apos;re continuously expanding our supported assets based
										on community demand and risk assessment.
									</p>
								</details>
							</div>
							<div className="py-6">
								<details className="group">
									<summary className="flex cursor-pointer items-center justify-between text-lg font-medium text-white">
										<span>Is Crediflex audited?</span>
										<ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" />
									</summary>
									<p className="mt-4 text-zinc-400">
										Yes, Crediflex has undergone multiple security audits by
										leading blockchain security firms. All audit reports are
										publicly available on our documentation site for
										transparency.
									</p>
								</details>
							</div>
						</div>
					</div>
				</motion.section>
			</main>
		</div>
	);
}
