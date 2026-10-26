import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/lib/smooth_scroll";
import TopBar from "@/components/top_bar";
import Header from "@/components/header/header";
import DesktopHeader from "@/components/header/desktop.header";
import MobileNavLinks from "@/components/header/mobile_nav_links";
import Footer from "@/components/footer";
import Providers from "@/lib/providers";
import { AuthProvider } from "@/context/auth_context";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import CartDrawer from "@/components/cart_drawer";

const montserrat = Montserrat({
  variable: "--font-montserrate",
  subsets: ["latin"],
  display: "swap",
});

const open_sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Novasac",
  description: "Novasac",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${open_sans.variable} antialiased`}
      >
        <TopBar />
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
          <Providers>
            <AuthProvider>
              <Header />
              <DesktopHeader />
              <MobileNavLinks />
              <SmoothScrollProvider>
                {children}
              </SmoothScrollProvider>
            </AuthProvider>
            <Footer />
            <CartDrawer />
          </Providers>
        </GoogleOAuthProvider>
        <Toaster />
        {/* <Script id="crisp" strategy="afterInteractive">
          {`window.$crisp=[];window.CRISP_WEBSITE_ID="bf4c7f16-6457-40f8-af4e-82a2961672f1";(function(){var d = document;var s = d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s)})()`}
        </Script> */}

        <Script type="text/javascript" strategy="afterInteractive">
          {`var Tawk_API=Tawk_API||{ }, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/6a327bb8b319cc1d4d432674/1jraj6is6';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })()`}
        </Script>
      </body>
    </html>
  );
}
