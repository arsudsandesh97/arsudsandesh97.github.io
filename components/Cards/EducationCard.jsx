"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import { SchoolOutlined, EmojiEventsOutlined } from "@mui/icons-material";

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

const School = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 2px 0;
  line-height: 1.3;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Degree = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 14px;
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

const GradeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.primary + '30'};
  border-radius: 50px;
  margin: 12px 0;
  width: fit-content;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary + '10'};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const GradeLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GradeValue = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  font-family: 'Space Mono', monospace;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Description = styled.div`
  font-size: 15px;
  font-weight: 400;
  line-height: 1.7;
  color: ${({ theme }) => theme.text_primary}DD;
  margin-top: 12px;
  word-break: break-word;

  /* Ensure lists are visible and properly formatted */
  ul, ol {
    margin: 12px 0 !important;
    padding-left: 20px !important;
    list-style-position: outside !important;
    display: block !important;
  }

  ul {
    list-style-type: disc !important;
  }

  ol {
    list-style-type: decimal !important;
  }

  li {
    margin-bottom: 16px !important;
    padding-left: 0 !important;
    display: list-item !important;
    line-height: 1.8;
    color: ${({ theme }) => theme.text_primary + 'E6'};
    
    &:last-child {
      margin-bottom: 0 !important;
    }
  }

  /* Style paragraphs */
  p {
    margin: 0 0 12px 0;
    line-height: 1.7;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Ensure nested content inherits color */
  * {
    color: inherit;
  }

  /* Reset any conflicting styles */
  div {
    ul, ol {
      margin: 12px 0 !important;
      padding-left: 20px !important;
    }
  }

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.6;
    
    ul, ol {
      padding-left: 20px !important;
    }
  }
`;

const EducationCard = ({ education }) => {
  const [imgError, setImgError] = useState(false);

  // Parse description to handle bullet points and HTML
  const parseDescription = (text) => {
    if (!text) return null;
    
    // Check if text contains HTML tags
    const hasHTML = /<[^>]+>/.test(text);
    
    if (hasHTML) {
      return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }
    
    let lines = [];
    
    // Strategy 1: Split by explicit newlines (standard or escaped)
    if (text.match(/\\n|\r?\n/)) {
      lines = text.split(/\\n|\r?\n/).map(line => line.trim()).filter(line => line);
    }
    
    // Strategy 2: If no newlines found or only one line resulted, try splitting by bullet characters
    if (lines.length <= 1) {
      // Check for common bullet markers
      if (text.includes('•')) {
        lines = text.split('•').map(line => line.trim()).filter(line => line);
      } else if (text.includes('- ')) {
        lines = text.split('- ').map(line => line.trim()).filter(line => line);
      } else if (lines.length === 0) {
        // Fallback to original text if no split occurred
        lines = [text.trim()];
      }
    }

    if (lines.length > 0) {
      return (
        <ul>
          {lines.map((line, index) => {
            // Clean up any remaining leading markers just in case
            const cleanLine = line.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');
            if (!cleanLine) return null;
            return <li key={index}>{cleanLine}</li>;
          })}
        </ul>
      );
    }
    
    return null;
  };

  return (
    <VerticalTimelineElement
      icon={
        education?.img ? (
          <img 
            src={education.img} 
            alt={education.school} 
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} 
          />
        ) : (
          <SchoolOutlined />
        )
      }
      contentStyle={{
        background: "transparent",
        boxShadow: "none",
        border: "none",
        padding: 0,
      }}
      contentArrowStyle={{ display: "none" }}
      date={education?.date}
      iconStyle={{
        background: "linear-gradient(135deg, #854CE6, #C770F0)",
        color: "#fff",
        boxShadow: "0 0 0 4px rgba(133, 76, 230, 0.2)",
      }}
    >
      <Card>
        <Top>
          {education?.img && !imgError ? (
            <Logo
              src={education.img}
              alt={education?.school}
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
              {education?.school?.charAt(0) || "?"}
            </Logo>
          )}
          <Body>
            <School>{education?.school}</School>
            <Degree>{education?.degree}</Degree>
            <DateRange>
              {education?.date}
            </DateRange>
          </Body>
        </Top>

        {education?.grade && (
          <GradeContainer>
            <EmojiEventsOutlined fontSize="small" style={{ color: "#854CE6" }} />
            <GradeLabel>Grade:</GradeLabel>
            <GradeValue>{education.grade}</GradeValue>
          </GradeContainer>
        )}

        {(education?.desc || education?.description) && (
          <Description>
            {parseDescription(education.desc || education.description)}
          </Description>
        )}
      </Card>
    </VerticalTimelineElement>
  );
};

export default EducationCard;
