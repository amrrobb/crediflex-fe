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
import { useAccount, useChainId } from "wagmi";
import mainAbi from "@/abi/main.json";
import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";

type Status = "idle" | "loading" | "success" | "error";

export const useRepay = () => {
	const { address: userAddress } = useAccount();
	const chainId = useChainId();

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
		mutationFn: async ({
			amount,
			totalShares,
			totalAssets,
		}: {
			amount: string;
			totalShares: string;
			totalAssets: string;
		}) => {
			try {
				const vaultAddress = getContractAddress(
					chainId,
					ContractName.crediflex
				) as HexAddress;
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

				const totalSharesBn = BigInt(totalShares);
				const totalAssetsBn = BigInt(totalAssets);

				if (totalAssetsBn === BigInt(0)) {
					throw new Error("Total assets cannot be zero");
				}

				const userSharesBn = (userInputBn * totalSharesBn) / totalAssetsBn;
				console.log("userSharesBn", userSharesBn);
				console.log("userInputBn", userInputBn);
				//  uint256 assets = shares * totalBorrowAssets / totalBorrowShares;

				const assetTokenAddress = getContractAddress(
					chainId,
					ContractName.usdc
				) as HexAddress;
				// Step 1: Check allowance

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
					functionName: "repay",
					args: [userSharesBn],
					...(chainId === 50002 ? { gas: BigInt(300_000) } : {}),
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
