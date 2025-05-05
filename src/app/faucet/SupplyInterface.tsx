"use client";

import type React from "react";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	CheckCircle2,
	AlertCircle,
	Loader2,
	DollarSign,
	ArrowRight,
	Info,
} from "lucide-react";
import { useSupply } from "@/hooks/useSupply";

export function SupplyInterface() {
	const [amount, setAmount] = useState("100");
	const [multiplier, setMultiplier] = useState("1");
	const [isPending, setIsPending] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/[^0-9.]/g, "");
		setAmount(value);
	};

	const calculateTotalAmount = () => {
		const baseAmount = Number.parseFloat(amount) || 0;

		if (multiplier === "1e18") {
			return `${baseAmount} × 10^18 = ${baseAmount} USDC`;
		} else if (multiplier === "1e12") {
			return `${baseAmount} × 10^12 = ${baseAmount / 1_000_000} USDC`;
		} else if (multiplier === "1e6") {
			return `${baseAmount} × 10^6 = ${baseAmount / 1_000_000_000_000} USDC`;
		} else {
			return `${baseAmount} USDC`;
		}
	};

	const { mutation: supply } = useSupply();

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card className="bg-zinc-900 border-zinc-800">
				<CardHeader>
					<CardTitle className="text-xl font-medium text-white">
						Supply USDC
					</CardTitle>
					<CardDescription className="text-zinc-400">
						Supply USDC to the Crediflex protocol to earn interest
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center">
								<DollarSign className="h-5 w-5 text-blue-400" />
							</div>
							<div>
								<h3 className="text-sm font-medium text-white">USDC</h3>
								<p className="text-xs text-zinc-400">USD Coin</p>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="supply-amount" className="text-zinc-300">
								Amount
							</Label>
							<div className="flex gap-2">
								<Input
									id="supply-amount"
									type="text"
									value={amount}
									onChange={handleAmountChange}
									className="bg-zinc-800 border-zinc-700 text-white"
									placeholder="Enter amount"
								/>
								<Select value={multiplier} onValueChange={setMultiplier}>
									<SelectTrigger className="w-[120px] bg-zinc-800 border-zinc-700 text-white">
										<SelectValue placeholder="Multiplier" />
									</SelectTrigger>
									<SelectContent className="bg-zinc-800 border-zinc-700 text-white">
										<SelectItem value="1">× 1</SelectItem>
										<SelectItem value="1e6">× 10^6</SelectItem>
										<SelectItem value="1e12">× 10^12</SelectItem>
										<SelectItem value="1e18">× 10^18</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<p className="text-xs text-zinc-500">
								Total: {calculateTotalAmount()}
							</p>
						</div>

						<div className="space-y-1">
							<div className="flex justify-between text-sm">
								<span className="text-zinc-400">Wallet Balance:</span>
								<span className="text-zinc-300">1,000 USDC</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-zinc-400">Supply APY:</span>
								<span className="text-emerald-500">4.2%</span>
							</div>
						</div>

						<Button
							onClick={() => {
								supply.mutate(
									{
										amount: amount,
									},
									{
										onSuccess() {
											setIsSuccess(true);
											setIsPending(false);
										},
										onError(error) {
											setError(error);
											setIsError(true);
											setIsPending(false);
										},
									}
								);
								setIsPending(true);
							}}
							disabled={supply.isPending}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white"
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Supplying...
								</>
							) : (
								"Supply USDC"
							)}
						</Button>

						{isSuccess && (
							<Alert className="bg-emerald-900/20 border-emerald-800 text-emerald-500">
								<CheckCircle2 className="h-4 w-4" />
								<AlertTitle>Success!</AlertTitle>
								<AlertDescription>{`${amount} USDC has been supplied to the Crediflex protocol.`}</AlertDescription>
							</Alert>
						)}

						{isError && (
							<Alert className="bg-red-900/20 border-red-800 text-red-500">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>
									{error?.message ||
										"Failed to supply tokens. Please try again."}
								</AlertDescription>
							</Alert>
						)}
					</div>
				</CardContent>
			</Card>

			<Card className="bg-zinc-900 border-zinc-800">
				<CardHeader>
					<CardTitle className="text-xl font-medium text-white">
						Supply Information
					</CardTitle>
					<CardDescription className="text-zinc-400">
						How supplying works in the Crediflex protocol
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h3 className="text-lg font-medium text-white mb-2">
								Supply Details
							</h3>
							<div className="space-y-2">
								<div className="flex justify-between py-2 border-b border-zinc-800">
									<span className="text-zinc-400">USDC Contract</span>
									<span className="text-zinc-300 font-mono text-sm">
										{getContractAddress(chainId, ContractName.usdc)}
									</span>
								</div>
							</div>
						</div>

						<div className="rounded-lg bg-zinc-800 p-4">
							<div className="flex items-start gap-3">
								<div className="bg-blue-900/30 rounded-full p-1.5">
									<Info className="h-4 w-4 text-blue-400" />
								</div>
								<div>
									<p className="font-medium text-white">
										Benefits of Supplying
									</p>
									<p className="text-sm text-zinc-400 mt-1">
										When you supply assets to the Crediflex protocol, you earn
										interest based on the market borrowing demand. Supplied
										assets can also be used as collateral for borrowing.
									</p>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between p-3 bg-blue-900/10 rounded-lg border border-blue-900/20">
							<div className="flex items-center gap-2">
								<ArrowRight className="h-4 w-4 text-blue-400" />
								<span className="text-sm text-blue-400">
									View your supply positions
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
							>
								Dashboard
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
