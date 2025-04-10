"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Info } from "lucide-react";

interface LtvSliderProps {
	value: number;
	liquidationThreshold?: number;
	onChange?: (value: number) => void;
}

export function LtvSlider({
	value,
	liquidationThreshold = 100,
	onChange,
}: LtvSliderProps) {
	useEffect(() => {
		// Log the current LTV value whenever it changes
		console.log("Current LTV value:", value);
	}, [value]);
	// Calculate max value as liquidation threshold + 20 for some buffer space
	const maxValue = liquidationThreshold + 20;

	// Define the thresholds for different risk levels
	const conservativeThreshold = liquidationThreshold * 0.25;
	const moderateThreshold = liquidationThreshold * 0.5;
	const aggressiveThreshold = liquidationThreshold * 0.75;

	const handleLtvChange = (newValue: number[]) => {
		if (onChange) {
			onChange(newValue[0]);
		}
	};

	const getRiskLevel = (ltv: number) => {
		if (ltv < conservativeThreshold) return "Conservative";
		if (ltv < moderateThreshold) return "Moderate";
		if (ltv < aggressiveThreshold) return "Aggressive";
		if (ltv < liquidationThreshold) return "Aggressive";
		return "Liquidation";
	};

	// Determine the gradient color based on LTV ratio
	const sliderGradient = useMemo(() => {
		if (value < conservativeThreshold) {
			return "bg-gradient-to-r from-emerald-700 to-emerald-500";
		} else if (value < moderateThreshold) {
			return "bg-gradient-to-r from-blue-700 to-blue-400";
		} else if (value < aggressiveThreshold) {
			return "bg-gradient-to-r from-amber-700 to-amber-400";
		} else {
			return "bg-gradient-to-r from-red-700 to-red-400";
		}
	}, [value, conservativeThreshold, moderateThreshold, aggressiveThreshold]);

	return (
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
							{value.toFixed(2)}%
						</div>
					</div>

					<div className="pt-4">
						<div className="relative">
							<Slider
								value={[value]}
								max={maxValue}
								step={1}
								onValueChange={handleLtvChange}
								className="py-4"
								rangeClassName={sliderGradient}
							/>

							{/* Liquidation threshold marker */}
							<div
								className="absolute top-0 bottom-0 w-0.5 bg-red-500"
								style={{
									left: `calc(${
										(liquidationThreshold / maxValue) * 100
									}% - 1px)`,
									height: "24px",
									marginTop: "4px",
								}}
							/>
						</div>

						{/* Risk level labels with proper positioning */}
						<div className="relative h-6 mt-1">
							<span
								className="absolute text-xs text-zinc-400 transform -translate-x-1/2"
								style={{ left: `${(conservativeThreshold / maxValue) * 100}%` }}
							>
								Conservative
							</span>
							<span
								className="absolute text-xs text-zinc-400 transform -translate-x-1/2"
								style={{ left: `${(moderateThreshold / maxValue) * 100}%` }}
							>
								Moderate
							</span>
							<span
								className="absolute text-xs text-zinc-400 transform -translate-x-1/2"
								style={{ left: `${(aggressiveThreshold / maxValue) * 100}%` }}
							>
								Aggressive
							</span>
							<span
								className="absolute text-xs text-zinc-400 transform -translate-x-1/2"
								style={{ left: `${(liquidationThreshold / maxValue) * 100}%` }}
							>
								Liquidation
							</span>
						</div>
					</div>

					<div className="rounded-lg bg-zinc-800 p-4">
						<div className="flex items-start gap-3">
							<div
								className={`rounded-full p-1 ${
									getRiskLevel(value) === "Conservative"
										? "bg-emerald-950/30 text-emerald-500"
										: getRiskLevel(value) === "Moderate"
										? "bg-blue-950/30 text-blue-400"
										: getRiskLevel(value) === "Aggressive"
										? "bg-amber-950/30 text-amber-400"
										: "bg-red-950/30 text-red-400"
								}`}
							>
								<Info className="h-4 w-4" />
							</div>
							<div>
								<p className="font-medium text-white">
									{getRiskLevel(value)} position
								</p>
								<p className="text-sm text-zinc-400">
									{getRiskLevel(value) === "Conservative"
										? "Low risk, safe from liquidation even during high market volatility."
										: getRiskLevel(value) === "Moderate"
										? "Balanced risk, generally safe but could be liquidated during significant market downturns."
										: getRiskLevel(value) === "Aggressive"
										? "Higher risk, vulnerable to liquidation during market volatility."
										: "Very high risk, likely to be liquidated even with minor market movements."}
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
