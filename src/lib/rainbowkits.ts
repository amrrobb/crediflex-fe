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
		name: "EDU",
		symbol: "EDU",
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

export const wagmiConfig = createConfig({
	chains: [
		openCampusTestnet,
		//  arbitrumSepolia
	],
	transports: {
		[openCampusTestnet.id]: http(
			"https://rpc.open-campus-codex.gelato.digital"
		),
		// [arbitrumSepolia.id]: http(
		// 	"https://arbitrum-sepolia.blockpi.network/v1/rpc/public"
		// ),
	},
});
