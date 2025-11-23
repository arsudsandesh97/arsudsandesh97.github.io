"use client";

import React, { memo, useState, useCallback } from "react";
import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  max-width: 330px;
  height: 490px;
  background: ${({ theme }) => theme.card_light + "50"};
  backdrop-filter: blur(10px);
  cursor: pointer;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.primary + "20"};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${({ theme }) => theme.primary + "60"};
    box-shadow: 0 20px 50px -10px ${({ theme }) => theme.primary + "40"};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary}, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
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
  transition: transform 0.4s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  line-height: 1.3;
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: ${({ theme }) => theme.primary};
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Date = styled.span`
  font-size: 11px;
  font-weight: 500;
  font-family: 'Space Mono', monospace;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AssociationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.primary + "15"};
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.primary + "30"};
  max-width: fit-content;
`;

const AssociationLogo = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const AssociationName = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  font-family: 'Space Mono', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
`;

const Description = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.text_secondary + "CC"};
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  flex-shrink: 0;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 48px;
  overflow: hidden;
`;

const Tag = styled.span`
  font-size: 10px;
  font-weight: 500;
  font-family: 'Space Mono', monospace;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + "10"};
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.primary + "20"};
  white-space: nowrap;
  transition: all 0.2s ease;
  
  ${Card}:hover & {
    background: ${({ theme }) => theme.primary + "20"};
    border-color: ${({ theme }) => theme.primary + "40"};
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + "20"};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TeamAvatars = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.card};
  margin-left: -8px;
  object-fit: cover;
  transition: transform 0.2s ease;
  
  &:first-child {
    margin-left: 0;
  }

  &:hover {
    transform: scale(1.15);
    z-index: 10;
  }
`;

const MemberAvatar = styled(Avatar)`
  border: 2px solid ${({ theme }) => theme.primary};
  transition: all 0.3s ease;
  margin-left: -10px;
  margin-top: 12px;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

const AssociationAvatar = styled(Avatar)`
  border: 2px solid ${({ theme }) => theme.text_secondary};
  transition: all 0.3s ease;
  width: 30px; /* Smaller for inline */
  height: 30px;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
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

// Update OptimizedAvatar component
const OptimizedAvatar = memo(({ member, type, placeholderImage, onError }) => {
  const AvatarComponent = type === "member" ? MemberAvatar : AssociationAvatar;
  const optimizedSrc = optimizeImageUrl(member.img) || placeholderImage;

  return (
    <AvatarComponent
      src={optimizedSrc}
      alt={`${type === "member" ? "Team member" : "Association"} ${
        member.name || ""
      }`}
      loading="lazy"
      decoding="async"
      onError={onError}
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
        <Header>
          <Title>{project.title}</Title>
          <MetaRow>
            <Date>{project.date}</Date>
            {project.associations?.length > 0 && (
              <AssociationBadge>
                <AssociationLogo 
                  src={project.associations[0].img} 
                  alt={project.associations[0].name}
                  onError={handleAvatarError}
                />
                <AssociationName>{project.associations[0].name}</AssociationName>
              </AssociationBadge>
            )}
          </MetaRow>
        </Header>

        <Description>{project.description}</Description>

        <Tags>
          {project.tags?.slice(0, 4).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          {project.tags?.length > 4 && (
            <Tag>+{project.tags.length - 4}</Tag>
          )}
        </Tags>

        {project.members?.length > 0 && (
          <Footer>
            <TeamAvatars>
              {project.members.slice(0, 3).map((member) => (
                <Avatar
                  key={member.id}
                  src={member.img}
                  alt={member.name}
                  onError={handleAvatarError}
                />
              ))}
              {project.members.length > 3 && (
                <Avatar
                  as="div"
                  style={{
                    background: 'rgba(133, 76, 230, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#854CE6'
                  }}
                >
                  +{project.members.length - 3}
                </Avatar>
              )}
            </TeamAvatars>
          </Footer>
        )}
      </Content>
    </Card>
  );
});

// Add display names for better debugging
ProjectCards.displayName = "ProjectCards";
OptimizedImage.displayName = "OptimizedImage";
OptimizedAvatar.displayName = "OptimizedAvatar";

export default ProjectCards;

