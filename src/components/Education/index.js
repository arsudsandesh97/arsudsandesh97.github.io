import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { supabase } from "../../supabaseClient";
import EducationCard from "../Cards/EducationCard";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  padding: 0px 0px 60px 0px;
  @media (max-width: 960px) {
    padding: 0px;
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
  padding: 40px 0px 0px 0px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Education = ({ initialData }) => {
  const [educationData, setEducationData] = useState(initialData || []);

  useEffect(() => {
    if (initialData) {
      setEducationData(initialData);
      return;
    }

    const fetchEducation = async () => {
      // Try loading from local JSON first
      try {
        const response = await fetch('/data/education.json', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const jsonData = await response.json();
          console.log('✓ Loaded education from local JSON');
          setEducationData(jsonData.data || []);
          return;
        }
      } catch (error) {
        console.warn('Local JSON not found, using Supabase');
      }

      // Fallback to Supabase
      let { data, error } = await supabase.from("education").select("*");
      if (error) {
        console.error("Error fetching education data:", error);
      } else {
        setEducationData(data);
      }
    };
    fetchEducation();
  }, [initialData]);

  return (
    <Container id="education">
      <Wrapper>
        <Title>Education</Title>
        <VerticalTimeline>
          {educationData.map((education, index) => (
            <EducationCard key={`education-${index}`} education={education} />
          ))}
        </VerticalTimeline>
      </Wrapper>
    </Container>
  );
};

export default Education;