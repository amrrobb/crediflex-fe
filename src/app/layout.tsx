import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Provider from "./Provider";
import Header from "./header";
import Footer from "./footer";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Crediflex",
	description: "Undercollateralized Lending Protocol",
	icons: {
		icon: "/logo-cropped.png",
		shortcut: "/logo-cropped.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Provider>
					<div className="flex-col bg-black text-white">
						<Header />
						<Toaster />
						{children}
						<Footer />
					</div>
				</Provider>
			</body>
		</html>
	);
}
