"use client";

import mainAbi from "@/abi/main.json";
import { useState, useMemo, useEffect } from "react";
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
import { Info } from "lucide-react";
import Image from "next/image";
import { useERC20TokenBalance } from "@/hooks/userERC20TokenBalance";
import { useAccount, useReadContracts } from "wagmi";
import { HexAddress } from "@/lib/type";
import { useCalculateDynamicLtv } from "@/hooks/useCalculateDynamicLtv";
import { normalize, normalizeBN } from "@/lib/bignumber";
import { useAddCollateral } from "@/hooks/useDeposit";
import { useBorrow } from "@/hooks/useBorrow";
import { useGetConversionPrice } from "@/hooks/useGetConversionPrice";
import { toast } from "@/hooks/use-toast";
import { LtvSlider } from "./LtvSlider";
import { useWithdrawCollateral } from "@/hooks/useWithdraw";
import { useRepay } from "@/hooks/useRepay";

type PositionData = {
	result: [string, string, string];
};

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

	const { address } = useAccount();
	const balanceCollateral = useERC20TokenBalance(
		address,
		process.env.NEXT_PUBLIC_EDUCHAIN_WETH_ADDRESS as HexAddress
	);
	const { data: ltv } = useCalculateDynamicLtv({
		userAddress: address,
	}) as { data: string };
	const liquidationThreshold = parseFloat(normalize(ltv || "0", 18)) * 100;

	const { data: positionData, refetch: refetchPositions } = useReadContracts({
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
	const { mutation: depositCollateral } = useAddCollateral();
	const { mutation: withdrawCollateral } = useWithdrawCollateral();
	const { mutation: borrow } = useBorrow();
	const { mutation: repay } = useRepay();
	const { data: conversionPrice } = useGetConversionPrice({
		amountIn: (positionData?.[0] as PositionData)?.result?.[2] ?? "0",
		dataFeedIn: process.env
			.NEXT_PUBLIC_EDUCHAIN_WETH_USD_DATAFEED_ADDRESS as HexAddress,
		dataFeedOut: process.env
			.NEXT_PUBLIC_EDUCHAIN_USDC_USD_DATAFEED_ADDRESS as HexAddress,
		tokenIn: process.env.NEXT_PUBLIC_EDUCHAIN_WETH_ADDRESS as HexAddress,
		tokenOut: process.env.NEXT_PUBLIC_EDUCHAIN_USDC_ADDRESS as HexAddress,
	});

	const userBorrowAssets = normalizeBN(
		((positionData?.[0] as PositionData)?.result?.[1] ?? "0") as string,
		18
	)
		.multipliedBy(normalizeBN((positionData?.[1].result as string) ?? "0", 6))
		.div(normalizeBN((positionData?.[2].result as string) ?? "0", 18));
	const availableToBorrow = normalizeBN((conversionPrice as string) ?? "0", 6)
		.multipliedBy(normalizeBN((ltv as string) ?? "0", 18))
		.minus(userBorrowAssets.isNaN() ? 0 : userBorrowAssets);
	const collateral = normalize(
		((positionData?.[0] as PositionData)?.result?.[2] ?? "0") as string,
		18
	);
	const totalBorrowAssets = positionData?.[1].result as string;
	const totalBorrowShares = positionData?.[2].result as string;

	console.log("totalBorrowAssets", totalBorrowAssets);
	console.log("totalBorrowShares", totalBorrowShares);

	const initialLtvRatio = useMemo(() => {
		if (userBorrowAssets.isNaN()) return 0;

		const totalCollateralValue = normalizeBN(
			(conversionPrice as string) ?? "0",
			6
		);
		console.log("totalCollateralValue", totalCollateralValue);

		if (totalCollateralValue.isZero()) return 0;

		const result = userBorrowAssets
			.div(totalCollateralValue)
			.multipliedBy(100)
			.toNumber();

		console.log("result", result);

		return result;
	}, [userBorrowAssets, conversionPrice]);
	const [ltvRatio, setLtvRatio] = useState(initialLtvRatio);

	useEffect(() => {
		setLtvRatio(initialLtvRatio);
	}, [initialLtvRatio]);

	const handleLtvChange = (value: number) => {
		setLtvRatio(value);
		const maxBorrowAmount = availableToBorrow;
		let newBorrowAmount = normalizeBN((conversionPrice as string) ?? "0", 6)
			.multipliedBy(value)
			.div(100)
			.minus(userBorrowAssets.isNaN() ? 0 : userBorrowAssets);

		// If newBorrowAmount is less than 0, set it to 0
		if (newBorrowAmount.isLessThan(0)) {
			newBorrowAmount = normalizeBN("0", 6);
		}

		// Ensure the new borrow amount does not exceed the available to borrow amount
		const finalBorrowAmount = newBorrowAmount.isGreaterThan(maxBorrowAmount)
			? maxBorrowAmount
			: newBorrowAmount;

		setBorrowAmount(finalBorrowAmount.toString());
	};

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
									<span className="text-zinc-400">Wallet Balance:</span>
									<span className="text-zinc-300">
										{balanceCollateral.formattedBalance} WETH
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-zinc-400">Deposited:</span>
									<span className="text-zinc-300">
										{parseFloat(collateral) === 0
											? "0"
											: parseFloat(collateral).toFixed(2)}{" "}
										WETH
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<Button
									disabled={depositCollateral.isPending}
									className="w-full border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
									onClick={() => {
										depositCollateral.mutate(
											{
												amount: collateralAmount,
											},
											{
												onSuccess() {
													toast({
														title: "Deposited successfully",
														description: "You have successfully deposited",
													});
													refetchPositions();
												},
												onError(error) {
													toast({
														title: "Error",
														description: error.message,
													});
												},
											}
										);
										// setCollateralAmount("0");
									}}
								>
									{depositCollateral.isPending ? "Depositing..." : "Deposit"}
								</Button>
								<Button
									disabled={
										withdrawCollateral.isPending || parseFloat(collateral) <= 0
									}
									className="w-full border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
									onClick={() => {
										withdrawCollateral.mutate(
											{
												amount: collateralAmount,
											},
											{
												onSuccess() {
													toast({
														title: "Withdrawn successfully",
														description: "You have successfully withdrawn",
													});
													refetchPositions();
												},
												onError(error) {
													toast({
														title: "Error",
														description: error.message,
													});
												},
											}
										);
										// setCollateralAmount("0");
									}}
								>
									{withdrawCollateral.isPending ? "Withdrawing..." : "Withdraw"}
								</Button>
							</div>
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
									<span className="text-zinc-300">
										{availableToBorrow.isNaN() || availableToBorrow.isZero()
											? "0"
											: availableToBorrow.toFixed(2)}{" "}
										USDC
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-zinc-400">Borrowed:</span>
									<span className="text-zinc-300">
										{userBorrowAssets.isNaN() || userBorrowAssets.isZero()
											? "0"
											: userBorrowAssets.toFixed(2)}{" "}
										USDC
									</span>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<Button
									disabled={borrow.isPending || parseFloat(collateral) <= 0}
									className="w-full border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
									onClick={() => {
										borrow.mutate(
											{
												amount: borrowAmount,
											},
											{
												onSuccess() {
													toast({
														title: "Borrowed successfully",
														description: "You have successfully borrowed",
													});
													refetchPositions();
												},
												onError(error) {
													toast({
														title: "Error",
														description: error.message,
													});
												},
											}
										);
										// setBorrowAmount("0");
									}}
								>
									{borrow.isPending ? "Borrowing..." : "Borrow"}
								</Button>
								<Button
									disabled={
										repay.isPending ||
										parseFloat(userBorrowAssets.toFixed(2)) <= 0
									}
									className="w-full border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
									onClick={() => {
										repay.mutate(
											{
												amount: borrowAmount,
												totalAssets: totalBorrowAssets,
												totalShares: totalBorrowShares,
											},
											{
												onSuccess() {
													toast({
														title: "Repaid successfully",
														description: "You have successfully repaid",
													});
													refetchPositions();
												},
												onError(error) {
													toast({
														title: "Error",
														description: error.message,
													});
												},
											}
										);
										// setBorrowAmount("0");
									}}
								>
									{repay.isPending ? "Repaying..." : "Repay"}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* LTV Slider Card */}
			<LtvSlider
				value={ltvRatio}
				liquidationThreshold={liquidationThreshold}
				onChange={handleLtvChange}
			/>

			{/* Credit Boost Explainer */}
			{/* <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700">
				<CardContent className="p-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-center">
						<div className="flex-1">
							<h3 className="text-lg font-bold text-white">
								Enhanced Borrowing Power with Credit Boost
							</h3>
							<p className="mt-1 text-zinc-400">
								Leverage your outstanding credit score to access a 2.8x
								collateral multiplier, enabling borrowing up to 280% of your
								collateral's value. This surpasses the typical 75% limit found
								in conventional DeFi platforms.
							</p>
						</div>
						<Button className="shrink-0 bg-white text-black hover:bg-zinc-200">
							Discover More
						</Button>
					</div>
				</CardContent>
			</Card> */}
		</div>
	);
}
