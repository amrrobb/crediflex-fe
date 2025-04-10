import avsAbi from "@/abi/avs.json";
import { HexAddress } from "@/lib/type";
import { useAccount, useReadContract } from "wagmi";

export const useGetCurrentUserCscore = () => {
	const { address } = useAccount();
	return useReadContract({
		abi: avsAbi,
		address: process.env.NEXT_PUBLIC_EDUCHAIN_AVS_ADDRESS as HexAddress,
		functionName: "getUserCScoreData",
		args: [address],
		query: {
			enabled: !!address,
		},
	});
};
