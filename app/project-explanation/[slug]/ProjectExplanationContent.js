"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaCode, FaArrowUp, FaCopy, FaCheck, FaListUl, FaTimes, FaSearchPlus } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { fetchSingleProjectClient, fetchProjectExplanationClient } from "@/lib/api/supabase-client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MarkdownTable from "@/components/shared/MarkdownTable";
import { toast } from 'react-hot-toast';

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
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primary}80);
  z-index: 1000;
  box-shadow: 0 2px 10px ${({ theme }) => theme.primary}40;
`;

const HeroSection = styled.div`
  width: 100%;
  height: 60vh;
  min-height: 400px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), ${({ theme }) => theme.bg});
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

const ProjectTitle = styled.h1`
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

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`;

const ProjectTag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Space Mono', monospace;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.card}ee;
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-bottom: 1px solid ${({ theme }) => theme.primary}25;
  padding: 20px 40px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 -1px 0 ${({ theme }) => theme.primary}15;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackButton = styled(motion.button)`
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateX(-5px);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ActionBtn = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${({ $primary, theme }) => $primary ? `
    background: ${theme.primary};
    color: white;
    border: none;
    
    &:hover {
      background: ${theme.primary}dd;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${theme.primary}40;
    }
  ` : `
    background: transparent;
    color: ${theme.primary};
    border: 1.5px solid ${theme.primary}40;
    
    &:hover {
      background: ${theme.primary}15;
      border-color: ${theme.primary};
    }
  `}

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
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
  max-width: 1400px;
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
  
  @media (max-width: 1400px) {
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
    margin-top: 60px;
    margin-bottom: 32px;
    line-height: 1.3;
    scroll-margin-top: 120px;
    position: relative;
    letter-spacing: -0.5px;

    @media (max-width: 768px) {
      margin-top: 40px;
      margin-bottom: 20px;
    }
  }

  h1 {
    font-size: 48px;
    background: linear-gradient(135deg, ${({ theme }) => theme.text_primary} 0%, ${({ theme }) => theme.primary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 0;

    @media (max-width: 768px) {
      font-size: 32px;
    }
  }

  h2 {
    font-size: 36px;
    padding-bottom: 20px;
    border-bottom: 2px solid ${({ theme }) => theme.primary}25;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 80px;

    @media (max-width: 768px) {
      font-size: 24px;
      margin-top: 48px;
      padding-bottom: 16px;
      gap: 12px;
    }

    &::before {
      content: '';
      width: 6px;
      height: 36px;
      background: linear-gradient(180deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primary}80);
      border-radius: 4px;
      box-shadow: 0 2px 8px ${({ theme }) => theme.primary}40;

      @media (max-width: 768px) {
        height: 28px;
        width: 4px;
      }
    }
  }

  h3 {
    font-size: 28px;
    color: ${({ theme }) => theme.text_primary};
    margin-top: 48px;

    @media (max-width: 768px) {
      font-size: 20px;
      margin-top: 32px;
    }
  }

  p {
    font-size: 19px;
    line-height: 1.9;
    color: ${({ theme }) => theme.text_secondary};
    margin: 0 0 32px 0;
    letter-spacing: 0.2px;
    font-weight: 400;

    @media (max-width: 768px) {
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 24px;
    }
  }

  ul, ol {
    font-size: 19px;
    line-height: 1.9;
    color: ${({ theme }) => theme.text_secondary};
    margin: 0 0 32px 0;
    padding-left: 36px;

    @media (max-width: 768px) {
      font-size: 16px;
      padding-left: 24px;
      margin-bottom: 24px;
    }
  }

  li {
    margin: 16px 0;
    padding-left: 10px;

    @media (max-width: 768px) {
      margin: 12px 0;
      padding-left: 6px;
    }
  }

  ul li::marker {
    color: ${({ theme }) => theme.primary};
    font-size: 1.2em;
  }

  code {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.primary};
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.9em;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    border: 1px solid ${({ theme }) => theme.primary}35;
    font-weight: 600;
  }

  pre {
    background: #0d1117;
    border: 1px solid ${({ theme }) => theme.primary}30;
    border-radius: 16px;
    padding: 32px;
    overflow-x: auto;
    margin: 40px 0;
    position: relative;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

    @media (max-width: 768px) {
      padding: 20px;
      margin: 24px 0;
      border-radius: 12px;
    }

    code {
      background: none;
      border: none;
      padding: 0;
      color: #e6edf3;
      font-size: 15px;
      line-height: 1.7;
      font-family: 'JetBrains Mono', monospace;

      @media (max-width: 768px) {
        font-size: 13px;
      }
    }

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #0d1117;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.primary}40;
      border-radius: 4px;
    }
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.primary};
    padding: 24px 32px;
    margin: 40px 0;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary}15, transparent);
    border-radius: 0 16px 16px 0;
    font-style: italic;
    color: ${({ theme }) => theme.text_primary};
    font-size: 20px;
    line-height: 1.8;

    @media (max-width: 768px) {
      padding: 16px 20px;
      margin: 24px 0;
      font-size: 16px;
      border-left-width: 3px;
    }
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 600;
    border-bottom: 2px solid ${({ theme }) => theme.primary}40;
    transition: all 0.2s ease;

    &:hover {
      border-bottom-color: ${({ theme }) => theme.primary};
      background: ${({ theme }) => theme.primary}15;
      border-radius: 4px;
      padding: 0 4px;
      margin: 0 -4px;
    }
  }

    img {
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 800px;
    object-fit: contain;
    border-radius: 12px;
    margin: 40px 0;
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.25),
      0 4px 16px rgba(0, 0, 0, 0.15);
    background: ${({ theme }) => theme.bg};
    border: 1px solid ${({ theme }) => theme.primary}20;
    
    @media (max-width: 768px) {
      margin: 24px 0;
      border-radius: 8px;
    }
  }

  hr {
    border: none;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.primary}50, transparent);
    margin: 56px 0;
    border-radius: 2px;

    @media (max-width: 768px) {
      margin: 32px 0;
    }
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

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: ${({ theme }) => theme.primary}25;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary}45;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12.5px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px ${({ theme }) => theme.primary}15;

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 11px;
    top: 10px;
    right: 10px;
    gap: 4px;
  }

  &:hover {
    background: ${({ theme }) => theme.primary}35;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px ${({ theme }) => theme.primary}25;
    border-color: ${({ theme }) => theme.primary}60;
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorContainer = styled(motion.div)`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  
  .icon-wrapper {
    font-size: 64px;
    color: ${({ theme }) => theme.primary};
    margin-bottom: 24px;
    background: ${({ theme }) => theme.primary}15;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 40px ${({ theme }) => theme.primary}20;
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin-bottom: 16px;
    background: linear-gradient(135deg, ${({ theme }) => theme.text_primary} 0%, ${({ theme }) => theme.primary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (max-width: 768px) {
      font-size: 28px;
    }
  }
  
  p {
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 32px;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  background: ${({ theme }) => theme.bg};
  border-bottom: 1px solid ${({ theme }) => theme.primary}20;
  border-radius: 16px 16px 0 0;
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  color: ${({ theme }) => theme.text_secondary};
`;

const CodeLanguage = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 700;
  text-transform: uppercase;
`;

// Custom renderer for code blocks with copy button
  const CodeBlock = ({ children, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const codeString = String(children).replace(/\n$/, '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(codeString);
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

// Custom renderer for images with lightbox
const ImageRenderer = ({ src, alt, onZoom }) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div style={{ 
        padding: '40px', 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px dashed rgba(255,255,255,0.2)', 
        borderRadius: '12px', 
        textAlign: 'center',
        margin: '40px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <FaTimes style={{ fontSize: '24px', color: '#ff6b6b' }} />
        <p style={{ color: '#ff6b6b', fontSize: '14px', margin: 0 }}>Failed to load image</p>
        {alt && <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{alt}</p>}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => onZoom && onZoom(src)}>
      <img 
        src={src} 
        alt={alt} 
        onError={() => setHasError(true)}
        loading="lazy"
      />
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        right: '20px', 
        background: 'rgba(0,0,0,0.6)', 
        color: 'white', 
        padding: '8px', 
        borderRadius: '8px',
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)'
      }}>
        <FaSearchPlus />
      </div>
    </div>
  );
};

// Custom renderer for headings to add IDs
const HeadingRenderer = ({ level, children }) => {
  const text = children?.[0] || '';
  const id = typeof text === 'string' ? text.toLowerCase().replace(/[^\w]+/g, '-') : '';
  const Tag = `h${level}`;
  return <Tag id={id}>{children}</Tag>;
};

// Custom renderer for paragraphs to avoid <div> inside <p> (hydration error)
const ParagraphRenderer = ({ node, children, ...props }) => {
  const hasImage = node?.children?.some((child) => child.type === "element" && child.tagName === "img");
  if (hasImage) {
    return <div {...props}>{children}</div>;
  }
  return <p {...props}>{children}</p>;
};

export default function ProjectExplanationContent({ id, initialProject = null, initialExplanation = null }) {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [markdownContent, setMarkdownContent] = useState(initialExplanation?.markdown_content || "");
  const [loading, setLoading] = useState(!initialProject);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);

  // Memoize components to prevent re-renders on scroll
  const components = React.useMemo(() => ({
    code: CodeBlock,
    img: (props) => <ImageRenderer {...props} onZoom={setLightboxImage} />,
    p: ParagraphRenderer,
    h1: ({node, ...props}) => <HeadingRenderer level={1} {...props} />,
    h2: ({node, ...props}) => <HeadingRenderer level={2} {...props} />,
    h3: ({node, ...props}) => <HeadingRenderer level={3} {...props} />,
    table: MarkdownTable,
  }), []); // Empty dependency array as setLightboxImage is stable from useState

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // If we have initial data, we don't need to fetch
    if (initialProject) {
      if (!initialProject) {
        setError("Project not found");
      } else if (!initialExplanation) {
        // It's possible to have a project but no explanation yet
        // We don't necessarily want to show an error, maybe just empty content or a message
        // But if the server returned null for explanation, we can assume it's not there
      }
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [projectResult, explanationResult] = await Promise.all([
          fetchSingleProjectClient(id),
          fetchProjectExplanationClient(id)
        ]);
        
        if (projectResult.error || !projectResult.data) {
          setError("Project not found");
          return;
        }
        
        setProject(projectResult.data);
        
        if (explanationResult.error || !explanationResult.data) {
          setError("No detailed explanation available for this project yet");
          return;
        }
        
        setMarkdownContent(explanationResult.data.markdown_content);
        
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, initialProject, initialExplanation]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [toc, setToc] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [lightboxImage, setLightboxImage] = useState(null);

  // Generate TOC from markdown content
  useEffect(() => {
    if (!markdownContent) return;
    
    const headings = markdownContent.match(/^#{1,3} .+/gm);
    if (headings) {
      const tocItems = headings.map((heading, index) => {
        const level = heading.match(/^#+/)[0].length;
        const text = heading.replace(/^#+ /, '');
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        return { id, text, level };
      });
      setToc(tocItems);
    }
  }, [markdownContent]);

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
  }, [markdownContent]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <h3 style={{ marginTop: 20 }}>Loading project details...</h3>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <BackButton
              onClick={() => router.push("/projects")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft /> Back to Projects
            </BackButton>
          </HeaderLeft>
        </Header>
        <ErrorContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="icon-wrapper">
            <FaCode />
          </div>
          <h2>Project Details Unavailable</h2>
          <p>{error}</p>
          <ActionBtn
            as="button"
            onClick={() => router.push("/projects")}
            $primary
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Other Projects
          </ActionBtn>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <ProgressBar
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
      />

      <Header>
        <HeaderLeft>
          <BackButton
            onClick={() => router.push("/projects")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Back
          </BackButton>
        </HeaderLeft>

        <HeaderActions>
          {project?.github && (
            <ActionBtn
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
            >
              <FaGithub /> Code
            </ActionBtn>
          )}
          {project?.dashboard && project.dashboard !== "#" && (
            <ActionBtn
              href={project.dashboard}
              target="_blank"
              rel="noopener noreferrer"
              $primary
              whileHover={{ scale: 1.05 }}
            >
              <FaExternalLinkAlt /> Demo
            </ActionBtn>
          )}
        </HeaderActions>
      </Header>

      {project && (
        <HeroSection>
          <HeroImage src={project.image} alt={project.title} />
          <HeroContent>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectTags>
              {project.tags?.map(tag => (
                <ProjectTag key={tag}>{tag}</ProjectTag>
              ))}
            </ProjectTags>
          </HeroContent>
        </HeroSection>
      )}

      <MainContent>
        <ArticleContainer ref={contentRef}>
          <MarkdownContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {markdownContent}
            </ReactMarkdown>
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
