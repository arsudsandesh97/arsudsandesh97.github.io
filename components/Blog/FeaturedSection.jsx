import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

const Section = styled(motion.div)`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  &::after {
    content: '';
    height: 1px;
    flex: 1;
    background: ${({ theme }) => theme.primary + '30'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const FeaturedSection = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <Section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <SectionTitle>Featured Posts</SectionTitle>
      <Grid>
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} featured />
        ))}
      </Grid>
    </Section>
  );
};

export default React.memo(FeaturedSection);
