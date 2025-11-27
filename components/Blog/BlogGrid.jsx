import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const LoadingSkeleton = styled.div`
  background: ${({ theme }) => theme.card_light + '50'};
  border-radius: 20px;
  height: 400px;
  animation: pulse 1.5s ease-in-out infinite;
  border: 1px solid ${({ theme }) => theme.primary + '15'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const BlogGrid = ({ posts, loading }) => {
  if (loading) {
    return (
      <Grid id="blog-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <LoadingSkeleton key={i} />
        ))}
      </Grid>
    );
  }

  return (
    <Grid
      id="blog-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </Grid>
  );
};

export default React.memo(BlogGrid);
