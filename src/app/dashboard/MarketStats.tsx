import { ArrowRight, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketStats() {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-zinc-900 border-zinc-800">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Total Value Locked
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">$110.2M</div>
						<div className="mt-1 flex items-center text-xs text-emerald-500">
							<ArrowRight className="mr-1 h-3 w-3 rotate-45" />
							<span>+5.2% from last week</span>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-zinc-900 border-zinc-800">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Total Borrowed
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">$77.9M</div>
						<div className="mt-1 flex items-center text-xs text-emerald-500">
							<ArrowRight className="mr-1 h-3 w-3 rotate-45" />
							<span>+3.8% from last week</span>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-zinc-900 border-zinc-800">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Utilization Rate
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">70.7%</div>
						<div className="mt-1 flex items-center text-xs text-zinc-400">
							<Percent className="mr-1 h-3 w-3" />
							<span>Optimal range: 70-80%</span>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-zinc-900 border-zinc-800">
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-zinc-400">
							Active Users
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-white">12,450</div>
						<div className="mt-1 flex items-center text-xs text-emerald-500">
							<ArrowRight className="mr-1 h-3 w-3 rotate-45" />
							<span>+12.3% from last month</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
