"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { 
  CalendarMonth, 
  AccessTime, 
  Visibility, 
  ArrowBack, 
  Share, 
  Folder, 
  Update, 
  KeyboardArrowRight, 
  Home,
  ContentCopy,
  KeyboardArrowUp,
  LinkedIn,
  GitHub
} from '@mui/icons-material';
import BlogCard from '@/components/Blog/BlogCard';
import { incrementViews, getRelatedPosts } from '@/lib/supabase/blog';
import { fetchBioDataClient, fetchBlogPostClient } from '@/lib/api/supabase-client';

const AuthorSocials = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.card_light};
  color: ${({ theme }) => theme.text_secondary};
  border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.primary};
  }
  
  svg {
    font-size: 18px;
  }
`;

const ProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary || theme.primary});
  width: ${({ $width }) => $width}%;
  z-index: 1000;
  transition: width 0.1s ease;
  box-shadow: 0 0 10px ${({ theme }) => theme.primary + '80'};
`;

const ScrollTopBtn = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px ${({ theme }) => theme.primary + '40'};
  opacity: ${({ $visible }) => ($visible ? '1' : '0')};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '20px')});
  transition: all 0.3s ease;
  z-index: 90;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px ${({ theme }) => theme.primary + '60'};
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #e0e0e0;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  svg {
    font-size: 16px;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  padding: 100px 0 60px 0;
  
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
  max-width: 100%;
  margin: 0 auto;
  padding: 0 40px;
  
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 40px;
  padding: 12px 0;
  transition: all 0.3s ease;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(-4px);
    
    svg {
      transform: translateX(-2px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  flex-wrap: wrap;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  
  a {
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${({ theme }) => theme.text_secondary};
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
  
  span {
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
  
  svg {
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary + '80'};
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    span {
      max-width: 150px;
    }
  }
`;

const CoverImage = styled.div`
  width: 100%;
  height: 600px;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;
  border-radius: 24px;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(to top, ${({ theme }) => theme.bg + '80'}, transparent);
  }
  
  @media (max-width: 1400px) {
    height: 500px;
  }
  
  @media (max-width: 768px) {
    height: 300px;
    border-radius: 16px;
  }
`;

const CategoryBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 10px ${({ theme }) => theme.primary + '40'};
  
  svg {
    font-size: 16px;
  }
`;

const Header = styled.div`
  margin-bottom: 56px;
  padding-bottom: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '15'};
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 900;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 32px;
  line-height: 1.1;
  letter-spacing: -2px;
  
  @media (max-width: 768px) {
    font-size: 38px;
    letter-spacing: -1px;
    margin-bottom: 24px;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  color: ${({ theme }) => theme.text_secondary};
  font-family: 'Inter', sans-serif;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.card_light};
  padding: 8px 16px;
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.text_secondary + '15'};
  
  svg {
    font-size: 18px;
    color: ${({ theme }) => theme.primary};
  }
`;

const AuthorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 16px;
  padding-right: 24px;
  border-right: 1px solid ${({ theme }) => theme.text_secondary + '20'};
  
  @media (max-width: 768px) {
    border-right: none;
    padding-right: 0;
    margin-right: 0;
    width: 100%;
    margin-bottom: 8px;
  }
`;

const AuthorMetaAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;
  border: 2px solid ${({ theme }) => theme.primary};
`;

const AuthorMetaInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AuthorMetaName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
`;

const AuthorMetaRole = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 100px;
  border: 1px solid ${({ theme }) => theme.primary + '40'};
  background: ${({ theme }) => theme.primary + '10'};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: auto;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.primary + '30'};
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  }
`;

const Content = styled.article`
  color: ${({ theme }) => theme.text_primary};
  font-size: 20px;
  line-height: 2;
  margin-bottom: 80px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text_primary};
    margin-top: 64px;
    margin-bottom: 24px;
    font-weight: 800;
    letter-spacing: -0.8px;
    line-height: 1.2;
  }
  
  h2 {
    font-size: 40px;
    padding-bottom: 16px;
    border-bottom: 3px solid ${({ theme }) => theme.primary + '40'};
    margin-top: 80px;
  }
  
  h3 {
    font-size: 32px;
  }
  
  h4 {
    font-size: 24px;
  }
  
  p {
    margin-bottom: 28px;
    line-height: 2;
  }
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    border-bottom: 2px solid ${({ theme }) => theme.primary + '40'};
    transition: all 0.2s ease;
    padding-bottom: 2px;
    
    &:hover {
      border-bottom-color: ${({ theme }) => theme.primary};
      background: ${({ theme }) => theme.primary + '10'};
    }
  }
  
  code {
    background: ${({ theme }) => theme.card_light};
    padding: 4px 10px;
    border-radius: 6px;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 17px;
    color: ${({ theme }) => theme.primary};
  }
  
  pre {
    margin: 40px 0;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    
    code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: 15px;
    }
  }
  
  blockquote {
    border-left: 5px solid ${({ theme }) => theme.primary};
    padding-left: 32px;
    margin: 40px 0;
    font-style: italic;
    color: ${({ theme }) => theme.text_secondary};
    font-size: 22px;
    position: relative;
    
    &::before {
      content: '"';
      font-size: 80px;
      position: absolute;
      left: -10px;
      top: -20px;
      color: ${({ theme }) => theme.primary + '30'};
      font-family: Georgia, serif;
    }
  }
  
  ul, ol {
    margin-bottom: 28px;
    padding-left: 40px;
  }
  
  li {
    margin-bottom: 16px;
    line-height: 1.8;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 16px;
    margin: 48px 0;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
    
    th, td {
      border: 1px solid ${({ theme }) => theme.text_secondary + '20'};
      padding: 16px 20px;
      text-align: left;
    }
    
    th {
      background: ${({ theme }) => theme.primary + '15'};
      font-weight: 700;
      color: ${({ theme }) => theme.primary};
    }
    
    tr:hover {
      background: ${({ theme }) => theme.card_light};
    }
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
    
    h2 {
      font-size: 32px;
    }
    
    h3 {
      font-size: 26px;
    }
    
    blockquote {
      font-size: 19px;
      padding-left: 24px;
    }
  }
`;

const AuthorSection = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + '20'};
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 80px;
  display: flex;
  gap: 32px;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
    gap: 24px;
  }
`;

const AuthorAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-image: url(${({ $url }) => $url});
  background-size: cover;
  background-position: center;
  border: 4px solid ${({ theme }) => theme.primary};
  box-shadow: 0 8px 24px ${({ theme }) => theme.primary + '40'};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 8px;
`;

const AuthorName = styled.h3`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
`;

const AuthorBio = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 80px;
  padding: 32px 0;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + '15'};
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '15'};
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const Tag = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + '15'};
  padding: 10px 24px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.primary + '40'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px ${({ theme }) => theme.primary + '40'};
  }
`;

const RelatedSection = styled.div`
  margin-top: 100px;
  padding-top: 60px;
  border-top: 2px solid ${({ theme }) => theme.text_secondary + '20'};
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const RelatedTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 48px;
  text-align: center;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingSkeleton = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  height: ${({ $height }) => $height || '400px'};
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

export default function BlogPostContent({ slug: propSlug, initialPost = null }) {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(!initialPost);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Use prop slug as fallback for static generation
  const slug = propSlug || params?.slug;

  useEffect(() => {
    const handleScroll = () => {
      // Calculate reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
      
      // Show/hide scroll top button
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      // Only fetch if we don't have the post data yet
      if (!post) {
        setLoading(true);
        const { data: fetchedPost, error } = await fetchBlogPostClient(slug);
        
        if (fetchedPost && !error) {
          setPost(fetchedPost);
        }
        setLoading(false);
      }
      
      // Always increment views and fetch related data (these can happen in background)
      if (post || slug) {
        incrementViews(slug);
        
        // Use post tags if available, otherwise wait for fetch
        const tags = post?.tags;
        if (tags && tags.length > 0) {
          const related = await getRelatedPosts(slug, tags, 3);
          setRelatedPosts(related);
        }
      }
      
      // Fetch author bio
      const { data: bio } = await fetchBioDataClient();
      if (bio) {
        setBioData(bio);
      }
    }
    
    fetchPost();
  }, [slug, post]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Container>
        <Wrapper>
          <LoadingSkeleton $height="600px" />
        </Wrapper>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Wrapper>
          <h1>Post not found</h1>
          <BackButton onClick={() => router.push('/blog')}>
            <ArrowBack /> Back to Blog
          </BackButton>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ProgressBar $width={readingProgress} />
      <ScrollTopBtn $visible={showScrollTop} onClick={scrollToTop}>
        <KeyboardArrowUp />
      </ScrollTopBtn>
      
      <Wrapper>
        <InnerWrapper>
          <Breadcrumbs>
            <Link href="/">
              <Home fontSize="small" /> Home
            </Link>
            <KeyboardArrowRight />
            <Link href="/blog">Blog</Link>
            {post.category && (
              <>
                <KeyboardArrowRight />
                <Link href={`/blog?category=${post.category}`}>{post.category}</Link>
              </>
            )}
            <KeyboardArrowRight />
            <span>{post.title}</span>
          </Breadcrumbs>

          {post.cover_image && (
            <CoverImage $url={post.cover_image} />
          )}

          <Header>
            {post.category && (
              <CategoryBadge>
                <Folder /> {post.category}
              </CategoryBadge>
            )}
            
            <Title>{post.title}</Title>
            
            <Meta>
              <AuthorMeta>
                <AuthorMetaAvatar $url={bioData?.Image || '/default-avatar.png'} />
                <AuthorMetaInfo>
                  <AuthorMetaName>{bioData?.name || post.author}</AuthorMetaName>
                  <AuthorMetaRole>Author</AuthorMetaRole>
                </AuthorMetaInfo>
              </AuthorMeta>

              {post.published_at && (
                <MetaItem>
                  <CalendarMonth />
                  {formatDate(post.published_at)}
                </MetaItem>
              )}

              {post.updated_at && post.updated_at !== post.published_at && (
                <MetaItem>
                  <Update />
                  Updated {formatDate(post.updated_at)}
                </MetaItem>
              )}
              
              {post.reading_time && (
                <MetaItem>
                  <AccessTime />
                  {post.reading_time} min read
                </MetaItem>
              )}
              
              {post.views > 0 && (
                <MetaItem>
                  <Visibility />
                  {post.views} views
                </MetaItem>
              )}
              
              <ShareButton onClick={handleShare}>
                <Share fontSize="small" />
                Share Article
              </ShareButton>
            </Meta>
          </Header>

          <Content>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  
                  return !inline && match ? (
                    <div style={{ position: 'relative' }}>
                      <CopyButton 
                        onClick={() => handleCopyCode(codeString)}
                        title="Copy code"
                      >
                        <ContentCopy />
                      </CopyButton>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </Content>

          <AuthorSection>
            <AuthorAvatar $url={bioData?.Image || '/default-avatar.png'} />
            <AuthorInfo>
              <AuthorLabel>About the Author</AuthorLabel>
              <AuthorName>{bioData?.name || post.author}</AuthorName>
              <AuthorBio>{bioData?.description || bioData?.roles?.join(' • ') || 'Tech enthusiast and developer.'}</AuthorBio>
              
              <AuthorSocials>
                {bioData?.linkedin && (
                  <SocialLink href={bioData.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <LinkedIn />
                  </SocialLink>
                )}
                {bioData?.github && (
                  <SocialLink href={bioData.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                    <GitHub />
                  </SocialLink>
                )}
              </AuthorSocials>
            </AuthorInfo>
          </AuthorSection>

          {post.tags && post.tags.length > 0 && (
            <Tags>
              {post.tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </Tags>
          )}

          {relatedPosts.length > 0 && (
            <RelatedSection>
              <RelatedTitle>Related Posts</RelatedTitle>
              <RelatedGrid>
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </RelatedGrid>
            </RelatedSection>
          )}
        </InnerWrapper>
      </Wrapper>
    </Container>
  );
}
