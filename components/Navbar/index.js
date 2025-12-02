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
import { FaBars, FaGithub } from "react-icons/fa";
import { Close, CloseRounded, OpenInNew, Person, Code, Work, Apps, School, Article } from "@mui/icons-material";
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
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `/${targetId}`);
    }
  };

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo as={Link} href="/" onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", "/");
          }
        }}>
          <h3 style={{ color: `white` }}>
            {loading ? "Sandesh Arsud" : bioData?.name || "Sandesh Arsud"}
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
          <NavLink as={Link} href="/blog" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Blog <OpenInNew style={{ fontSize: '16px' }} />
          </NavLink>
        </NavItems>
        <ButtonContainer>
          <GitHubButton
            href={bioData?.github}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!bioData?.github}
          >
            <FaGithub style={{ fontSize: '20px' }} />
            <span style={{ marginLeft: '8px', display: 'inline-block' }} className="github-text">
              Github Profile
            </span>
          </GitHubButton>
        </ButtonContainer>
        {isOpen && (
          <MobileMenu isOpen={isOpen}>
            <MobileLink as={Link} href="/about" onClick={(e) => { handleNavClick(e, "about"); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Person style={{ color: theme.primary, fontSize: '20px' }} /> About
            </MobileLink>
            <MobileLink as={Link} href="/skills" onClick={(e) => { handleNavClick(e, "skills"); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code style={{ color: theme.primary, fontSize: '20px' }} /> Skills
            </MobileLink>
            <MobileLink as={Link} href="/experience" onClick={(e) => { handleNavClick(e, "experience"); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Work style={{ color: theme.primary, fontSize: '20px' }} /> Experience
            </MobileLink>
            <MobileLink as={Link} href="/projects" onClick={(e) => { handleNavClick(e, "projects"); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Apps style={{ color: theme.primary, fontSize: '20px' }} /> Projects
            </MobileLink>
            <MobileLink as={Link} href="/education" onClick={(e) => { handleNavClick(e, "education"); setIsOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <School style={{ color: theme.primary, fontSize: '20px' }} /> Education
            </MobileLink>
            <MobileLink as={Link} href="/blog" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Article style={{ color: theme.primary, fontSize: '20px' }} /> Blog
            </MobileLink>
            <GitHubButton
              style={{
                padding: "10px 16px",
                background: `${theme.primary}`,
                color: "white",
                width: "max-content",
                marginTop: "12px",
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
