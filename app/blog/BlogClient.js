"use client";

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Search as SearchIcon, ArrowBack } from '@mui/icons-material';
import BlogCard from '@/components/Blog/BlogCard';
import { getAllBlogPosts, getAllTags, getFeaturedPosts } from '@/lib/supabase/blog';
import { motion } from 'framer-motion';

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

const HeroSection = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  padding: 20px 0;
`;

const Title = styled.h1`
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

const Subtitle = styled.p`
  font-size: 19px;
  text-align: center;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 24px;
  letter-spacing: 0.2px;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 17px;
    margin-top: 20px;
    max-width: 90%;
    line-height: 1.5;
  }
`;

const FeaturedSection = styled(motion.div)`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
`;

const Controls = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 60px;
  align-items: center;
`;

const SearchBar = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 50px 16px 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.primary + '25'};
  background: ${({ theme }) => theme.card_light + '50'};
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.card_light};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + '80'};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text_secondary};
  pointer-events: none;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 800px;
`;

const TagFilter = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.primary : theme.primary + '25'};
  background: ${({ theme, $active }) => $active ? theme.primary + '25' : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text_secondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + '15'};
  }
`;

const BlogGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.text_secondary};
  
  h3 {
    font-size: 20px;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.text_primary};
  }
  
  p {
    font-size: 16px;
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
  const [filteredPosts, setFilteredPosts] = useState(initialPosts || []);
  const [featuredPosts, setFeaturedPosts] = useState(initialFeatured || []);
  const [tags, setTags] = useState(initialTags || []);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(!initialPosts);

  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
      setFilteredPosts(initialPosts);
      setTags(initialTags || []);
      setFeaturedPosts(initialFeatured || []);
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      
      // Fetch data in parallel
      const [allPostsData, tagsData, featuredData] = await Promise.all([
        getAllBlogPosts(100, 0),
        getAllTags(),
        getFeaturedPosts(3)
      ]);
      
      setPosts(allPostsData.posts);
      setFilteredPosts(allPostsData.posts);
      setTags(tagsData);
      setFeaturedPosts(featuredData);
      
      setLoading(false);
    }
    
    fetchData();
  }, [initialPosts, initialTags, initialFeatured]);

  useEffect(() => {
    let filtered = posts;
    
    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags && post.tags.includes(selectedTag));
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredPosts(filtered);
  }, [selectedTag, searchQuery, posts]);

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Container>
      <HomeLink href="/">
        <ArrowBack style={{ fontSize: '20px' }} />
        Back to Home
      </HomeLink>
      <Wrapper>
        <InnerWrapper>
          <HeroSection
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title>Blog</Title>
            <Subtitle>
              Thoughts, tutorials, and insights on development and design.
            </Subtitle>
          </HeroSection>

          <Controls
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SearchBar>
              <SearchInput
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
            </SearchBar>

            {tags.length > 0 && (
              <TagsContainer>
                {tags.map((tag) => (
                  <TagFilter
                    key={tag}
                    $active={selectedTag === tag}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </TagFilter>
                ))}
              </TagsContainer>
            )}
          </Controls>

          {!loading && featuredPosts.length > 0 && !searchQuery && !selectedTag && (
            <FeaturedSection
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <SectionTitle>Featured</SectionTitle>
              <BlogGrid>
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </BlogGrid>
            </FeaturedSection>
          )}

          <SectionTitle>
            {searchQuery || selectedTag ? 'Search Results' : 'Latest Posts'}
          </SectionTitle>

          {loading ? (
            <BlogGrid>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingSkeleton key={i} />
              ))}
            </BlogGrid>
          ) : filteredPosts.length > 0 ? (
            <BlogGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </BlogGrid>
          ) : (
            <EmptyState>
              <h3>No posts found</h3>
              <p>
                {searchQuery || selectedTag
                  ? 'Try adjusting your search or filters'
                  : 'Check back soon for new content!'}
              </p>
            </EmptyState>
          )}
        </InnerWrapper>
      </Wrapper>
    </Container>
  );
}
