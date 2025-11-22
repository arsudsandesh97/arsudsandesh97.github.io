import StyledComponentsRegistry from "./registry";
import ThemeProviderWrapper from "@/components/ThemeProvider";
import "./globals.css";

export const metadata = {
  title: "Sandesh Arsud",
  description: "Welcome to my portfolio - Explore my projects, skills, and experiences in Data Analytics",
  keywords: "sandesh arsud, Sandesh Arsud, Sandesh Arsud Portfolio, sandesh arsud portfolio, portfolio, data analytics",
  authors: [{ name: "Sandesh Arsud" }],
  openGraph: {
    title: "Sandesh Arsud",
    description: "Explore my portfolio projects, skills, and experiences in Data Analytics",
    url: "https://arsudsandesh97.github.io",
    siteName: "Sandesh Arsud Portfolio",
    images: [
      {
        url: "https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg",
        width: 1200,
        height: 630,
        alt: "Sandesh Arsud",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandesh Arsud",
    description: "Explore my portfolio projects, skills, and experiences in Data Analytics",
    images: ["https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="B6nmRq9pR4Ds1JxT4l5CuZDT5dKzq8rtjdwUB8XcFMg" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ThemeProviderWrapper>
            {children}
          </ThemeProviderWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

