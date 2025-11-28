import StyledComponentsRegistry from "./registry";
import ThemeProviderWrapper from "@/components/ThemeProvider";
import { Poppins, Space_Mono } from "next/font/google";
import "./globals.css";


// Optimize font loading with Next.js
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-space-mono',
});

export const metadata = {
  metadataBase: new URL('https://arsudsandesh97.github.io'),
  title: {
    default: "Sandesh Arsud - Data Analytics Portfolio",
    template: "%s | Sandesh Arsud"
  },
  description: "Welcome to my portfolio - Explore my projects, skills, and experiences in Data Analytics, Business Intelligence, and Data Science. Specializing in Python, SQL, Power BI, and Machine Learning.",
  keywords: [
    "sandesh arsud",
    "Sandesh Arsud",
    "Sandesh Arsud Portfolio",
    "sandesh arsud portfolio",
    "portfolio",
    "data analytics",
    "data analyst",
    "business intelligence",
    "data science",
    "python developer",
    "sql expert",
    "power bi",
    "data visualization",
    "machine learning"
  ],
  authors: [{ name: "Sandesh Arsud", url: "https://arsudsandesh97.github.io" }],
  creator: "Sandesh Arsud",
  publisher: "Sandesh Arsud",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Sandesh Arsud - Data Analytics Portfolio",
    description: "Explore my portfolio projects, skills, and experiences in Data Analytics, Business Intelligence, and Data Science",
    url: "https://arsudsandesh97.github.io",
    siteName: "Sandesh Arsud Portfolio",
    images: [
      {
        url: "https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg",
        width: 1200,
        height: 630,
        alt: "Sandesh Arsud - Data Analytics Professional",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandesh Arsud - Data Analytics Portfolio",
    description: "Explore my portfolio projects, skills, and experiences in Data Analytics, Business Intelligence, and Data Science",
    images: ["https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg"],
    creator: "@arsudsandesh97",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  // Icons are automatically handled by the file in /app/favicon.ico
  verification: {
    google: "B6nmRq9pR4Ds1JxT4l5CuZDT5dKzq8rtjdwUB8XcFMg",
  },
  alternates: {
    canonical: "https://arsudsandesh97.github.io",
  },
  category: "portfolio",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {


  return (
    <html lang="en" className={`${poppins.variable} ${spaceMono.variable}`}>
      <head>
        {/* Favicon links for better browser compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://ogcljpmtozblkwdvycro.supabase.co" />
        <link rel="dns-prefetch" href="https://ogcljpmtozblkwdvycro.supabase.co" />
        
        {/* Preload critical resources for faster initial render */}
        <link rel="preload" as="script" href="/_next/static/chunks/main-app.js" />
        <link rel="modulepreload" href="/_next/static/chunks/webpack.js" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "name": "Sandesh Arsud",
                  "givenName": "Sandesh",
                  "familyName": "Arsud",
                  "url": "https://arsudsandesh97.github.io",
                  "image": "https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg",
                  "jobTitle": "Data Analyst",
                  "description": "Data Analytics Professional specializing in Business Intelligence, Data Science, Python, SQL, and Power BI",
                  "knowsAbout": ["Data Analytics", "Business Intelligence", "Data Science", "Python", "SQL", "Power BI", "Machine Learning", "Data Visualization"],
                  "alumniOf": [
                    {
                      "@type": "CollegeOrUniversity",
                      "name": "International Center of Excellence in Engineering and Management"
                    },
                    {
                      "@type": "EducationalOrganization",
                      "name": "Nath Polytechnic"
                    }
                  ],
                  "sameAs": [
                    "https://github.com/arsudsandesh97",
                    "https://www.linkedin.com/in/sandesharsud"
                  ]
                },
                {
                  "@type": "WebSite",
                  "name": "Sandesh Arsud Portfolio",
                  "url": "https://arsudsandesh97.github.io",
                  "author": {
                    "@type": "Person",
                    "name": "Sandesh Arsud"
                  }
                }
              ]
            })
          }}
        />
        
        {/* Google Site Verification */}
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

