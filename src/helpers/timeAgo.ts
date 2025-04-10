export function timeAgo(unixTimestamp: number): string {
	if (unixTimestamp === 0) {
		return "-";
	}
	const now = typeof window !== "undefined" ? new Date().getTime() : Date.now();
	const diffInSeconds = Math.floor((now - unixTimestamp * 1000) / 1000);

	const units = [
		{ name: "year", seconds: 365 * 24 * 60 * 60 },
		{ name: "month", seconds: 30 * 24 * 60 * 60 },
		{ name: "day", seconds: 24 * 60 * 60 },
		{ name: "hour", seconds: 60 * 60 },
		{ name: "minute", seconds: 60 },
		{ name: "second", seconds: 1 },
	];

	for (const unit of units) {
		const value = Math.floor(diffInSeconds / unit.seconds);
		if (value >= 1) {
			return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
		}
	}

	return "just now";
}
