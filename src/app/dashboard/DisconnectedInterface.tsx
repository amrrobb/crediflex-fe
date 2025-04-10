"use client";

import { Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function DisconnectedInterface() {
	return (
		<div className="max-w-md mx-auto bg-zinc-900/80 rounded-lg border border-zinc-800 overflow-hidden">
			<div className="p-4 space-y-5">
				<h2 className="text-2xl font-bold text-center text-white">
					Welcome to Crediflex
				</h2>

				<div className="mt-6 space-y-4">
					<div className="flex items-start gap-3 bg-zinc-800/50 p-4 rounded-md">
						<div className="bg-amber-500/20 rounded-full p-1.5 mt-0.5">
							<Wallet className="h-4 w-4 text-amber-500" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-white">
								Wallet Connection Needed
							</h3>
							<p className="text-sm text-zinc-400 mt-1">
								Please connect your wallet to view your dashboard, access
								lending features, and manage your positions.
							</p>
						</div>
					</div>
					<div className="flex justify-center">
						<ConnectButton />
					</div>
				</div>
			</div>
		</div>
	);
}
