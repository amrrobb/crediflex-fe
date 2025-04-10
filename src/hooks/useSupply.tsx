import { denormalize } from "@/lib/bignumber";
import { wagmiConfig } from "@/lib/rainbowkits";
import { HexAddress } from "@/lib/type";
import { useMutation } from "@tanstack/react-query";
import {
	readContract,
	sendTransaction,
	waitForTransactionReceipt,
	writeContract,
} from "wagmi/actions";
import { useState } from "react";
import { encodeFunctionData, erc20Abi } from "viem";
import { useAccount } from "wagmi";
import mainAbi from "@/abi/main.json";

type Status = "idle" | "loading" | "success" | "error";

export const useSupply = () => {
	const { address: userAddress } = useAccount();

	const [steps, setSteps] = useState<
		Array<{
			step: number;
			status: Status;
			error?: string;
		}>
	>([
		{
			step: 1,
			status: "idle",
		},
		{
			step: 2,
			status: "idle",
		},
		{
			step: 3,
			status: "idle",
		},
	]);

	const mutation = useMutation({
		mutationFn: async ({ amount }: { amount: string }) => {
			try {
				const vaultAddress = process.env
					.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress;
				// Reset steps
				setSteps([
					{ step: 1, status: "idle" },
					{ step: 2, status: "idle" },
				]);

				if (!amount || !userAddress) {
					throw new Error("Invalid parameters");
				}

				const denormalizeUserAmount = denormalize(amount || "0", 6);
				const userInputBn = BigInt(denormalizeUserAmount);
				const assetTokenAddress = process.env
					.NEXT_PUBLIC_EDUCHAIN_USDC_ADDRESS as HexAddress;
				// Step 1: Check allowance

				console.log("userInputBn", userInputBn);

				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 1) {
							return { ...item, status: "loading" };
						}
						return item;
					})
				);

				const allowanceData = await readContract(wagmiConfig, {
					address: assetTokenAddress as HexAddress,
					abi: erc20Abi,
					functionName: "allowance",
					args: [userAddress, vaultAddress as HexAddress],
				});

				if (allowanceData !== undefined) {
					if (
						(allowanceData === BigInt(0) || allowanceData < userInputBn) &&
						userInputBn !== BigInt(0)
					) {
						const data = encodeFunctionData({
							abi: erc20Abi,
							functionName: "approve",
							args: [vaultAddress as HexAddress, userInputBn],
						});

						// Send tx
						const txHash = await sendTransaction(wagmiConfig, {
							to: assetTokenAddress as HexAddress,
							data,
						});
						const receipt = await waitForTransactionReceipt(wagmiConfig, {
							hash: txHash,
						});
						if (receipt) {
							setSteps((prev) =>
								prev.map((item) => {
									if (item.step === 1) {
										return { ...item, status: "success" };
									}
									return item;
								})
							);
						}
					} else {
						setSteps((prev) =>
							prev.map((item) => {
								if (item.step === 1) {
									return { ...item, status: "success" };
								}
								return item;
							})
						);
					}
				}

				// Step 2: Perform deposit
				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 2) {
							return { ...item, status: "loading" };
						}
						return item;
					})
				);

				const txHash = await writeContract(wagmiConfig, {
					address: vaultAddress as HexAddress,
					abi: mainAbi,
					functionName: "supply",
					args: [userInputBn],
				});
				const result = await waitForTransactionReceipt(wagmiConfig, {
					hash: txHash,
				});

				setSteps((prev) =>
					prev.map((item) => {
						if (item.step === 2) {
							return { ...item, status: "success" };
						}
						return item;
					})
				);

				return result;
			} catch (e) {
				console.error("Error", e);
				setSteps((prev) =>
					prev.map((step) => {
						if (step.status === "loading") {
							return { ...step, status: "error", error: (e as Error).message };
						}
						return step;
					})
				);
				throw e;
			}
		},
	});

	return { steps, mutation };
};
