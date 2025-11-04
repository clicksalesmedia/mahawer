import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "../components/WhatsAppButton";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["400", "600", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: "محاور التوريد التجارية | مواد بناء بضغطة زر",
  description: "تسعير سريع، عروض تنافسية، وتوصيل في نفس اليوم على مجموعة واسعة من مواد البناء.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning={true}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Google Ads (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17438158871"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17438158871');
            `,
          }}
        />
        
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Q5SG382TR5"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q5SG382TR5');
            `,
          }}
        />
      </head>
      <body
        className={`${cairo.variable} ${inter.variable} antialiased`}
        style={{
          fontFamily: '"Cairo", system-ui, -apple-system, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
          fontFeatureSettings: '"kern"'
        }}
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
