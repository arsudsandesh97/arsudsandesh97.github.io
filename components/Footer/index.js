"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { fetchBioDataClient } from "@/lib/api/supabase-client";
import { supabase } from "@/lib/supabase/client";

const FooterContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const FooterWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  padding: 1rem;
  color: ${({ theme }) => theme.text_primary};
`;

const Logo = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.primary};
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 800px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    text-align: center;
    font-size: 12px;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SocialMediaIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const SocialMediaIcon = styled.a`
  display: inline-block;
  margin: 0 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Copyright = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
`;

const Footer = () => {
  const [footerData, setFooterData] = useState({});
  const [copyrightData, setCopyrightData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFooterData = async () => {
      try {
        setLoading(true);
        // Fetch both bio and copyright data in parallel
        const [bioResponse, copyrightResponse] = await Promise.all([
          fetchBioDataClient(),
          supabase.from("copyright").select("copyright").single(),
        ]);

        if (!bioResponse.error && bioResponse.data) {
          setFooterData(bioResponse.data);
        }

        if (!copyrightResponse.error && copyrightResponse.data) {
          setCopyrightData(copyrightResponse.data);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    getFooterData();
  }, []);

  return (
    <FooterContainer>
      <FooterWrapper>
        <Logo>{footerData?.name || "Loading..."}</Logo>
        <Nav>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#skills">Skills</NavLink>
          <NavLink href="#experience">Experience</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#education">Education</NavLink>
        </Nav>
        <SocialMediaIcons>
          {footerData?.twitter && (
            <SocialMediaIcon href={footerData.twitter} target="_blank" rel="noopener noreferrer">
              <TwitterIcon />
            </SocialMediaIcon>
          )}
          {footerData?.linkedin && (
            <SocialMediaIcon href={footerData.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon />
            </SocialMediaIcon>
          )}
          {footerData?.insta && (
            <SocialMediaIcon href={footerData.insta} target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </SocialMediaIcon>
          )}
        </SocialMediaIcons>
        <Copyright>
          {loading
            ? "Loading..."
            : copyrightData?.copyright ||
              footerData?.copyright ||
              "© 2024. All rights reserved."}
        </Copyright>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;

