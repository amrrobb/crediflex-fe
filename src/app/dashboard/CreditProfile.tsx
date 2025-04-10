"use client";

import mainAbi from "@/abi/main.json";
import avsAbi from "@/abi/avs.json";
import Link from "next/link";
import { Clock, ExternalLink, Info, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { useGetCurrentUserCscore } from "@/hooks/useGetCscore";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { HexAddress } from "@/lib/type";
import { normalize, normalizeBN } from "@/lib/bignumber";
import { timeAgo } from "@/helpers/timeAgo";
import { useCalculateDynamicLtv } from "@/hooks/useCalculateDynamicLtv";
import { useCalculateHealthFactor } from "@/hooks/useCalculateHealthFactor";
import { useGetConversionPrice } from "@/hooks/useGetConversionPrice";

type PositionData = {
	result: [string, string, string];
};

export function CreditProfile() {
	const [loading, setLoading] = useState(false);
	const [, setError] = useState<string | null>(null);

	const { writeContract } = useWriteContract({});
	const { address } = useAccount();

	const { data: cScore } = useGetCurrentUserCscore() as {
		data: {
			cScore: string;
			lastUpdate: string;
		};
		isPending: boolean;
	};
	const { data: ltv } = useCalculateDynamicLtv({
		userAddress: address,
	}) as { data: string };
	const { data: health } = useCalculateHealthFactor({
		userAddress: address,
	}) as { data: string };
	const { data: positionData } = useReadContracts({
		contracts: [
			{
				abi: mainAbi,
				address: process.env
					.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
				functionName: "positions",
				args: [address],
			},
			{
				abi: mainAbi,
				address: process.env
					.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
				functionName: "totalBorrowAssets",
			},
			{
				abi: mainAbi,
				address: process.env
					.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
				functionName: "totalBorrowShares",
			},
			{
				abi: mainAbi,
				address: process.env
					.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
				functionName: "totalSupplyAssets",
			},
			{
				abi: mainAbi,
				address: process.env
					.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
				functionName: "totalSupplyShares",
			},
		],
		query: {
			enabled: !!address,
		},
	});
	const { data: conversionPrice } = useGetConversionPrice({
		amountIn: (positionData?.[0] as PositionData)?.result?.[2] ?? "0",
		dataFeedIn: process.env
			.NEXT_PUBLIC_EDUCHAIN_WETH_USD_DATAFEED_ADDRESS as HexAddress,
		dataFeedOut: process.env
			.NEXT_PUBLIC_EDUCHAIN_USDC_USD_DATAFEED_ADDRESS as HexAddress,
		tokenIn: process.env.NEXT_PUBLIC_EDUCHAIN_WETH_ADDRESS as HexAddress,
		tokenOut: process.env.NEXT_PUBLIC_EDUCHAIN_USDC_ADDRESS as HexAddress,
	});

	const userSupplyAssets = normalizeBN((conversionPrice as string) ?? "0", 6);
	const userBorrowAssets = normalizeBN(
		((positionData?.[0] as PositionData)?.result?.[1] ?? "0") as string,
		18
	)
		.multipliedBy(normalizeBN((positionData?.[1].result as string) ?? "0", 6))
		.div(normalizeBN((positionData?.[2].result as string) ?? "0", 18));
	const availableToBorrow = normalizeBN((conversionPrice as string) ?? "0", 6)
		.multipliedBy(normalizeBN((ltv as string) ?? "0", 18))
		.minus(userBorrowAssets.isNaN() ? 0 : userBorrowAssets);

	const creditScore = parseInt(normalize(cScore?.cScore || "0", 16));
	const lastUpdated = timeAgo(Number(cScore?.lastUpdate || "0"));
	const borrowMultiplier = parseFloat(normalize(ltv || "0", 18)).toFixed(2);
	const borrowRate = 10;
	const borrowingPower = Number(borrowMultiplier || "0") * 100;
	const healthFactor =
		parseFloat(normalize(health || "0", 18)) > 1000
			? Infinity
			: parseFloat(normalize(health || "0", 18));

	const handleCreditScoreRequest = () => {
		setLoading(true);
		setError(null);

		writeContract(
			{
				address: process.env.NEXT_PUBLIC_EDUCHAIN_AVS_ADDRESS as HexAddress,
				abi: avsAbi,
				functionName: "createNewTask",
				args: [address],
			},
			{
				onSuccess: () => {
					// triggerCscoreRequest();
					setLoading(false);
				},
				onError: (err) => {
					setLoading(false);
					setError(err.message);
				},
			}
		);
	};

	const { status, statusColor, progressColor } = useMemo(() => {
		if (creditScore >= 751) {
			return {
				status: "Excellent",
				statusColor: "text-emerald-500",
				progressColor: "bg-gradient-to-r from-emerald-400 to-emerald-600",
			};
		} else if (creditScore >= 601) {
			return {
				status: "Good",
				statusColor: "text-blue-400",
				progressColor: "bg-gradient-to-r from-blue-400 to-blue-600",
			};
		} else if (creditScore >= 301) {
			return {
				status: "Fair",
				statusColor: "text-amber-400",
				progressColor: "bg-gradient-to-r from-amber-400 to-amber-600",
			};
		} else {
			return {
				status: "Poor",
				statusColor: "text-red-400",
				progressColor: "bg-gradient-to-r from-red-400 to-red-600",
			};
		}
	}, [creditScore]);

	// Determine health factor status and colors
	const { healthStatus, healthBadgeClass, healthIconClass, healthBgClass } =
		useMemo(() => {
			if (healthFactor >= 2) {
				return {
					healthStatus: "Excellent",
					healthBadgeClass:
						"bg-emerald-950/30 text-emerald-500 border-emerald-800",
					healthIconClass: "text-emerald-500",
					healthBgClass:
						"bg-gradient-to-r from-emerald-800/40 to-emerald-950/40",
				};
			} else if (healthFactor >= 1.5) {
				return {
					healthStatus: "Healthy",
					healthBadgeClass: "bg-blue-950/30 text-blue-400 border-blue-800",
					healthIconClass: "text-blue-400",
					healthBgClass: "bg-gradient-to-r from-blue-800/40 to-blue-950/40",
				};
			} else if (healthFactor >= 1.1) {
				return {
					healthStatus: "Moderate",
					healthBadgeClass: "bg-amber-950/30 text-amber-400 border-amber-800",
					healthIconClass: "text-amber-400",
					healthBgClass: "bg-gradient-to-r from-amber-800/40 to-amber-950/40",
				};
			} else {
				return {
					healthStatus: "Risky",
					healthBadgeClass: "bg-red-950/30 text-red-400 border-red-800",
					healthIconClass: "text-red-400",
					healthBgClass: "bg-gradient-to-r from-red-800/40 to-red-950/40",
				};
			}
		}, [healthFactor]);
	return (
		<div className="space-y-6">
			<div className="mb-8 grid gap-6 md:grid-cols-3">
				<Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg font-bold text-white">
								Credit Score
							</CardTitle>
							<div className="flex items-center text-xs text-zinc-400">
								<Clock className="mr-1 h-3 w-3" />
								<span suppressHydrationWarning>
									Last updated: {lastUpdated}
								</span>
							</div>
						</div>
						<CardDescription className="text-zinc-400">
							Based on your on-chain activity
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<div className="flex items-end justify-between">
							<div>
								<span className="text-3xl font-bold text-white">
									{creditScore}
								</span>
								<span className={`ml-2 text-sm ${statusColor}`}>{status}</span>
							</div>
						</div>
						<div className="mt-4">
							<Progress
								value={(creditScore / 1000) * 100}
								className="h-2 bg-zinc-800"
								indicatorClassName={progressColor}
							/>
							<div className="mt-1 flex justify-between text-xs text-zinc-500">
								<span>0</span>
								<span>1000</span>
							</div>
						</div>
						<div className="mt-3 flex justify-between text-xs text-zinc-500">
							<span>Poor</span>
							<span>Fair</span>
							<span>Good</span>
							<span>Excellent</span>
						</div>

						<Button
							onClick={handleCreditScoreRequest}
							className="mt-4 w-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
						>
							{loading ? (
								<RefreshCw className="animate-spin h-4 w-4" />
							) : (
								"Request Credit Score"
							)}
						</Button>
					</CardContent>
					<CardFooter className="border-t border-zinc-800 pt-4 mt-auto">
						<Link href="#" className="text-xs text-zinc-400 hover:text-white">
							View credit report
							<ExternalLink className="ml-1 inline h-3 w-3" />
						</Link>
					</CardFooter>
				</Card>

				<Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-bold text-white">
							Borrowing Power
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Maximum undercollateralized loan
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<div className="flex items-end justify-between">
							<div>
								<span className="text-3xl font-bold text-white">
									{borrowingPower}%
								</span>
								<span className="ml-2 text-sm text-zinc-400">
									of collateral
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-zinc-400 hover:text-white"
							>
								<Info className="h-4 w-4" />
							</Button>
						</div>

						<div className="mt-4 flex items-center justify-between rounded-md bg-zinc-800/50 p-2 text-sm">
							<span className="text-zinc-400">Collateral Multiplier</span>
							<span className="font-medium text-white">
								{borrowMultiplier}x
							</span>
						</div>
					</CardContent>
					<CardFooter className="border-t border-zinc-800 pt-4 mt-auto">
						<Link href="#" className="text-xs text-zinc-400 hover:text-white">
							How is this calculated?
							<ExternalLink className="ml-1 inline h-3 w-3" />
						</Link>
					</CardFooter>
				</Card>

				<Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-bold text-white">
							Your Position
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Current lending & borrowing
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-400">Supplied</span>
								<span className="font-medium text-white">
									{userSupplyAssets.isNaN() || userSupplyAssets.isZero()
										? "$0"
										: `$${userSupplyAssets.toFixed(2)}`}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-400">Borrowed</span>
								<span className="font-medium text-white">
									{userBorrowAssets.isNaN() || userBorrowAssets.isZero()
										? "$0"
										: `$${userBorrowAssets.toFixed(2)}`}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-400">Networth</span>
								<span className="font-medium text-emerald-500">
									{availableToBorrow.isNaN() || availableToBorrow.isZero()
										? "$0"
										: `$${availableToBorrow.toFixed(2)}`}
								</span>
							</div>
						</div>
					</CardContent>
					<CardFooter className="border-t border-zinc-800 pt-4 mt-auto">
						<Link href="#" className="text-xs text-zinc-400 hover:text-white">
							View position details
							<ExternalLink className="ml-1 inline h-3 w-3" />
						</Link>
					</CardFooter>
				</Card>
			</div>
			<div className="grid gap-6 md:grid-cols-5">
				{/* Borrow Rate Card - Takes 2 columns */}
				<Card className="bg-zinc-900 border-zinc-800 md:col-span-3">
					<CardContent className="py-6 flex items-center justify-between">
						{/* Left side: Header info */}
						<div>
							<CardTitle className="text-lg font-bold text-white">
								Borrow Rate
							</CardTitle>
							<CardDescription className="text-zinc-400">
								Current interest rate for borrowing
							</CardDescription>
						</div>

						{/* Right side: Rate value */}
						<div className="flex items-end">
							<span className="text-4xl font-bold text-white">
								{borrowRate}%
							</span>
							{/* <Percent className="h-8 w-8 mx-2 text-amber-400" /> */}
							<span className="mx-2 text-xl text-white">APR</span>
						</div>
					</CardContent>
				</Card>

				{/* Health Factor Card - Takes 1 column */}
				<Card
					className={`bg-zinc-900 border-zinc-800 md:col-span-2 ${healthBgClass}`}
				>
					<CardContent className="py-6 flex items-center flex-col md:flex-row md:items-center justify-between gap-4 px-4">
						{/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4"> */}
						{/* Icon + Label */}
						<div className="flex items-center gap-3">
							<Shield className={`h-6 w-6 ${healthIconClass}`} />
							<div>
								<CardTitle className="text-lg font-bold text-white">
									Health Factor
								</CardTitle>
								<CardDescription className="text-zinc-400">
									Reflects your loan’s liquidation risk
								</CardDescription>
							</div>
						</div>

						{/* Score + Badge */}
						<div className="flex items-center gap-4">
							<span className={`text-5xl font-extrabold ${healthIconClass}`}>
								{healthFactor === Infinity ? "♾️" : healthFactor.toFixed(2)}
							</span>
							<Badge
								variant="outline"
								className={`text-sm px-3 py-1 rounded-full ${healthBadgeClass}`}
							>
								{healthStatus}
							</Badge>
						</div>
						{/* </div> */}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
