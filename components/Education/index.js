"use client";

import { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { fetchEducationClient } from "@/lib/api/supabase-client";
import EducationCard from "../Cards/EducationCard";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 2;
  align-items: center;
  padding: 60px 0px 80px 0px;
  width: 100%;
  
  @media (max-width: 960px) {
    padding: 40px 0px 60px 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 40px 0;
  gap: 12px;
  
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.h2`
  font-size: 52px;
  text-align: center;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 8px;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.text_primary} 0%,
    ${({ theme }) => theme.primary} 50%,
    ${({ theme }) => theme.text_primary} 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  letter-spacing: -1px;

  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.primary}, transparent);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
      margin-top: 16px;
      font-size: 38px;
      letter-spacing: -0.5px;

      &::after {
        bottom: -8px;
        width: 60px;
        height: 3px;
      }
  }
`;

const Desc = styled.p`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 40px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
`;

const TimelineSection = styled.div`
  width: 100%;
  max-width: 1000px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 2;
  
  .vertical-timeline {
    position: relative;
    padding: 2em 0;
    margin: 0 auto;
    width: 100%;
  }

  .vertical-timeline-element-date {
    font-size: 16px !important;
    font-weight: 700 !important;
    color: ${({ theme }) => theme.text_secondary + 'CC'} !important;
    
    @media (max-width: 768px) {
      font-size: 12px !important;
      padding-bottom: 10px !important;
      color: ${({ theme }) => theme.text_secondary + '99'} !important;
    }
  }
`;

const Education = () => {
  const theme = useTheme();
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchEducationClient();
        
        const { data, error } = result;
        
        if (error) {
          console.error("Education component: Error received:", error);
          setError(error);
          setEducationData([]);
        } else {
          const educationData = Array.isArray(data) ? data : [];
          setEducationData(educationData);
          setError(null);
        }
      } catch (err) {
        console.error("Education component: Exception caught:", err);
        setError({
          message: err?.message || "Unexpected error occurred",
          stack: err?.stack
        });
        setEducationData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);



  return (
    <Container id="education">
      <Wrapper>
        <Title>Education</Title>
        <TimelineSection>
        {loading ? (
          <div style={{ 
            color: "#F2F3F4", 
            padding: "40px 20px", 
            textAlign: "center",
            fontSize: "18px",
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            Loading education...
          </div>
        ) : error ? (
          <div style={{ 
            color: "#ef4444", 
            padding: "40px 20px", 
            textAlign: "center",
            fontSize: "16px",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div>Error loading education</div>
            <div style={{ fontSize: "12px", marginTop: "10px", opacity: 0.8 }}>
              {error?.message || (typeof error === 'string' ? error : JSON.stringify(error))}
            </div>
            <div style={{ fontSize: "12px", marginTop: "5px" }}>
              Check browser console for details
            </div>
          </div>
        ) : educationData.length === 0 ? (
          <div style={{ 
            color: "#F2F3F4", 
            padding: "40px 20px", 
            textAlign: "center",
            fontSize: "16px",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div>No education data found.</div>
            <div style={{ fontSize: "12px", marginTop: "10px", opacity: 0.8 }}>
              Check if data exists in Supabase "education" or "Education" table
            </div>
          </div>
        ) : (
          <VerticalTimeline animate={false} lineColor={theme.primary + "50"}>
            {educationData.map((education, index) => {
              console.log("Rendering education:", education);
              return (
                <EducationCard key={education.id || `education-${index}`} education={education} />
              );
            })}
            </VerticalTimeline>
        )}
        </TimelineSection>
      </Wrapper>
    </Container>
  );
};

export default Education;

