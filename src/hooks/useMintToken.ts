"use client";

import { wagmiConfig } from "@/lib/rainbowkits";
import { useState } from "react";
import { erc20Abi } from "viem";
import { HexAddress } from "@/lib/type";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";

interface MintParams {
	tokenAddress: HexAddress; // Ensure tokenAddress is a valid hex string
	amount: string;
	receiver?: HexAddress;
}

export function useMintToken() {
	const [isPending, setIsPending] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const { address } = useAccount();
	const chainId = useChainId();
	const { data: walletClient } = useWalletClient();

	const reset = () => {
		setIsPending(false);
		setIsSuccess(false);
		setIsError(false);
		setError(null);
	};

	const mint = async ({ tokenAddress, amount, receiver }: MintParams) => {
		if (!address || !walletClient) {
			setError(new Error("Wallet not connected"));
			setIsError(true);
			return;
		}

		try {
			setIsPending(true);
			reset();

			// For a real implementation, you would need a custom ABI with the mint function
			// This is a simplified example using the standard ERC20 transfer function
			// In a real faucet, you would call a mint function on the contract

			// For demonstration purposes, we're using encodeFunctionData
			const receiverAddres = receiver || address;
			const txHash = await writeContract(wagmiConfig, {
				address: tokenAddress,
				abi: faucetAbi,
				functionName: "mint",
				args: [receiverAddres, amount],
				...(chainId === 50002 ? { gas: BigInt(300_000) } : {}),
			});

			const result = await waitForTransactionReceipt(wagmiConfig, {
				hash: txHash,
			});

			setIsSuccess(true);
			setIsPending(false);

			return result;
		} catch (err) {
			console.error("Error minting tokens:", err);
			setError(err instanceof Error ? err : new Error("Failed to mint tokens"));
			setIsError(true);
			setIsPending(false);
		}
	};

	return {
		mint,
		isPending,
		isSuccess,
		isError,
		error,
		reset,
	};
}

// Custom faucet ABI with mint function
export const faucetAbi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "mint",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	...erc20Abi, // Include the standard ERC20 functions
];
