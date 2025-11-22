"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import { WorkOutline, VerifiedOutlined } from "@mui/icons-material";

const Card = styled.div`
  width: 100%;
  border-radius: 16px;
  background: ${({ theme }) => theme.card_light + '50'};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.primary + '15'};
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: ${({ theme }) => theme.primary + '40'};
    box-shadow: 0 12px 32px -8px ${({ theme }) => theme.primary + '30'};
    transform: translateY(-4px);
    background: ${({ theme }) => theme.card_light + '80'};
  }
`;

const Top = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const Logo = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary}20;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Role = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 4px 0;
  line-height: 1.3;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const DateRange = styled.div`
  font-size: 12px;
  font-weight: 500;
  font-family: 'Space Mono', monospace;
  color: ${({ theme }) => theme.text_secondary + '99'};
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.primary + '10'};
  padding: 4px 10px;
  border-radius: 6px;
  width: fit-content;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;


const Company = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const SkillBadge = styled.span`
  padding: 6px 14px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.primary + '40'};
  border-radius: 50px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  font-family: 'Space Mono', monospace;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    background: ${({ theme }) => theme.primary + '15'};
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 4px 10px;
  }
`;

const CertificatesSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.primary}15;
`;

const Description = styled.div`
  font-family: 'Space Mono', monospace;
  color: ${({ theme }) => theme.text_primary};
  ul, ol {
    margin: 12px 0;
    padding-left: 20px;
    list-style-position: outside;
  }
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }
  li { 
    margin-bottom: 16px; 
    display: list-item;
    line-height: 1.8;
    color: ${({ theme }) => theme.text_primary + 'E6'}; // Slightly transparent for better reading
  }
  p { margin: 0 0 12px 0; }
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CertificateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CertificateCard = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: ${({ theme }) => theme.card + '60'};
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.card};
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const CertThumb = styled.div`
  position: relative;
  width: 80px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.card_light};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 49px;
  }
`;

const CertInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const CertTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const CertIssuer = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

const ExperienceCard = ({ experience }) => {
  const [imgError, setImgError] = useState(false);

  // Collect and parse descriptions from multiple fields
  const renderDescription = () => {
    if (!experience) return null;

    const allBullets = [];

    // Helper to process a text string into bullets
    const processText = (text) => {
      if (!text) return;
      // Split by newlines (standard, escaped, or carriage return)
      let lines = text.split(/\\n|\r?\n/).map(l => l.trim()).filter(l => l);
      
      // If single line, try splitting by bullet markers
      if (lines.length === 1 && (text.includes('•') || text.includes('- '))) {
        lines = text.split(/(?:\\n|\r?\n)|(?:(?<=\s|^)[•-]\s+)/).map(l => l.trim()).filter(l => l);
      }

      lines.forEach(line => {
        // Clean bullet markers
        const cleanLine = line.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');
        if (cleanLine) allBullets.push(cleanLine);
      });
    };

    // 1. Check primary fields
    if (experience.desc) processText(experience.desc);
    if (experience.description && experience.description !== experience.desc) processText(experience.description);

    // 2. Check for numbered fields (desc1, desc2... or description1, description2...)
    // We'll check a reasonable range, e.g., 1 to 10
    for (let i = 1; i <= 10; i++) {
      const descKey = `desc${i}`;
      const descriptionKey = `description${i}`;
      
      if (experience[descKey]) processText(experience[descKey]);
      if (experience[descriptionKey]) processText(experience[descriptionKey]);
    }

    if (allBullets.length > 0) {
      return (
        <Description>
          <ul>
            {allBullets.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Description>
      );
    }

    return null;
  };

  return (
    <VerticalTimelineElement
      icon={
        experience?.img ? (
          <img 
            src={experience.img} 
            alt={experience.company} 
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
          />
        ) : (
          <WorkOutline />
        )
      }
      contentStyle={{
        background: "transparent",
        boxShadow: "none",
        border: "none",
        padding: 0,
      }}
      contentArrowStyle={{ display: "none" }}
      date={experience?.date}
      iconStyle={{
        background: "linear-gradient(135deg, #854CE6, #C770F0)",
        color: "#fff",
        boxShadow: "0 0 0 4px rgba(133, 76, 230, 0.2)",
      }}
    >
      <Card>
        <Top>
          {experience?.img && !imgError ? (
            <Logo
              src={experience.img}
              alt={experience?.company}
              onError={() => setImgError(true)}
            />
          ) : (
            <Logo
              as="div"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "600",
                color: "#854CE6",
              }}
            >
              {experience?.company?.charAt(0) || "?"}
            </Logo>
          )}
          <Body>
            <Role>{experience?.role}</Role>
            <Company>{experience?.company}</Company>
            <DateRange>
              {experience?.date}
            </DateRange>
          </Body>
        </Top>

        {renderDescription()}

        {experience?.skills && experience.skills.length > 0 && (
          <SkillsContainer>
            {experience.skills.map((skill, index) => (
              <SkillBadge key={index}>{skill}</SkillBadge>
            ))}
          </SkillsContainer>
        )}

        {(experience?.certificates || experience?.doc || experience?.document) && 
         (experience?.certificates?.length > 0 || experience?.doc || experience?.document) && (
          <CertificatesSection>
            <SectionTitle>
              <VerifiedOutlined fontSize="small" />
              Certification
            </SectionTitle>
            <CertificateGrid>
              {/* Handle array of certificates */}
              {experience.certificates && experience.certificates.map((cert, index) => (
                <CertificateCard
                  key={index}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CertThumb>
                    <img src={cert.thumbnail} alt={cert.title} />
                  </CertThumb>
                  <CertInfo>
                    <CertTitle>{cert.title}</CertTitle>
                    <CertIssuer>{cert.issuer}</CertIssuer>
                  </CertInfo>
                </CertificateCard>
              ))}
              
              {/* Handle single doc field */}
              {(experience.doc || experience.document) && !experience.certificates && (
                <CertificateCard
                  href={experience.doc || experience.document}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CertInfo>
                    <CertTitle>View Certificate</CertTitle>
                    <CertIssuer>Click to open document</CertIssuer>
                  </CertInfo>
                </CertificateCard>
              )}
            </CertificateGrid>
          </CertificatesSection>
        )}
      </Card>
    </VerticalTimelineElement>
  );
};

export default ExperienceCard;
