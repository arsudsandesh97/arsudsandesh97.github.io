"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchSkillsWithCategoriesClient } from "@/lib/api/supabase-client";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

export const Title = styled.h2`
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

export const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SkillsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  gap: 30px;
  justify-content: center;
`;

const Skill = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: ${({ theme }) => theme.card_light + "50"};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.primary + "15"};
  box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 24px 36px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.primary + "40"};
    box-shadow: 0 12px 32px -8px ${({ theme }) => theme.primary + "30"};
    background: ${({ theme }) => theme.card_light + "80"};
  }

  @media (max-width: 768px) {
    max-width: 400px;
    padding: 20px 30px;
  }
  @media (max-width: 500px) {
    max-width: 330px;
    padding: 18px 24px;
  }
`;

const SkillTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 24px;
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const SkillList = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const SkillItem = styled(motion.div)`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.primary + "30"};
  border-radius: 50px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: default;
  background: transparent;
  font-family: 'Space Mono', monospace;

  &:hover {
    background: ${({ theme }) => theme.primary + "15"};
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 6px 14px;
  }
  @media (max-width: 500px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const SkillImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const Skills = ({ initialData }) => {
  const [skillsData, setSkillsData] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setSkillsData(initialData);
      setLoading(false);
      return;
    }

    const fetchSkills = async () => {
      try {
        setLoading(true);
        const { data, error } = await fetchSkillsWithCategoriesClient();
        if (error) throw error;
        setSkillsData(data);
      } catch (error) {
        console.error("Error fetching skills:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [initialData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const skillVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading)
    return (
      <Container id="skills">
        <Wrapper>
          <Title>Skills</Title>
          <SkillsContainer>
            {[1, 2, 3, 4].map((i) => (
              <Skill key={i}>
                <SkillTitle>
                  <div style={{ 
                    height: "24px", 
                    width: "60%", 
                    margin: "0 auto",
                    background: "linear-gradient(90deg, rgba(133, 76, 230, 0.2) 0%, rgba(133, 76, 230, 0.4) 50%, rgba(133, 76, 230, 0.2) 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite linear",
                    borderRadius: "4px"
                  }} />
                </SkillTitle>
                <SkillList>
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} style={{
                      height: "36px",
                      width: "80px",
                      background: "linear-gradient(90deg, rgba(133, 76, 230, 0.1) 0%, rgba(133, 76, 230, 0.2) 50%, rgba(133, 76, 230, 0.1) 100%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite linear",
                      borderRadius: "50px"
                    }} />
                  ))}
                </SkillList>
              </Skill>
            ))}
          </SkillsContainer>
        </Wrapper>
      </Container>
    );

  if (error)
    return (
      <Container id="skills">
        <Wrapper>
          <Title>Skills</Title>
          <Desc>Unable to load skills. Please try again later.</Desc>
        </Wrapper>
      </Container>
    );

  return (
    <Container id="skills">
      <Wrapper>
        <Title>Skills</Title>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <SkillsContainer>
            {skillsData.map((category) => (
              <Skill
                key={category.id}
                variants={skillVariants}
                whileHover={{ scale: 1.02 }}
              >
                <SkillTitle>{category.title}</SkillTitle>
                <SkillList>
                  {category.skills.map((item) => (
                    <SkillItem
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.image && (
                        <SkillImage src={item.image} alt={item.name} />
                      )}
                      {item.name}
                    </SkillItem>
                  ))}
                </SkillList>
              </Skill>
            ))}
          </SkillsContainer>
        </motion.div>
      </Wrapper>
    </Container>
  );
};

export default Skills;

