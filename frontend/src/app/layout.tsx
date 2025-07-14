import type { Metadata } from "next";
import "./globals.scss";
import { Montserrat } from "next/font/google";
import PageWraper from "@/components/PageWraper";
import { Toaster } from "@/components/ui/toaster";
import { getClient } from "@/lib/apollo/client";
import { GoogleTagManager } from "@next/third-parties/google";
import dynamic from "next/dynamic";
// import SplashClient from "@/components/loader/SplashClient";

const SplashClient = dynamic(()=> import("@/components/loader/SplashClient"), {ssr: false})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font_montserrat",
});

export const metadata: Metadata = {
  title: "Dubai Garden Centre",
  description:
    "Buy Plants Online with Dubai Garden Centre, Best Online Plants Supplier in Dubai, Abu Dhabi UAE with wide range of fresh Outdoor and Indoor Plants. Buy all types of indoor & outdoor plants online. We also have a physical Store Situated on Sheikh Zayed roa",
};

const GTM_ID = process.env.GTM_ID;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const client = getClient();

  return (
    <html lang="en">
      {/* <GtmCodeRenderer code={mpGTMHead.head as string} />
      <GtmCodeRenderer code={fbPixelHead.data.mpGTMHead.head as string} /> */}
      <body className={`${montserrat.variable} ${montserrat.className}`}>
        <SplashClient />
        <GoogleTagManager gtmId={GTM_ID || ""} />
        <PageWraper>{children}</PageWraper>
        <Toaster />
      </body>
    </html>
  );
}
