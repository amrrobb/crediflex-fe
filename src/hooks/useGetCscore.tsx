import avsAbi from "@/abi/avs.json";
import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";
import { HexAddress } from "@/lib/type";
import { useAccount, useChainId, useReadContract } from "wagmi";

export const useGetCurrentUserCscore = () => {
	const { address } = useAccount();
	const chainId = useChainId();

	return useReadContract({
		abi: avsAbi,
		address: getContractAddress(chainId, ContractName.avs) as HexAddress,
		functionName: "getUserCScoreData",
		args: [address],
		query: {
			enabled: !!address,
		},
	});
};
