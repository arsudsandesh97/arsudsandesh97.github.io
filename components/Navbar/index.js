"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Nav,
  NavLink,
  NavbarContainer,
  NavLogo,
  NavItems,
  GitHubButton,
  ButtonContainer,
  MobileIcon,
  MobileMenu,
  MobileLink,
} from "./NavbarStyledComponent";
import { FaBars } from "react-icons/fa";
import { Close, CloseRounded } from "@mui/icons-material";
import { useTheme } from "styled-components";
import { fetchBioDataClient } from "@/lib/api/supabase-client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const getBioData = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchBioDataClient();
        if (!error && data) {
          setBioData(data);
        }
      } catch (error) {
        console.error("Error fetching bio data:", error);
      } finally {
        setLoading(false);
      }
    };
    getBioData();
  }, []);

  // Handle navigation click
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `/${targetId}`);
    }
  };

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo as={Link} href="/" onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.history.pushState(null, "", "/");
        }}>
          <h3 style={{ color: `white` }}>
            {loading ? "Loading..." : bioData?.name || "Portfolio"}
          </h3>
        </NavLogo>
        <MobileIcon>
          <FaBars onClick={() => setIsOpen(!isOpen)} />
        </MobileIcon>
        <NavItems>
          <NavLink as={Link} href="/about" onClick={(e) => handleNavClick(e, "about")}>About</NavLink>
          <NavLink as={Link} href="/skills" onClick={(e) => handleNavClick(e, "skills")}>Skills</NavLink>
          <NavLink as={Link} href="/experience" onClick={(e) => handleNavClick(e, "experience")}>Experience</NavLink>
          <NavLink as={Link} href="/projects" onClick={(e) => handleNavClick(e, "projects")}>Projects</NavLink>
          <NavLink as={Link} href="/education" onClick={(e) => handleNavClick(e, "education")}>Education</NavLink>
        </NavItems>
        <ButtonContainer>
          <GitHubButton
            href={bioData?.github}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!bioData?.github}
          >
            Github Profile
          </GitHubButton>
        </ButtonContainer>
        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <MobileLink as={Link} href="/about" onClick={(e) => { handleNavClick(e, "about"); setIsOpen(false); }}>
              About
            </MobileLink>
            <MobileLink as={Link} href="/skills" onClick={(e) => { handleNavClick(e, "skills"); setIsOpen(false); }}>
              Skills
            </MobileLink>
            <MobileLink as={Link} href="/experience" onClick={(e) => { handleNavClick(e, "experience"); setIsOpen(false); }}>
              Experience
            </MobileLink>
            <MobileLink as={Link} href="/projects" onClick={(e) => { handleNavClick(e, "projects"); setIsOpen(false); }}>
              Projects
            </MobileLink>
            <MobileLink as={Link} href="/education" onClick={(e) => { handleNavClick(e, "education"); setIsOpen(false); }}>
              Education
            </MobileLink>
            <GitHubButton
              style={{
                padding: "10px 16px",
                background: `${theme.primary}`,
                color: "white",
                width: "max-content",
              }}
              href={bioData?.github}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!bioData?.github}
            >
              Github Profile
            </GitHubButton>
          </MobileMenu>
        )}
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;

