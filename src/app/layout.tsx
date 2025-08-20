import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://todayab.netlify.app/'), // Add this line
  title: '오늘의집회 - 실시간 집회 정보',
  description: '서울시 실시간 집회 및 시위 정보를 한눈에 확인하세요. 지도와 테이블로 제공되는 최신 집회 정보를 통해 오늘의 집회 일정을 파악할 수 있습니다.',
  keywords: ['오늘의집회', '집회정보', '시위정보', '서울시 집회', '실시간 집회', '집회 일정', '광화문 집회', '여의도 집회'],
  openGraph: {
    title: '오늘의집회 - 실시간 집회 정보',
    description: '서울시 실시간 집회 및 시위 정보를 한눈에 확인하세요. 지도와 테이블로 제공되는 최신 집회 정보를 통해 오늘의 집회 일정을 파악할 수 있습니다.',
    url: 'https://todayab.netlify.app/', // Replace with actual domain
    siteName: '오늘의집회',
    images: [
      {
        url: '/ic_public.png', // Changed from 'https://www.todaysassembly.com/og-image.jpg'
        width: 1200,
        height: 630,
        alt: '오늘의집회',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '오늘의집회 - 실시간 집회 정보',
    description: '서울시 실시간 집회 및 시위 정보를 한눈에 확인하세요. 지도와 테이블로 제공되는 최신 집회 정보를 통해 오늘의 집회 일정을 파악할 수 있습니다.',
    creator: '@yourtwitterhandle', // Replace with actual Twitter handle
    images: ['/ic_public.png'], // Changed from 'https://www.todaysassembly.com/twitter-image.jpg'
  },
  icons: {
    icon: 'ic_public.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-site-verification" content="KUb9P5ywgJIii8tbC0CJyrDfXZIpLj_setashmMWO_E" />
        <meta name="naver-site-verification" content="5a08aba36d68e4bcee1ed9432248f5bbe4a19841" />
        <Script
          strategy="beforeInteractive"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        />
      </head>
      <body className={inter.className}>
        {children}
        <footer className="footer">
          <p>&apos;서울특별시경찰청&apos;에서 제공하는 집회 정보입니다.</p>
        </footer>
      </body>
    </html>
  );
}
