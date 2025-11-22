"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchSkillsWithCategoriesClient } from "@/lib/api/supabase-client";

const Container = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  @media (max-width: 960px) {
    justify-content: center;
  }
`;

const SkillBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.card_light}80;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.primary}30;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  font-family: 'Space Mono', monospace;
  transition: all 0.3s ease;
  flex-shrink: 0;
  white-space: nowrap;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary}60;
    background: ${({ theme }) => theme.card_light};
    transform: translateY(-2px);
  }
`;

const SkillImage = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
`;

const SkillsShowcase = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await fetchSkillsWithCategoriesClient();
      if (!error && data) {
        // Flatten all skills from all categories
        const allSkills = data.flatMap(category => category.skills || []);
        
        // Define the specific skills we want to show in order
        const desiredSkills = [
          "Microsoft Power BI",
          "SQL",
          "Microsoft Excel",
          "Python"
        ];
        
        // Filter and order skills based on desiredSkills array
        const filteredSkills = desiredSkills
          .map(skillName => allSkills.find(skill => skill.name === skillName))
          .filter(skill => skill !== undefined); // Remove any skills not found
        
        setSkills(filteredSkills);
      }
    };

    fetchSkills();
  }, []);

  if (skills.length === 0) return null;

  return (
    <Container>
      {skills.map((skill, index) => (
        <SkillBadge
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          {skill.image && <SkillImage src={skill.image} alt={skill.name} />}
          {skill.name}
        </SkillBadge>
      ))}
    </Container>
  );
};

export default SkillsShowcase;
