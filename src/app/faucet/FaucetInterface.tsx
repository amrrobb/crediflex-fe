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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useMintToken } from "@/hooks/useMintToken";
import { HexAddress } from "@/lib/type";
import { Switch } from "@/components/ui/switch";

export function FaucetInterface() {
	const [token, setToken] = useState("WETH");
	const [amount, setAmount] = useState("1");
	const [multiplier, setMultiplier] = useState("1");
	const [receiver, setReceiver] = useState<HexAddress | undefined>(undefined);
	const [customReceiverEnabled, setCustomReceiverEnabled] = useState(false);

	const { mint, isPending, isSuccess, isError, error } = useMintToken();

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Only allow numbers and decimal points
		const value = e.target.value.replace(/[^0-9.]/g, "");
		setAmount(value);
	};

	const getMultiplierValue = () => {
		switch (multiplier) {
			case "1e6":
				return 1_000_000;
			case "1e12":
				return 1_000_000_000_000;
			case "1e18":
				return 1_000_000_000_000_000_000;
			default:
				return 1;
		}
	};

	const calculateTotalAmount = () => {
		const baseAmount = Number.parseFloat(amount) || 0;
		// const multiplierValue = Number(getMultiplierValue());

		if (multiplier === "1e18") {
			return `${baseAmount} × 10^18 = ${baseAmount} ${token}`;
		} else if (multiplier === "1e12") {
			return `${baseAmount} × 10^12 = ${baseAmount / 1_000_000} ${token}`;
		} else if (multiplier === "1e6") {
			return `${baseAmount} × 10^6 = ${
				baseAmount / 1_000_000_000_000
			} ${token}`;
		} else {
			return `${baseAmount} ${token}`;
		}
	};

	const handleToggleCustomReceiver = (checked: boolean) => {
		setCustomReceiverEnabled(checked);
		if (!checked) {
			setReceiver(undefined);
		}
	};

	const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setReceiver(e.target.value as HexAddress);
	};

	const handleMint = async () => {
		if (!amount || Number.parseFloat(amount) <= 0) return;

		const tokenAddress: HexAddress = (
			token === "WETH"
				? getContractAddress(chainId, ContractName.weth)
				: getContractAddress(chainId, ContractName.usdc)
		) as HexAddress;

		const value = Number.parseFloat(amount) * Number(getMultiplierValue());

		await mint({
			tokenAddress,
			amount: value.toString(),
			receiver: receiver,
		});
	};

	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card className="bg-zinc-900 border-zinc-800">
				<CardHeader>
					<CardTitle className="text-xl font-medium text-white">
						Get Test Tokens
					</CardTitle>
					<CardDescription className="text-zinc-400">
						Mint test tokens to use with the Crediflex protocol
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<Tabs defaultValue="WETH" onValueChange={setToken}>
							<TabsList className="bg-zinc-800 border border-zinc-700">
								<TabsTrigger
									value="WETH"
									className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
								>
									WETH
								</TabsTrigger>
								<TabsTrigger
									value="USDC"
									className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
								>
									USDC
								</TabsTrigger>
							</TabsList>

							<TabsContent value="WETH" className="mt-4">
								<div className="text-sm text-zinc-400 mb-4">
									Wrapped Ether (WETH) is the ERC-20 compatible version of ETH
									used for collateral.
								</div>
							</TabsContent>

							<TabsContent value="USDC" className="mt-4">
								<div className="text-sm text-zinc-400 mb-4">
									USD Coin (USDC) is a stablecoin pegged to the US dollar used
									for borrowing.
								</div>
							</TabsContent>
						</Tabs>

						<div className="space-y-2">
							<Label htmlFor="amount" className="text-zinc-300">
								Amount
							</Label>
							<div className="flex gap-2">
								<Input
									id="amount"
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

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="custom-receiver" className="text-zinc-300">
									Send to different address
								</Label>
								<Switch
									id="custom-receiver"
									checked={customReceiverEnabled}
									onCheckedChange={handleToggleCustomReceiver}
								/>
							</div>

							{customReceiverEnabled && (
								<div className="space-y-2">
									<Label htmlFor="receiver-address" className="text-zinc-300">
										Receiver Address
									</Label>
									<Input
										id="receiver-address"
										type="text"
										value={receiver || ""}
										onChange={handleReceiverChange}
										className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
										placeholder="0x..."
									/>
									<p className="text-xs text-zinc-500">
										Enter the Ethereum address to receive the tokens
									</p>
								</div>
							)}
						</div>

						<Button
							onClick={handleMint}
							disabled={isPending || !amount || Number.parseFloat(amount) <= 0}
							className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Minting...
								</>
							) : (
								`Mint ${token}`
							)}
						</Button>

						{isSuccess && (
							<Alert className="bg-emerald-900/20 border-emerald-800 text-emerald-500">
								<CheckCircle2 className="h-4 w-4" />
								<AlertTitle>Success!</AlertTitle>
								<AlertDescription>{`${amount} ${token} has been minted to your wallet.`}</AlertDescription>
							</Alert>
						)}

						{isError && (
							<Alert className="bg-red-900/20 border-red-800 text-red-500">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>
									{error?.message || "Failed to mint tokens. Please try again."}
								</AlertDescription>
							</Alert>
						)}
					</div>
				</CardContent>
			</Card>

			<Card className="bg-zinc-900 border-zinc-800">
				<CardHeader>
					<CardTitle className="text-xl font-medium text-white">
						Faucet Information
					</CardTitle>
					<CardDescription className="text-zinc-400">
						How to use the token faucet
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4 my-4">
						<div>
							<h3 className="text-lg font-medium text-white mb-2">
								Token Details
							</h3>
							<div className="space-y-2">
								<div className="flex justify-between py-2 border-b border-zinc-800">
									<span className="text-zinc-400">WETH Contract</span>
									<span className="text-zinc-300 font-mono text-sm">
										{getContractAddress(chainId, ContractName.weth)}
									</span>
								</div>
								<div className="flex justify-between py-2 border-b border-zinc-800">
									<span className="text-zinc-400">USDC Contract</span>
									<span className="text-zinc-300 font-mono text-sm">
										{getContractAddress(chainId, ContractName.usdc)}
									</span>
								</div>
							</div>
							<div className="flex justify-between py-2 border-b border-zinc-800">
								<span className="text-zinc-400">Network</span>
								<span className="text-zinc-300">Open Campus Testnet</span>
							</div>
						</div>
					</div>

					<div className="my-4">
						<h3 className="text-lg font-medium text-white mb-2">
							How It Works
						</h3>
						<ol className="space-y-2 text-zinc-400 list-decimal list-inside">
							<li>Select the token you want to mint (WETH or USDC)</li>
							<li>Enter the amount and select a multiplier if needed</li>
							<li>
								Click the mint button and confirm the transaction in your wallet
							</li>
							<li>The tokens will be sent to your connected wallet address</li>
						</ol>
					</div>

					<div className="bg-zinc-800 p-4 rounded-md">
						<h3 className="text-sm font-medium text-white mb-2">Note</h3>
						<p className="text-xs text-zinc-400">
							These are testnet tokens with no real value. They are only for
							testing the Crediflex protocol features. The faucet has a daily
							limit to prevent abuse.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
