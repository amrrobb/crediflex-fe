import { Chain } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
// import { arbitrumSepolia } from "viem/chains";

const openCampusTestnet = {
	id: 656476,
	name: "Open Campus",
	iconUrl:
		"https://s3.coinmarketcap.com/static-gravity/image/60f1fc5d85f2463881db170b6d740876.png",
	iconBackground: "#fff",
	nativeCurrency: {
		name: "Ether",
		symbol: "ETH",
		decimals: 18,
	},
	rpcUrls: {
		default: { http: ["https://rpc.open-campus-codex.gelato.digital"] }, // Replace with your custom chain RPC URL
	},
	blockExplorers: {
		default: {
			name: "Custom Explorer",
			url: "https://opencampus-codex.blockscout.com/",
		}, // Replace with your custom chain explorer URL
	},
} as const satisfies Chain;

const pharosDevnet = {
	id: 50002,
	name: "Pharos Devnet",
	iconUrl: "./pharos.png",
	nativeCurrency: {
		decimals: 18,
		name: "Ether",
		symbol: "ETH",
	},
	rpcUrls: {
		default: {
			http: ["/api/rpc/pharos"],
			// http: ["https://devnet.dplabs-internal.com"],
		},
	},
	blockExplorers: {
		default: {
			name: "Explorer",
			url: "https://pharosscan.xyz/",
		},
	},
} as const satisfies Chain;

export const wagmiConfig = createConfig({
	chains: [
		pharosDevnet,
		openCampusTestnet,
		//  arbitrumSepolia
	],
	transports: {
		[pharosDevnet.id]: http(pharosDevnet.rpcUrls.default.http[0]),
		[openCampusTestnet.id]: http(openCampusTestnet.rpcUrls.default.http[0]),
		// [arbitrumSepolia.id]: http(
		// 	"https://arbitrum-sepolia.blockpi.network/v1/rpc/public"
		// ),
	},
});
