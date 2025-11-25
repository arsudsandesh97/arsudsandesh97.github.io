"use client";

import React, { useState, useEffect } from "react";
import { Nav, NavItems, NavLink } from "./MobileNavStyle";
import { PersonRounded, CodeRounded, WorkRounded, AppsRounded, SchoolRounded, ArticleRounded, EmailRounded } from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileBottomNav = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    if (pathname === "/") {
      setActiveSection("about");
    } else {
      const section = pathname.substring(1); // remove leading slash
      if (["about", "skills", "experience", "projects", "education", "contact"].includes(section)) {
        setActiveSection(section);
      }
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "skills", "experience", "projects", "education", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle navigation click
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setActiveSection(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `/${targetId}`);
    }
  };

  return (
    <Nav>
      <NavItems>
        <NavLink href="/about" className={activeSection === "about" ? "active" : ""} onClick={(e) => handleNavClick(e, "about")}>
          <PersonRounded />
        </NavLink>
        <NavLink href="/skills" className={activeSection === "skills" ? "active" : ""} onClick={(e) => handleNavClick(e, "skills")}>
          <CodeRounded />
        </NavLink>
        <NavLink href="/experience" className={activeSection === "experience" ? "active" : ""} onClick={(e) => handleNavClick(e, "experience")}>
          <WorkRounded />
        </NavLink>
        <NavLink href="/projects" className={activeSection === "projects" ? "active" : ""} onClick={(e) => handleNavClick(e, "projects")}>
          <AppsRounded />
        </NavLink>
        <NavLink href="/education" className={activeSection === "education" ? "active" : ""} onClick={(e) => handleNavClick(e, "education")}>
          <SchoolRounded />
        </NavLink>
        <NavLink href="/contact" className={activeSection === "contact" ? "active" : ""} onClick={(e) => handleNavClick(e, "contact")}>
          <EmailRounded />
        </NavLink>
        <NavLink as={Link} href="/blog" className={activeSection === "blog" ? "active" : ""} onClick={() => setActiveSection("blog")}>
          <ArticleRounded />
        </NavLink>
      </NavItems>
    </Nav>
  );
};

export default MobileBottomNav;
