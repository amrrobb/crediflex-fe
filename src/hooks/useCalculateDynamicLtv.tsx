import mainAbi from "@/abi/main.json";
import { HexAddress } from "@/lib/type";
import { useReadContract } from "wagmi";

export const useCalculateDynamicLtv = ({
	userAddress,
}: {
	userAddress?: HexAddress;
}) => {
	return useReadContract({
		abi: mainAbi,
		address: process.env.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
		functionName: "calculateDynamicLTV",
		args: [userAddress],
		query: {
			enabled: !!userAddress,
		},
	});
};
