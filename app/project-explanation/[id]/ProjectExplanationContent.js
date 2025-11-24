"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaCode, FaArrowUp, FaCopy, FaCheck } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 40px;

  @media (max-width: 1200px) {
    flex-direction: column;
    padding: 20px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const ArticleContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const MarkdownContainer = styled(motion.div)`
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
  
  @media (max-width: 768px) {
    padding: 24px 16px;
    border-radius: 20px;
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
    max-width: 100%;
    height: auto;
    border-radius: 20px;
    margin: 40px 0;
    box-shadow: 
      0 12px 48px rgba(0, 0, 0, 0.25),
      0 4px 16px rgba(0, 0, 0, 0.15);
    
    @media (max-width: 768px) {
      margin: 24px 0;
      border-radius: 12px;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 36px 0;
    font-size: 15.5px;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    display: block;
    overflow-x: auto;
    white-space: nowrap;

    @media (max-width: 768px) {
      margin: 24px 0;
      font-size: 14px;
    }

    th, td {
      padding: 18px;
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.text_secondary}25;

      @media (max-width: 768px) {
        padding: 12px;
      }
    }

    th {
      background: ${({ theme }) => theme.primary}22;
      color: ${({ theme }) => theme.text_primary};
      font-weight: 700;
      font-size: 16px;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }

    tr:hover {
      background: ${({ theme }) => theme.primary}08;
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

export default function ProjectExplanationContent({ project, markdownContent, error }) {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef(null);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!', {
      duration: 2000,
      style: {
        background: '#333',
        color: '#fff',
      },
    });
  };

  // Custom renderer for code blocks with copy button
  const CodeBlock = ({ children, ...props }) => {
    const codeString = String(children).replace(/\n$/, '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      copyCode(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <pre>
        <CopyButton onClick={handleCopy}>
          {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy</>}
        </CopyButton>
        <code {...props}>{children}</code>
      </pre>
    );
  };

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
                pre: CodeBlock,
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </MarkdownContainer>
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
    </Container>
  );
}
