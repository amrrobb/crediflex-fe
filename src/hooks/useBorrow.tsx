import mainAbi from "@/abi/main.json";
import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";
import { denormalize } from "@/lib/bignumber";
import { wagmiConfig } from "@/lib/rainbowkits";
import { HexAddress } from "@/lib/type";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";

type Status = "idle" | "loading" | "success" | "error";

export const useBorrow = () => {
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
		mutationFn: async ({ amount }: { amount: string }) => {
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

				const txHash = await writeContract(wagmiConfig, {
					address: vaultAddress as HexAddress,
					abi: mainAbi,
					functionName: "borrow",
					args: [userInputBn],
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
