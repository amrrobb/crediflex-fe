import { useChainId, useReadContract } from "wagmi";
import mainAbi from "@/abi/main.json";
import { HexAddress } from "@/lib/type";
import {
	ContractName,
	getContractAddress,
} from "@/constants/contract/contract-address";

export const useGetConversionPrice = ({
	amountIn,
	dataFeedIn,
	dataFeedOut,
	tokenIn,
	tokenOut,
}: {
	amountIn: string;
	dataFeedIn: string;
	dataFeedOut: string;
	tokenIn: string;
	tokenOut: string;
}) => {
	const chainId = useChainId();
	return useReadContract({
		abi: mainAbi,
		address: getContractAddress(chainId, ContractName.crediflex) as HexAddress,
		functionName: "getConversionPrice",
		args: [amountIn, dataFeedIn, dataFeedOut, tokenIn, tokenOut],
		query: {
			enabled:
				!!amountIn && !!dataFeedIn && !!dataFeedOut && !!tokenIn && !!tokenOut,
		},
	});
};
