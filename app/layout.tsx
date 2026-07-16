import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "LINKLESS — Communication Without Identities",
  description: "When names disappear, intent remains. Anonymous emergency communication powered by AI.",
  keywords: ["anonymous", "emergency", "communication", "AI", "linkless"],
  openGraph: {
    title: "LINKLESS",
    description: "When names disappear, intent remains.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0C1018",
              color: "#EFF2F9",
              border: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
