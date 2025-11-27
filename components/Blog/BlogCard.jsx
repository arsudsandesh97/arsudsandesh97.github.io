"use client";

import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { CalendarMonth, AccessTime } from '@mui/icons-material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Card = styled(motion.article)`
  width: 100%;
  height: 100%;
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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 4px;
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
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.card_light};
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  
  ${Card}:hover & {
    transform: scale(1.1);
  }
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
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.3px;
  
  ${Card}:hover & {
    color: ${({ theme }) => theme.primary};
    transform: translateX(4px);
  }
`;

const Excerpt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary + "DD"};
  line-height: 1.6;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.primary + "15"};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  
  svg {
    font-size: 16px;
    color: ${({ theme }) => theme.primary};
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span`
  font-size: 11px;
  font-weight: 600;
  font-family: 'Space Mono', monospace;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + "15"};
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.primary + "30"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${Card}:hover & {
    background: ${({ theme }) => theme.primary + "25"};
    border-color: ${({ theme }) => theme.primary + "50"};
    transform: translateY(-2px);
    box-shadow: 0 2px 8px ${({ theme }) => theme.primary + "20"};
  }
`;

const BlogCard = ({ post, featured = false }) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleClick = (e) => {
    // Allow opening in new tab with Ctrl/Cmd + Click
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    router.push(`/blog/${post.slug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/blog/${post.slug}`);
    }
  };

  return (
    <Card 
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="link"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label={`Read article: ${post.title}`}
    >
      {post.cover_image && (
        <ImageContainer>
          <CoverImage 
            src={post.cover_image} 
            alt={post.title} 
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            $loaded={imageLoaded}
          />
          <ImageOverlay />
        </ImageContainer>
      )}
      
      <Content>
        <Title>{post.title}</Title>
        
        {post.tags && post.tags.length > 0 && (
          <Tags>
            {post.tags.slice(0, 3).map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </Tags>
        )}

        <Excerpt>{post.excerpt}</Excerpt>
        
        <Meta>
          {post.published_at && (
            <MetaItem>
              <CalendarMonth />
              {formatDate(post.published_at)}
            </MetaItem>
          )}
          
          {post.reading_time && (
            <MetaItem>
              <AccessTime />
              {post.reading_time} min read
            </MetaItem>
          )}
        </Meta>
      </Content>
    </Card>
  );
};

export default React.memo(BlogCard);
