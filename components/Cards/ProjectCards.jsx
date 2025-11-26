"use client";

import React, { memo, useState, useCallback } from "react";
import styled from "styled-components";
import Link from "next/link";
import { slugify } from "@/lib/utils";

const Card = styled.div`
  width: 100%;
  max-width: 330px;
  height: 540px;
  background: ${({ theme }) => theme.card_light + "70"};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  cursor: pointer;
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 1px ${({ theme }) => theme.primary + "15"};
  border: 1px solid ${({ theme }) => theme.primary + "25"};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    border-color: ${({ theme }) => theme.primary + "70"};
    box-shadow: 
      0 24px 60px -10px ${({ theme }) => theme.primary + "50"},
      0 12px 30px -8px ${({ theme }) => theme.primary + "30"},
      inset 0 1px 1px ${({ theme }) => theme.primary + "25"};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg, 
      ${({ theme }) => theme.primary}, 
      ${({ theme }) => theme.primary + "CC"},
      transparent
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.primary + "40"},
      transparent,
      ${({ theme }) => theme.primary + "20"}
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover::before,
  &:hover::after {
    opacity: 1;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 180px;
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-out;
  
  ${Card}:hover & {
    transform: scale(1.1);
    filter: brightness(1.1) saturate(1.2);
  }

  ${({ $isLoading }) =>
    $isLoading &&
    `
    filter: blur(10px);
    transition: filter 0.3s ease-out;
  `}
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, ${({ theme }) => theme.card_light}, transparent);
  pointer-events: none;
`;

const Content = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h3`
  font-size: 19px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  line-height: 1.4;
  letter-spacing: -0.3px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${Card}:hover & {
    color: ${({ theme }) => theme.primary};
    transform: translateX(4px);
  }
`;

const Description = styled.p`
  font-size: 13.5px;
  line-height: 1.65;
  color: ${({ theme }) => theme.text_secondary + "DD"};
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  flex-shrink: 0;
  letter-spacing: 0.1px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 80px;
  overflow: hidden;
`;

const Tag = styled.span`
  font-size: 10.5px;
  font-weight: 600;
  font-family: 'Space Mono', monospace;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + "15"};
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary + "30"};
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.primary + "20"};
    transition: left 0.3s ease;
  }

  ${Card}:hover & {
    background: ${({ theme }) => theme.primary + "25"};
    border-color: ${({ theme }) => theme.primary + "50"};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px ${({ theme }) => theme.primary + "20"};

    &::before {
      left: 100%;
    }
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: auto;
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${({ theme }) => theme.primary + "30"},
    transparent
  );
  margin: 12px 0;
  width: 100%;
`;

const MembersAvatarContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 32px;
`;

const MemberAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.primary};
  object-fit: cover;
  transition: all 0.3s ease;
  margin-left: -8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    transform: scale(1.15) translateY(-2px);
    z-index: 10;
    box-shadow: 0 4px 12px ${({ theme }) => theme.primary}40;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 0;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;
  flex: 1;
  min-width: 0;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  ${({ $primary, $secondary, theme }) => {
    if ($primary) {
      return `
        background: linear-gradient(135deg, ${theme.primary}, ${theme.primary}dd);
        color: white;
        border: 1px solid ${theme.primary}20;
        box-shadow: 0 4px 15px ${theme.primary}30;
        
        &:hover {
          background: linear-gradient(135deg, ${theme.primary}ee, ${theme.primary}cc);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${theme.primary}50;
          border-color: ${theme.primary}50;
        }

        &:active {
          transform: translateY(0);
        }
      `;
    } else if ($secondary) {
      return `
        background: ${theme.primary}08;
        color: ${theme.primary};
        border: 1px solid ${theme.primary}20;
        backdrop-filter: blur(4px);
        
        &:hover {
          background: ${theme.primary}15;
          border-color: ${theme.primary}40;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px ${theme.primary}15;
        }

        &:active {
          transform: translateY(0);
        }
      `;
    }
    return '';
  }}
`;

// Replace the optimizeImageUrl implementation
const optimizeImageUrl = (url) => {
  if (!url || url === "https://via.placeholder.com/150") return url;
  if (url.includes("format=webp")) return url;
  if (url.includes("cloudinary.com")) {
    return url.replace("/upload/", "/upload/w_330,h_180,f_auto,q_auto/");
  }
  return url;
};

// Update OptimizedImage component
const OptimizedImage = memo(({ src, alt, onLoad, onError, isLoading }) => {
  const optimizedSrc = optimizeImageUrl(src);

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onLoad={onLoad}
      onError={onError}
      $isLoading={isLoading}
    />
  );
});

// Update ProjectCards component
const ProjectCards = memo(({ project, setOpenModal }) => {
  // Replace the static placeholder with a dynamic one
  const placeholderImage = `https://placehold.co/330x180/1d1836/ffffff?text=${
    project.title?.charAt(0) || "?"
  }`;
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(
    (e) => {
      e.target.src = placeholderImage;
      setImageLoaded(true); // Remove loading blur when showing placeholder
    },
    [placeholderImage]
  );

  // Update the OptimizedAvatar error handling
  const handleAvatarError = useCallback((e) => {
    const initial = e.target.alt?.charAt(0) || "?";
    e.target.src = `https://placehold.co/40x40/1d1836/ffffff?text=${initial}`;
  }, []);

  // Update the optimizedProjectImage with fallback
  const optimizedProjectImage = optimizeImageUrl(project.image);

  const handleCardClick = useCallback(() => {
    setOpenModal({ state: true, project });
  }, [project, setOpenModal]);

  return (
    <Card onClick={handleCardClick}>
      <ImageContainer>
        <OptimizedImage
          src={optimizedProjectImage}
          alt={project.title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          isLoading={!imageLoaded}
        />
        <ImageOverlay />
      </ImageContainer>

      <Content>
        <TopSection>
          <Header>
            <Title>{project.title}</Title>
          </Header>

          <Tags>
            {project.tags?.slice(0, 6).map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {project.tags?.length > 6 && (
              <Tag>+{project.tags.length - 6}</Tag>
            )}
          </Tags>

          <Description>{project.description}</Description>
        </TopSection>

        <BottomSection>
          <ActionButtons>
            {project.github && (
              <ActionButton
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                $secondary
                onClick={(e) => e.stopPropagation()}
              >
                Code
              </ActionButton>
            )}
            {project.dashboard && project.dashboard !== "#" && (
              <ActionButton
                href={project.dashboard}
                target="_blank"
                rel="noopener noreferrer"
                $secondary
                onClick={(e) => e.stopPropagation()}
              >
                Dashboard
              </ActionButton>
            )}
            <Link href={`/project-explanation/${slugify(project.title)}`} passHref legacyBehavior>
              <ActionButton
                $primary
                onClick={(e) => e.stopPropagation()}
              >
                View Project
              </ActionButton>
            </Link>
          </ActionButtons>

          <Divider />

          <MembersAvatarContainer>
            {(project.associations?.length > 0 || project.members?.length > 0) ? (
              <>
                {project.associations?.slice(0, 1).map((assoc, index) => (
                  <MemberAvatar
                    key={`assoc-${index}`}
                    src={assoc.img}
                    alt={assoc.name}
                    title={assoc.name}
                    onError={handleAvatarError}
                  />
                ))}
                {project.members?.slice(0, 4).map((member, index) => (
                  <MemberAvatar
                    key={`member-${index}`}
                    src={member.img}
                    alt={member.name}
                    title={member.name}
                    onError={handleAvatarError}
                  />
                ))}
                {(project.members?.length > 4 || (project.associations?.length > 1)) && (
                  <MemberAvatar
                    as="div"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: '600',
                      backgroundColor: '#854CE6',
                      color: 'white',
                    }}
                    title={`+${(project.members?.length || 0) - 4 + (project.associations?.length || 0) - 1} more`}
                  >
                    +{(project.members?.length || 0) - 4 + (project.associations?.length || 0) - 1}
                  </MemberAvatar>
                )}
              </>
            ) : null}
          </MembersAvatarContainer>
        </BottomSection>
      </Content>
    </Card>
  );
});

// Add display names for better debugging
ProjectCards.displayName = "ProjectCards";
OptimizedImage.displayName = "OptimizedImage";

export default ProjectCards;

