import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "週末小隊｜家庭週末去哪裡",
  description: "從新埔捷運站出發，替小家庭選出一個剛剛好的週末去處。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}
