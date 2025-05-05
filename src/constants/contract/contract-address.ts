import contractAddresses from "./contract-address.json";

export enum ContractName {
	wethUsdDatafeed = "wethUsdDatafeed",
	usdcUsdDatafeed = "usdcUsdDatafeed",
	weth = "weth",
	usdc = "usdc",
	avs = "avs",
	crediflex = "crediflex",
}

interface ContractConfig {
	[chainId: string]: {
		[contract in ContractName]: string;
	};
}

const contractsConfig = contractAddresses as ContractConfig;

export function getContractAddress(
	chainId: string | number,
	contractName: ContractName
): string {
	const chainIdString = chainId.toString();
	const chainContracts = contractsConfig[chainIdString];

	if (!chainContracts) {
		throw new Error(`Chain ID ${chainIdString} not found in configuration`);
	}

	const address = chainContracts[contractName];

	if (!address) {
		throw new Error(
			`Contract ${contractName} not found for chain ID ${chainIdString}`
		);
	}

	return address;
}

/* Example usage:
const chainId = "1"; // Ethereum mainnet
const avsAddress = getContractAddress(chainId, ContractName.crediflex);
console.log("AVS Contract Address:", avsAddress);
*/
