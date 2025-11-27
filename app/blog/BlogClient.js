"use client";

import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import { getAllBlogPosts, getAllTags, getFeaturedPosts } from '@/lib/supabase/blog';
import { motion } from 'framer-motion';

// Import subcomponents
import HeroSection from '@/components/Blog/HeroSection';
import SearchBar from '@/components/Blog/SearchBar';
import TagPills from '@/components/Blog/TagPills';
import FeaturedSection from '@/components/Blog/FeaturedSection';
import BlogGrid from '@/components/Blog/BlogGrid';
import EmptyState from '@/components/Blog/EmptyState';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  position: relative;
  overflow-x: hidden;
  padding: 100px 0 60px 0;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 30%, ${({ theme }) => theme.primary}12 0%, transparent 60%),
      radial-gradient(circle at 80% 70%, ${({ theme }) => theme.primary}08 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, ${({ theme }) => theme.primary}05 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: pulse 15s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }

  @media (max-width: 768px) {
    padding: 80px 0 40px 0;
  }
`;

const Wrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
`;

const InnerWrapper = styled.div`
  max-width: 1350px;
  margin: 0 auto;
  padding: 0 30px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Controls = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 60px;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
`;

const HomeLink = styled(Link)`
  position: fixed;
  top: 30px;
  left: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.card_light + '80'};
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.primary + '20'};
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.primary};
    color: white;
    border-color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    top: 20px;
    left: 20px;
    padding: 8px 16px;
    font-size: 14px;
  }
`;

export default function BlogClient({ initialPosts, initialTags, initialFeatured }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [featuredPosts, setFeaturedPosts] = useState(initialFeatured || []);
  const [tags, setTags] = useState(initialTags || []);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(!initialPosts);

  // Fetch data if not provided initially (client-side fallback)
  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
      setTags(initialTags || []);
      setFeaturedPosts(initialFeatured || []);
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const [allPostsData, tagsData, featuredData] = await Promise.all([
          getAllBlogPosts(100, 0),
          getAllTags(),
          getFeaturedPosts(3)
        ]);
        
        setPosts(allPostsData.posts || []);
        setTags(tagsData || []);
        setFeaturedPosts(featuredData || []);
      } catch (error) {
        console.error("Failed to fetch blog data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [initialPosts, initialTags, initialFeatured]);

  // Filter posts based on search and tag
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags && post.tags.includes(selectedTag));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return filtered;
  }, [posts, selectedTag, searchQuery]);

  const handleTagSelect = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const showFeatured = !loading && featuredPosts.length > 0 && !searchQuery && !selectedTag;

  return (
    <Container>
      <HomeLink href="/" aria-label="Back to Home">
        <ArrowBack style={{ fontSize: '20px' }} />
        Back to Home
      </HomeLink>
      
      <Wrapper>
        <InnerWrapper>
          <HeroSection />

          <Controls
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SearchBar onSearch={handleSearch} />
            <TagPills 
              tags={tags} 
              selectedTag={selectedTag} 
              onTagSelect={handleTagSelect} 
            />
          </Controls>

          {/* Live Region for Screen Readers */}
          <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            {loading ? 'Loading posts...' : `Showing ${filteredPosts.length} posts`}
          </div>

          {showFeatured && (
            <FeaturedSection posts={featuredPosts} />
          )}

          <SectionTitle>
            {searchQuery || selectedTag ? 'Search Results' : 'Latest Posts'}
          </SectionTitle>

          {filteredPosts.length > 0 || loading ? (
            <BlogGrid posts={filteredPosts} loading={loading} />
          ) : (
            <EmptyState 
              message={searchQuery ? `No results for "${searchQuery}"` : "No posts found"}
              subMessage={searchQuery || selectedTag ? "Try adjusting your search or filters" : "Check back soon for new content!"}
            />
          )}
        </InnerWrapper>
      </Wrapper>
    </Container>
  );
}
