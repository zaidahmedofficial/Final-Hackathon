import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/custom/navbar";
import { Sidebar } from "@/components/custom/sidebar";
import { Footer } from "@/components/custom/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Shehri Portal - Karachi Citizen Complaint Portal",
  description: "Report civic issues in Karachi in 60 seconds. A citizen-centric platform for submitting and tracking civic complaints.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-background">
        <ThemeProvider>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
