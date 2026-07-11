import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "週末小隊｜家庭週末去哪裡",
  description: "替住在新北板橋的小家庭，選出一個剛剛好的週末去處。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
