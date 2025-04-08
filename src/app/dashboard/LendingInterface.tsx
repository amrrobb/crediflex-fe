"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";
import Image from "next/image";

// Constants for token images
const TOKEN_IMAGES: { [key: string]: string } = {
	WETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
	USDC: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
};

export function LendingInterface() {
	const [collateralToken, setCollateralToken] = useState("WETH");
	const [borrowToken, setBorrowToken] = useState("USDC");
	const [collateralAmount, setCollateralAmount] = useState("0");
	const [borrowAmount, setBorrowAmount] = useState("0");
	const [ltvRatio, setLtvRatio] = useState(0);

	const handleLtvChange = (value: number[]) => {
		setLtvRatio(value[0]);
	};

	const getRiskLevel = (ltv: number) => {
		if (ltv < 25) return "Conservative";
		if (ltv < 50) return "Moderate";
		if (ltv < 75) return "Aggressive";
		return "Liquidation Risk";
	};

	const sliderGradient = useMemo(() => {
		if (ltvRatio < 25) {
			return "bg-gradient-to-r from-emerald-700 to-emerald-500";
		} else if (ltvRatio < 50) {
			return "bg-gradient-to-r from-blue-700 to-blue-400";
		} else if (ltvRatio < 75) {
			return "bg-gradient-to-r from-amber-700 to-amber-400";
		} else {
			return "bg-gradient-to-r from-red-700 to-red-400";
		}
	}, [ltvRatio]);

	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2">
				{/* Collateral Card */}
				<Card className="bg-zinc-900 border-zinc-800">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-xl font-bold text-white">
								Collateral
							</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								className="text-zinc-400 hover:text-white"
							>
								<Info className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<Select
									value={collateralToken}
									onValueChange={setCollateralToken}
								>
									<SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
										<div className="flex items-center">
											<Image
												src={TOKEN_IMAGES[collateralToken]}
												alt={collateralToken}
												width={24}
												height={24}
												className="mr-2 rounded-full"
											/>
											<SelectValue placeholder="Select token" />
										</div>
									</SelectTrigger>
									<SelectContent className="bg-zinc-800 border-zinc-700 text-white">
										<SelectItem
											value="WETH"
											className="focus:bg-zinc-700 focus:text-white"
										>
											WETH
										</SelectItem>
									</SelectContent>
								</Select>
								<Input
									type="text"
									value={collateralAmount}
									onChange={(e) => setCollateralAmount(e.target.value)}
									className="text-right bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
								/>
							</div>

							<div className="space-y-1">
								<div className="flex justify-between text-sm">
									<span className="text-zinc-400">Balance:</span>
									<span className="text-zinc-300">0 WETH</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-zinc-400">Deposited:</span>
									<span className="text-zinc-300">0.00 WETH</span>
								</div>
							</div>

							<Button className="w-full border-emerald-800 bg-emerald-950/30 text-emerald-500 hover:bg-emerald-900/50 hover:text-emerald-400">
								Deposit Collateral
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Borrow Card */}
				<Card className="bg-zinc-900 border-zinc-800">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-xl font-bold text-white">
								Borrow
							</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								className="text-zinc-400 hover:text-white"
							>
								<Info className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<Select value={borrowToken} onValueChange={setBorrowToken}>
									<SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
										<div className="flex items-center">
											<Image
												src={TOKEN_IMAGES[borrowToken]}
												alt={borrowToken}
												width={24}
												height={24}
												className="mr-2 rounded-full"
											/>
											<SelectValue placeholder="Select token" />
										</div>
									</SelectTrigger>
									<SelectContent className="bg-zinc-800 border-zinc-700 text-white">
										<SelectItem
											value="USDC"
											className="focus:bg-zinc-700 focus:text-white"
										>
											USDC
										</SelectItem>
									</SelectContent>
								</Select>
								<Input
									type="text"
									value={borrowAmount}
									onChange={(e) => setBorrowAmount(e.target.value)}
									className="text-right bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:ring-zinc-600"
								/>
							</div>

							<div className="space-y-1">
								<div className="flex justify-between text-sm">
									<span className="text-zinc-400">Available to borrow:</span>
									<span className="text-zinc-300">0 USDC</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-zinc-400">Your borrowed value:</span>
									<span className="text-zinc-300">0 USDC</span>
								</div>
							</div>

							<Button className="w-full border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white">
								Borrow
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* LTV Slider Card */}
			<Card className="bg-zinc-900 border-zinc-800">
				<CardContent className="p-6">
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-xl font-bold text-white">
									Loan to Value (LTV)
								</h3>
								<p className="text-sm text-zinc-400">
									Ratio of the borrowed value to the collateral value
								</p>
							</div>
							<div className="text-2xl font-bold text-white">
								{ltvRatio.toFixed(2)}%
							</div>
						</div>

						<div className="pt-4">
							<Slider
								defaultValue={[0]}
								max={150}
								step={1}
								value={[ltvRatio]}
								onValueChange={handleLtvChange}
								className="py-4"
								rangeClassName={sliderGradient}
							/>
							<div className="mt-2 flex justify-between text-sm text-zinc-400">
								<span>Conservative</span>
								<span>Moderate</span>
								<span>Aggressive</span>
								<span>Liquidation</span>
							</div>
						</div>

						<div className="rounded-lg bg-zinc-800 p-4">
							<div className="flex items-start gap-3">
								<div
									className={`rounded-full p-1 ${
										getRiskLevel(ltvRatio) === "Conservative"
											? "bg-emerald-950/30 text-emerald-500"
											: getRiskLevel(ltvRatio) === "Moderate"
											? "bg-blue-950/30 text-blue-400"
											: getRiskLevel(ltvRatio) === "Aggressive"
											? "bg-amber-950/30 text-amber-400"
											: "bg-red-950/30 text-red-400"
									}`}
								>
									<Info className="h-4 w-4" />
								</div>
								<div>
									<p className="font-medium text-white">
										{getRiskLevel(ltvRatio)} position
									</p>
									<p className="text-sm text-zinc-400">
										{getRiskLevel(ltvRatio) === "Conservative"
											? "Low risk, safe from liquidation even during high market volatility."
											: getRiskLevel(ltvRatio) === "Moderate"
											? "Balanced risk, generally safe but could be liquidated during significant market downturns."
											: getRiskLevel(ltvRatio) === "Aggressive"
											? "Higher risk, vulnerable to liquidation during market volatility."
											: "Very high risk, likely to be liquidated even with minor market movements."}
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Credit Boost Explainer */}
			<Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center">
						<div className="flex-1">
							<h3 className="text-lg font-bold text-white">
								Undercollateralized Borrowing with Credit Boost
							</h3>
							<p className="mt-1 text-zinc-400">
								Your excellent credit score unlocks a 2.8x collateral
								multiplier, allowing you to borrow up to 280% of your collateral
								value. This is significantly higher than the standard 75%
								offered by traditional DeFi protocols.
							</p>
						</div>
						<Button className="shrink-0 bg-white text-black hover:bg-zinc-200">
							Learn More
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
