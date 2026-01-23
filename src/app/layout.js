import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "(사)이탈리아 음악협회",
  description: "이탈리아 음악을 연구하고, 공유하고, 즐기기 위해 노력하는 단체입니다. 회원들의 활동을 기록하고, 공유하고, 즐기기 위해 노력하는 단체입니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="이탈리아 음악을 연구하고, 공유하고, 즐기기 위해 노력하는 단체입니다. 회원들의 활동을 기록하고, 공유하고, 즐기기 위해 노력하는 단체입니다." />
        <meta name="keywords" content="이탈리아 음악, 음악협회, 회원, 활동, 공유, 즐기기" />
        <meta name="author" content="(사)이탈리아 음악협회" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="yandexbot" content="index, follow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
