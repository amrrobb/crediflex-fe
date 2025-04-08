import Link from "next/link";
import {
	Clock,
	ExternalLink,
	Info,
	Percent,
	RefreshCw,
	Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface CreditProfileProps {
	creditScore: number;
	healthFactor: number;
	lastUpdated: string;
	borrowRate?: number;
}

export function CreditProfile({
	creditScore,
	healthFactor = 1.85,
	lastUpdated = "2 hours ago",
	borrowRate = 10,
}: CreditProfileProps) {
	const { status, statusColor, progressColor } = useMemo(() => {
		if (creditScore >= 751) {
			return {
				status: "Excellent",
				statusColor: "text-emerald-500",
				progressColor: "bg-gradient-to-r from-emerald-400 to-emerald-600",
			};
		} else if (creditScore >= 601) {
			return {
				status: "Good",
				statusColor: "text-blue-400",
				progressColor: "bg-gradient-to-r from-blue-400 to-blue-600",
			};
		} else if (creditScore >= 301) {
			return {
				status: "Fair",
				statusColor: "text-amber-400",
				progressColor: "bg-gradient-to-r from-amber-400 to-amber-600",
			};
		} else {
			return {
				status: "Poor",
				statusColor: "text-red-400",
				progressColor: "bg-gradient-to-r from-red-400 to-red-600",
			};
		}
	}, [creditScore]);

	// Determine health factor status and colors
	const { healthStatus, healthBadgeClass, healthIconClass, healthBgClass } =
		useMemo(() => {
			if (healthFactor >= 2) {
				return {
					healthStatus: "Excellent",
					healthBadgeClass:
						"bg-emerald-950/30 text-emerald-500 border-emerald-800",
					healthIconClass: "text-emerald-500",
					healthBgClass:
						"bg-gradient-to-r from-emerald-800/40 to-emerald-950/40",
				};
			} else if (healthFactor >= 1.5) {
				return {
					healthStatus: "Healthy",
					healthBadgeClass: "bg-blue-950/30 text-blue-400 border-blue-800",
					healthIconClass: "text-blue-400",
					healthBgClass: "bg-gradient-to-r from-blue-800/40 to-blue-950/40",
				};
			} else if (healthFactor >= 1.1) {
				return {
					healthStatus: "Moderate",
					healthBadgeClass: "bg-amber-950/30 text-amber-400 border-amber-800",
					healthIconClass: "text-amber-400",
					healthBgClass: "bg-gradient-to-r from-amber-800/40 to-amber-950/40",
				};
			} else {
				return {
					healthStatus: "Risky",
					healthBadgeClass: "bg-red-950/30 text-red-400 border-red-800",
					healthIconClass: "text-red-400",
					healthBgClass: "bg-gradient-to-r from-red-800/40 to-red-950/40",
				};
			}
		}, [healthFactor]);
	return (
		<div className="space-y-6">
			<div className="mb-8 grid gap-6 md:grid-cols-3">
				<Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
					<CardHeader className="pb-2">
						<div className="flex items-center justify-between">
							<CardTitle className="text-lg font-bold text-white">
								Credit Score
							</CardTitle>
							<div className="flex items-center text-xs text-zinc-400">
								<Clock className="mr-1 h-3 w-3" />
								<span>Last updated: {lastUpdated}</span>
							</div>
						</div>
						<CardDescription className="text-zinc-400">
							Based on your on-chain activity
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<div className="flex items-end justify-between">
							<div>
								<span className="text-3xl font-bold text-white">
									{creditScore}
								</span>
								<span className={`ml-2 text-sm ${statusColor}`}>{status}</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-zinc-400 hover:text-white"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
						<div className="mt-4">
							<Progress
								value={(creditScore / 1000) * 100}
								className="h-2 bg-zinc-800"
								indicatorClassName={progressColor}
							/>
							<div className="mt-1 flex justify-between text-xs text-zinc-500">
								<span>0</span>
								<span>1000</span>
							</div>
						</div>
						<div className="mt-3 flex justify-between text-xs text-zinc-500">
							<span>Poor</span>
							<span>Fair</span>
							<span>Good</span>
							<span>Excellent</span>
						</div>

						<Button className="mt-4 w-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white">
							Request Credit Score
						</Button>
					</CardContent>
					<CardFooter className="border-t border-zinc-800 pt-4 mt-auto">
						<Link href="#" className="text-xs text-zinc-400 hover:text-white">
							View credit report
							<ExternalLink className="ml-1 inline h-3 w-3" />
						</Link>
					</CardFooter>
				</Card>

				<Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-bold text-white">
							Borrowing Power
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Maximum undercollateralized loan
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<div className="flex items-end justify-between">
							<div>
								<span className="text-3xl font-bold text-white">280%</span>
								<span className="ml-2 text-sm text-zinc-400">
									of collateral
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-zinc-400 hover:text-white"
							>
								<Info className="h-4 w-4" />
							</Button>
						</div>
						<div className="mt-4 flex items-center justify-between rounded-md bg-zinc-800/50 p-2 text-sm">
							<span className="text-zinc-400">Collateral Multiplier</span>
							<span className="font-medium text-white">2.8x</span>
						</div>
					</CardContent>
					<CardFooter className="border-t border-zinc-800 pt-4 mt-auto">
						<Link href="#" className="text-xs text-zinc-400 hover:text-white">
							How is this calculated?
							<ExternalLink className="ml-1 inline h-3 w-3" />
						</Link>
					</CardFooter>
				</Card>

				<Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col">
					<CardHeader className="pb-2">
						<CardTitle className="text-lg font-bold text-white">
							Your Position
						</CardTitle>
						<CardDescription className="text-zinc-400">
							Current lending & borrowing
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-grow">
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-400">Supplied</span>
								<span className="font-medium text-white">$12,450.00</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-400">Borrowed</span>
								<span className="font-medium text-white">$8,750.00</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-zinc-400">Available</span>
								<span className="font-medium text-emerald-500">$26,110.00</span>
							</div>
						</div>
					</CardContent>
					<CardFooter className="border-t border-zinc-800 pt-4 mt-auto">
						<Link href="#" className="text-xs text-zinc-400 hover:text-white">
							View position details
							<ExternalLink className="ml-1 inline h-3 w-3" />
						</Link>
					</CardFooter>
				</Card>
			</div>
			<div className="grid gap-6 md:grid-cols-5">
				{/* Borrow Rate Card - Takes 2 columns */}
				<Card className="bg-zinc-900 border-zinc-800 md:col-span-3">
					<CardContent className="py-6 flex items-center justify-between">
						{/* Left side: Header info */}
						<div>
							<CardTitle className="text-lg font-bold text-white">
								Borrow Rate
							</CardTitle>
							<CardDescription className="text-zinc-400">
								Current interest rate for borrowing
							</CardDescription>
						</div>

						{/* Right side: Rate value */}
						<div className="flex items-end">
							<span className="text-4xl font-bold text-white">{10}%</span>
							{/* <Percent className="h-8 w-8 mx-2 text-amber-400" /> */}
							<span className="mx-2 text-xl text-white">APR</span>
						</div>
					</CardContent>
				</Card>

				{/* Health Factor Card - Takes 1 column */}
				<Card
					className={`bg-zinc-900 border-zinc-800 md:col-span-2 ${healthBgClass}`}
				>
					<CardContent className="py-6 flex items-center flex-col md:flex-row md:items-center justify-between gap-4 px-4">
						{/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4"> */}
						{/* Icon + Label */}
						<div className="flex items-center gap-3">
							<Shield className={`h-6 w-6 ${healthIconClass}`} />
							<div>
								<CardTitle className="text-lg font-bold text-white">
									Health Factor
								</CardTitle>
								<CardDescription className="text-zinc-400">
									Reflects your loan’s liquidation risk
								</CardDescription>
							</div>
						</div>

						{/* Score + Badge */}
						<div className="flex items-center gap-4">
							<span className={`text-5xl font-extrabold ${healthIconClass}`}>
								{healthFactor === Infinity ? "♾️" : healthFactor.toFixed(2)}
							</span>
							<Badge
								variant="outline"
								className={`text-sm px-3 py-1 rounded-full ${healthBadgeClass}`}
							>
								{healthStatus}
							</Badge>
						</div>
						{/* </div> */}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
