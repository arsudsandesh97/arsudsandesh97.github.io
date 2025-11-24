"use client";

import { CloseRounded, GitHub, LinkedIn, Launch, Visibility } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  transition: all 0.5s ease;
  padding: 40px 20px;
  z-index: 1300;
`;

const Wrapper = styled.div`
  max-width: 900px;
  width: 100%;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.primary + "20"};
  margin-bottom: 40px;
`;

const HeroImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const Content = styled.div`
  padding: 0 40px 40px 40px;
  margin-top: -60px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 24px 30px 24px;
    margin-top: -40px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleGroup = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Date = styled.div`
  font-size: 14px;
  font-family: 'Space Mono', monospace;
  color: ${({ theme }) => theme.primary};
  margin-top: 8px;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  ${({ $primary, theme }) => $primary ? `
    background: ${theme.primary};
    color: white;
    box-shadow: 0 4px 15px ${theme.primary}40;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${theme.primary}60;
    }
  ` : `
    background: ${theme.card_light};
    color: ${theme.text_primary};
    border: 1px solid ${theme.text_secondary}40;
    &:hover {
      background: ${theme.text_secondary}20;
      border-color: ${theme.text_primary};
    }
  `}
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: 'Space Mono', monospace;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::after {
    content: '';
    height: 1px;
    flex: 1;
    background: ${({ theme }) => theme.text_secondary + "30"};
  }
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => theme.text_primary + "E6"};
  white-space: pre-line;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + "15"};
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary + "30"};
  font-family: 'Space Mono', monospace;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const MemberCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ theme }) => theme.card_light + "50"};
  padding: 10px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary + "20"};
`;

const MemberImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary};
`;

const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 2px;
  
  a {
    color: ${({ theme }) => theme.text_secondary};
    font-size: 14px;
    &:hover { color: ${({ theme }) => theme.primary}; }
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: rotate(90deg);
  }
`;

const ProjectDetails = ({ openModal, setOpenModal }) => {
  const project = openModal?.project;
  const placeholderImage = "https://via.placeholder.com/800x400";

  if (!project) return null;

  return (
    <Modal
      open={true}
      onClose={() => setOpenModal({ state: false, project: null })}
    >
      <Container onClick={(e) => e.target === e.currentTarget && setOpenModal({ state: false, project: null })}>
        <Wrapper>
          <CloseButton onClick={() => setOpenModal({ state: false, project: null })}>
            <CloseRounded />
          </CloseButton>
          
          <HeroImage 
            src={project?.image || placeholderImage} 
            alt={project?.title}
            onError={(e) => e.target.src = placeholderImage}
          />
          
          <Content>
            <Header>
              <TitleGroup>
                <Title>{project?.title}</Title>
                <Date>{project?.date}</Date>
              </TitleGroup>
              
              <ButtonGroup>
                {project?.github && (
                  <ActionButton href={project?.github} target="_blank" rel="noopener noreferrer">
                    <GitHub fontSize="small" /> Code
                  </ActionButton>
                )}
                {project?.webapp && (
                  <ActionButton $primary href={project?.webapp} target="_blank" rel="noopener noreferrer">
                    <Launch fontSize="small" /> Live Demo
                  </ActionButton>
                )}
                {project?.dashboard && (
                  <ActionButton $primary href={project?.dashboard} target="_blank" rel="noopener noreferrer">
                    <Launch fontSize="small" /> View Dashboard
                  </ActionButton>
                )}
                <ActionButton $primary href={`/project-explanation/${project?.id}`}>
                  <Visibility fontSize="small" /> View Project
                </ActionButton>
              </ButtonGroup>
            </Header>

            <Section>
              <SectionTitle>Technologies</SectionTitle>
              <Tags>
                {project?.tags?.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Tags>
            </Section>

            {project?.associations?.length > 0 && (
              <Section>
                <SectionTitle>Associated with</SectionTitle>
                <TeamGrid>
                  {project.associations.map((assoc) => (
                    <MemberCard key={assoc.id}>
                      <MemberImage src={assoc.img} alt={assoc.name} />
                      <MemberInfo>
                        <MemberName>{assoc.name}</MemberName>
                        <span style={{ fontSize: '12px', color: '#b1b2b3' }}>Association</span>
                      </MemberInfo>
                    </MemberCard>
                  ))}
                </TeamGrid>
              </Section>
            )}

            <Section>
              <SectionTitle>Overview</SectionTitle>
              <Description>
                {project?.description}
                {project?.description2 && <><br /><br />{project.description2}</>}
                {project?.description3 && <><br /><br />{project.description3}</>}
              </Description>
            </Section>

            {project?.members?.length > 0 && (
              <Section>
                <SectionTitle>Team Members</SectionTitle>
                <TeamGrid>
                  {project.members.map((member) => (
                    <MemberCard key={member.id}>
                      <MemberImage src={member.img} alt={member.name} />
                      <MemberInfo>
                        <MemberName>{member.name}</MemberName>
                        <SocialLinks>
                          {member.github && <a href={member.github} target="_blank"><GitHub fontSize="inherit"/></a>}
                          {member.linkedin && <a href={member.linkedin} target="_blank"><LinkedIn fontSize="inherit"/></a>}
                        </SocialLinks>
                      </MemberInfo>
                    </MemberCard>
                  ))}
                </TeamGrid>
              </Section>
            )}
          </Content>
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default ProjectDetails;

