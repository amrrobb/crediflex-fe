import { FaucetInterface } from "./FaucetInterface";

export default function FaucetPage() {
	return (
		<div className="flex min-h-screen flex-col bg-black text-white">
			<main className="flex-1 py-8">
				<div className="container mx-auto px-4">
					<h1 className="text-3xl font-bold mb-6">Token Faucet</h1>
					<p className="text-zinc-400 mb-8">
						Get testnet tokens for the Crediflex protocol. These tokens are for
						testing purposes only and have no real value.
					</p>

					<FaucetInterface />
				</div>
			</main>
		</div>
	);
}
