import mainAbi from "@/abi/main.json";
import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";
import { HexAddress } from "@/lib/type";
import { useChainId, useReadContract } from "wagmi";

export const useCalculateHealthFactor = ({
	userAddress,
}: {
	userAddress?: HexAddress;
}) => {
	const chainId = useChainId();
	return useReadContract({
		abi: mainAbi,
		address: getContractAddress(chainId, ContractName.crediflex) as HexAddress,
		functionName: "calculateHealth",
		args: [userAddress],
		query: {
			enabled: !!userAddress,
		},
	});
};
