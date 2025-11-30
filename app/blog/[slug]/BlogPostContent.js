"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaTags, 
  FaShareAlt, 
  FaListUl, 
  FaTimes, 
  FaSearchPlus, 
  FaCheck, 
  FaCopy,
  FaArrowUp
} from 'react-icons/fa';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-hot-toast';
import BlogCard from '@/components/Blog/BlogCard';
import MarkdownTable from "@/components/shared/MarkdownTable";
import { incrementViews, getRelatedPosts } from '@/lib/supabase/blog';
import { fetchBioDataClient, fetchBlogPostClient } from '@/lib/api/supabase-client';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  position: relative;
  overflow-x: hidden;
  
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
`;

const ProgressBar = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary || theme.primary});
  z-index: 1000;
  box-shadow: 0 2px 10px ${({ theme }) => theme.primary}40;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 70vh;
  min-height: 500px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.4), ${({ theme }) => theme.bg});
    z-index: 1;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1000px;
  padding: 0 20px;
  margin-top: 40px;
`;

const BlogTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: white;
  margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 24px;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.3);
    padding: 6px 14px;
    border-radius: 50px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const BlogTag = styled.span`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Space Mono', monospace;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.card}cc;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid ${({ theme }) => theme.primary}15;
  padding: 20px 60px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const BackButton = styled(motion.button)`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.text_secondary};
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  &:hover {
    background: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${({ theme }) => theme.primary}40;
  }
`;

const ShareButton = styled(motion.button)`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary}20;
  color: ${({ theme }) => theme.text_secondary};
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  &:hover {
    background: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${({ theme }) => theme.primary}40;
  }
`;

const MainContent = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;
  padding-bottom: 80px;
`;

const ArticleContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const MarkdownContainer = styled(motion.div)`
  max-width: 1200px;
  margin: -100px auto 0;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary}18;
  border-radius: 28px;
  padding: 80px;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.18),
    0 4px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 ${({ theme }) => theme.primary}12;
  position: relative;
  z-index: 10;
  
  @media (max-width: 1200px) {
    margin: -60px 20px 0;
    padding: 60px;
  }

  @media (max-width: 768px) {
    padding: 32px 20px;
    border-radius: 20px;
    margin: -40px 16px 0;
  }

  /* Markdown Styling */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 800;
    color: ${({ theme }) => theme.text_primary};
    line-height: 1.3;
    position: relative;
    letter-spacing: -0.02em;
  }

  h1 {
    font-size: 48px;
    margin-top: 0;
    margin-bottom: 40px;
    background: linear-gradient(135deg, ${({ theme }) => theme.text_primary} 0%, ${({ theme }) => theme.primary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  h2 {
    font-size: 34px;
    margin-top: 64px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.primary}20;
  }

  h3 {
    font-size: 26px;
    margin-top: 48px;
    margin-bottom: 20px;
  }

  p {
    font-size: 20px;
    line-height: 1.8;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 32px;
    font-weight: 400;
  }

  strong {
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
  }

  ul, ol {
    font-size: 20px;
    line-height: 1.8;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 32px;
    padding-left: 28px;
  }

  li {
    margin-bottom: 12px;
    padding-left: 8px;
  }

  ul li::marker {
    color: ${({ theme }) => theme.primary};
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 600;
    position: relative;
    transition: all 0.2s ease;
    background-image: linear-gradient(to right, ${({ theme }) => theme.primary}40, ${({ theme }) => theme.primary}40);
    background-size: 100% 2px;

    background-size: 100% 2px;
  }

  hr {
    border: none;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.primary}50, transparent);
    margin: 56px 0;
    border-radius: 2px;
  }
`;

const TocContainer = styled(motion.div)`
  position: fixed;
  top: 120px;
  right: 40px;
  width: 280px;
  background: ${({ theme }) => theme.card}ee;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.primary}20;
  border-radius: 16px;
  padding: 24px;
  z-index: 90;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);

  @media (max-width: 1600px) {
    display: none;
  }
`;

const TocTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg { color: ${({ theme }) => theme.primary}; }
`;

const TocList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TocItem = styled.li`
  font-size: 14px;
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text_secondary};
  cursor: pointer;
  padding-left: ${({ $level }) => ($level - 1) * 12}px;
  transition: all 0.2s ease;
  line-height: 1.4;
  font-weight: ${({ $active }) => $active ? 600 : 400};
  border-left: 2px solid ${({ theme, $active }) => $active ? theme.primary : 'transparent'};
  margin-left: -24px;
  padding-left: ${({ $level }) => ($level - 1) * 12 + 22}px;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  padding: 40px;
`;

const LightboxImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
`;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #1e1e1e;
  border-bottom: 1px solid #333;
  border-radius: 16px 16px 0 0;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  color: #a0a0a0;

  &::before {
    content: '';
    display: flex;
    gap: 6px;
    width: 50px;
    height: 12px;
    background-image: 
      radial-gradient(circle, #ff5f56 5px, transparent 6px),
      radial-gradient(circle, #ffbd2e 5px, transparent 6px),
      radial-gradient(circle, #27c93f 5px, transparent 6px);
    background-size: 12px 12px;
    background-position: 0 0, 18px 0, 36px 0;
    background-repeat: no-repeat;
  }
`;

const CodeLanguage = styled.span`
  color: #a0a0a0;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
`;

const CopyButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-family: 'Space Mono', monospace;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

const AuthorSection = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  padding: 48px;
  margin: 80px auto 0;
  display: flex;
  gap: 40px;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.primary}15;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary || theme.primary}80);
  }
  
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
  border: 4px solid ${({ theme }) => theme.bg};
  box-shadow: 
    0 0 0 2px ${({ theme }) => theme.primary},
    0 8px 24px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const AuthorInfo = styled.div`
  flex: 1;
`;

const AuthorName = styled.h3`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    justify-content: center;
    font-size: 24px;
  }
`;

const AuthorBio = styled.p`
  font-size: 17px;
  line-height: 1.7;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0 0 24px 0;
  max-width: 600px;

  @media (max-width: 768px) {
    margin: 0 auto 24px;
  }
`;

const AuthorSocials = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_secondary};
  border: 1px solid ${({ theme }) => theme.text_secondary}15;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 20px;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateY(-4px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 8px 20px ${({ theme }) => theme.primary}30;
  }
`;

const RelatedSection = styled.div`
  margin-top: 100px;
  padding-top: 60px;
  border-top: 2px solid ${({ theme }) => theme.text_secondary + '20'};
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const RelatedTitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 48px;
  text-align: center;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScrollToTop = styled(motion.button)`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 20px ${({ theme }) => theme.primary}40;
  z-index: 99;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px ${({ theme }) => theme.primary}60;
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 4px solid ${({ theme }) => theme.primary}20;
  border-top-color: ${({ theme }) => theme.primary};
  border-radius: 50%;
`;

export default function BlogPostContent({ slug: propSlug, initialPost = null }) {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(initialPost);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [bioData, setBioData] = useState(null);
  const [loading, setLoading] = useState(!initialPost);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);
  const contentRef = useRef(null);

  // Use prop slug as fallback for static generation
  const slug = propSlug || params?.slug;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      if (!post) {
        setLoading(true);
        const { data: fetchedPost, error } = await fetchBlogPostClient(slug);
        
        if (fetchedPost && !error) {
          setPost(fetchedPost);
        }
        setLoading(false);
      }
      
      if (post || slug) {
        incrementViews(slug);
        
        const tags = post?.tags;
        if (tags && tags.length > 0) {
          const related = await getRelatedPosts(slug, tags, 3);
          setRelatedPosts(related);
        }
      }
      
      const { data: bio } = await fetchBioDataClient();
      if (bio) {
        setBioData(bio);
      }
    }
    
    fetchPost();
  }, [slug, post]);

  // Generate TOC
  useEffect(() => {
    if (!post?.content) return;
    
    const headings = post.content.match(/^#{1,3} .+/gm);
    if (headings) {
      const tocItems = headings.map((heading) => {
        const level = heading.match(/^#+/)[0].length;
        const text = heading.replace(/^#+ /, '');
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        return { id, text, level };
      });
      setToc(tocItems);
    }
  }, [post]);

  // Intersection Observer for active TOC item
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    document.querySelectorAll('h1, h2, h3').forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, [post]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

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
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  // Custom renderers
  const CodeBlock = ({ children, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const codeString = String(children).replace(/\n$/, '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      copyCode(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div style={{ position: 'relative', margin: '40px 0' }}>
        <CodeHeader>
          <CodeLanguage>{language}</CodeLanguage>
          <CopyButton onClick={handleCopy} style={{ position: 'static', padding: '6px 12px' }}>
            {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
          </CopyButton>
        </CodeHeader>
        <div style={{ borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '24px',
              background: '#1e1e1e',
              fontSize: '14px',
              lineHeight: '1.6',
              fontFamily: "'JetBrains Mono', monospace",
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  const ImageRenderer = ({ src, alt }) => (
    <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setLightboxImage(src)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '20px', 
        background: 'rgba(0,0,0,0.6)', 
        color: 'white', 
        padding: '8px', 
        borderRadius: '8px',
        pointerEvents: 'none'
      }}>
        <FaSearchPlus />
      </div>
    </div>
  );

  const HeadingRenderer = ({ level, children }) => {
    const text = children?.[0] || '';
    const id = typeof text === 'string' ? text.toLowerCase().replace(/[^\w]+/g, '-') : '';
    const Tag = `h${level}`;
    return <Tag id={id}>{children}</Tag>;
  };

  const ParagraphRenderer = ({ node, children, ...props }) => {
    const hasImage = node?.children?.some((child) => child.type === "element" && child.tagName === "img");
    if (hasImage) {
      return <div {...props}>{children}</div>;
    }
    return <p {...props}>{children}</p>;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h3 style={{ marginTop: 20 }}>Loading article...</h3>
        </LoadingContainer>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container>
      <ProgressBar style={{ width: `${scrollProgress}%` }} />

      <Header>
        <HeaderLeft>
          <BackButton
            onClick={() => router.push("/blog")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Back to Blog
          </BackButton>
        </HeaderLeft>

        <ShareButton onClick={handleShare} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FaShareAlt /> Share
        </ShareButton>
      </Header>

      <HeroSection>
        <HeroImage src={post.cover_image} alt={post.title} />
        <HeroContent>
          <BlogTitle>{post.title}</BlogTitle>
          <MetaInfo>
            <div><FaCalendarAlt /> {new Date(post.published_at).toLocaleDateString()}</div>
            <div><FaClock /> {post.reading_time} min read</div>
            <div><FaUser /> {post.author}</div>
          </MetaInfo>
          <BlogTags>
            {post.tags?.map(tag => (
              <BlogTag key={tag}>{tag}</BlogTag>
            ))}
          </BlogTags>
        </HeroContent>
      </HeroSection>

      <MainContent>
        <ArticleContainer ref={contentRef}>
          <MarkdownContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                img: ImageRenderer,
                p: ParagraphRenderer,
                h1: ({node, ...props}) => <HeadingRenderer level={1} {...props} />,
                h2: ({node, ...props}) => <HeadingRenderer level={2} {...props} />,
                h3: ({node, ...props}) => <HeadingRenderer level={3} {...props} />,
                table: MarkdownTable,
              }}
            >
              {post.content}
            </ReactMarkdown>

            {/* Author Section */}
            {bioData && (
              <AuthorSection>
                <AuthorAvatar $url={bioData.image || bioData.Image} />
                <AuthorInfo>
                  <AuthorName>
                    {bioData.name}
                  </AuthorName>
                  <AuthorBio>{bioData.description}</AuthorBio>
                  <AuthorSocials>
                    {bioData.github && (
                      <SocialLink href={bioData.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                        <FaGithub />
                      </SocialLink>
                    )}
                    {bioData.linkedin && (
                      <SocialLink href={bioData.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                        <FaLinkedin />
                      </SocialLink>
                    )}
                    {bioData.twitter && (
                      <SocialLink href={bioData.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                        <FaTwitter />
                      </SocialLink>
                    )}
                  </AuthorSocials>
                </AuthorInfo>
              </AuthorSection>
            )}
          </MarkdownContainer>

          {toc.length > 0 && (
            <TocContainer
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TocTitle><FaListUl /> Contents</TocTitle>
              <TocList>
                {toc.map((item) => (
                  <TocItem 
                    key={item.id} 
                    $level={item.level} 
                    $active={activeId === item.id}
                    onClick={() => scrollToHeading(item.id)}
                  >
                    {item.text}
                  </TocItem>
                ))}
              </TocList>
            </TocContainer>
          )}
        </ArticleContainer>

        {relatedPosts.length > 0 && (
          <RelatedSection>
            <RelatedTitle>Related Articles</RelatedTitle>
            <RelatedGrid>
              {relatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </RelatedGrid>
          </RelatedSection>
        )}
      </MainContent>

      <AnimatePresence>
        {showScrollTop && (
          <ScrollToTop
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
          >
            <FaArrowUp />
          </ScrollToTop>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxImage && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <LightboxImage 
              src={lightboxImage} 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
            <button 
              style={{ 
                position: 'absolute', 
                top: 40, 
                right: 40, 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                fontSize: 32, 
                cursor: 'pointer' 
              }}
              onClick={() => setLightboxImage(null)}
            >
              <FaTimes />
            </button>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
}
