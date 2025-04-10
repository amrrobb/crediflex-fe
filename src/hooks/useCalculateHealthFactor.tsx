import mainAbi from "@/abi/main.json";
import { HexAddress } from "@/lib/type";
import { useReadContract } from "wagmi";

export const useCalculateHealthFactor = ({
	userAddress,
}: {
	userAddress?: HexAddress;
}) => {
	return useReadContract({
		abi: mainAbi,
		address: process.env.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
		functionName: "calculateHealth",
		args: [userAddress],
		query: {
			enabled: !!userAddress,
		},
	});
};
