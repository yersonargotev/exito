import "@/styles/globals.css";
import { Providers } from "@/components/providers/providers";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
	title: "Exito - E-commerce",
	description: "Exito - E-commerce",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
			<body>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	);
}
