import { useReadContract } from "wagmi";
import mainAbi from "@/abi/main.json";
import { HexAddress } from "@/lib/type";

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
	return useReadContract({
		abi: mainAbi,
		address: process.env.NEXT_PUBLIC_EDUCHAIN_CREDIFLEX_ADDRESS as HexAddress,
		functionName: "getConversionPrice",
		args: [amountIn, dataFeedIn, dataFeedOut, tokenIn, tokenOut],
		query: {
			enabled:
				!!amountIn && !!dataFeedIn && !!dataFeedOut && !!tokenIn && !!tokenOut,
		},
	});
};
