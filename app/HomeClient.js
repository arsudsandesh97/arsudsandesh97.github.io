"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Experience from "@/components/Experience";
import { AnimatePresence } from "framer-motion";
import MobileBottomNav from "@/components/MobileBottomNav";

// Lazy load heavy components for better performance
const ProjectDetails = lazy(() => import("@/components/ProjectDetails"));
const Contact = lazy(() => import("@/components/Contact"));
const Education = lazy(() => import("@/components/Education"));

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
  --font-mono: 'Space Mono', monospace;
  
  /* Data Grid Background */
  background-image: linear-gradient(rgba(133, 76, 230, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(133, 76, 230, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%,
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

export default function HomeClient({ bioData }) {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  const pathname = usePathname();

  // Register service worker for PWA support
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Registered successfully');
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });
    }
  }, []);

  useEffect(() => {
    // Handle scroll based on pathname
    const scrollToSection = () => {
      // Remove leading and trailing slashes
      const section = pathname.replace(/^\/|\/$/g, '');
      
      // Valid sections to scroll to
      const validSections = ["about", "skills", "experience", "projects", "education", "contact"];
      
      if (section && validSections.includes(section)) {
        // Wait for content to load before scrolling
        const timeoutId = setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300); // Increased timeout to ensure content is loaded
        
        return () => clearTimeout(timeoutId);
      } else if (!section || section === '') {
        // If on home route, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    scrollToSection();
  }, [pathname]); // Re-run when pathname changes

  return (
    <Body>
      <Navbar />
      <MobileBottomNav />
      <AnimatePresence>
        <div>
          <HeroSection bioData={bioData} />
          <Wrapper>
            <Skills />
            <Experience />
          </Wrapper>
          <Projects openModal={openModal} setOpenModal={setOpenModal} />
          <Wrapper>
            <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
              <Education />
            </Suspense>
            <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
              <Contact />
            </Suspense>
          </Wrapper>
          <Footer />

          {openModal.state && (
            <Suspense fallback={null}>
              <ProjectDetails
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            </Suspense>
          )}
        </div>
      </AnimatePresence>
    </Body>
  );
}
