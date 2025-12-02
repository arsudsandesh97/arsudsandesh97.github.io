"use client";

import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { notFound, useRouter } from "next/navigation";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  FaArrowLeft, 
  FaShareAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaCheck, 
  FaExpand, 
  FaCompress,
  FaTags
} from "react-icons/fa";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  background-color: ${({ theme }) => theme.bg};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 120px 20px 60px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 100px 16px 80px;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px 0;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(-4px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;
`;

const TitleSection = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 12px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 24px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  align-items: center;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.text_primary + 15};
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const IframeContainer = styled.div`
  width: 100%;
  height: 85vh;
  min-height: 600px;
  background: ${({ theme }) => theme.card};
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.text_primary + 10};
  position: relative;
  margin-bottom: 40px;
  transition: all 0.3s ease;
  
  ${({ isFullscreen }) => isFullscreen && css`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    z-index: 1000;
    border-radius: 0;
    margin: 0;
    border: none;
  `}

  @media (max-width: 768px) {
    height: 60vh;
    min-height: 400px;
    border-radius: 16px;
    
    ${({ isFullscreen }) => isFullscreen && css`
      border-radius: 0;
    `}
  }
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const FullscreenToggle = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const DescriptionSection = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const MainDescription = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 40px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.text_primary + 10};
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  
  h3 {
    color: ${({ theme }) => theme.text_primary};
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 700;
  }

  /* Markdown Styles */
  .markdown-content {
    color: ${({ theme }) => theme.text_secondary};
    line-height: 1.8;
    font-size: 16px;
    
    h1, h2, h3, h4, h5, h6 {
      color: ${({ theme }) => theme.text_primary};
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 700;
    }

    h1 { font-size: 28px; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }

    p {
      margin-bottom: 16px;
    }

    ul, ol {
      margin-bottom: 16px;
      padding-left: 24px;
    }

    li {
      margin-bottom: 8px;
    }

    a {
      color: ${({ theme }) => theme.primary};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }

    blockquote {
      border-left: 4px solid ${({ theme }) => theme.primary};
      padding-left: 16px;
      margin-left: 0;
      margin-bottom: 16px;
      font-style: italic;
      color: ${({ theme }) => theme.text_secondary}cc;
    }

    code {
      background: ${({ theme }) => theme.bg};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }

    pre {
      background: ${({ theme }) => theme.bg};
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 16px;
      
      code {
        background: transparent;
        padding: 0;
      }
    }
  }
`;

const TagsContainer = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.text_primary + 10};
`;

const TagsLabel = styled.h4`
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.text_primary + 10};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
`;

export default function DashboardView({ dashboard }) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();
  const iframeContainerRef = useRef(null);
  const [shareUrl, setShareUrl] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
    if (dashboard?.created_at) {
      setFormattedDate(new Date(dashboard.created_at).toLocaleDateString());
    }
  }, [dashboard]);

  if (!dashboard) {
    return notFound();
  }

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <Container>
      <Navbar />
      <MobileBottomNav />
      <ContentWrapper>
        <BackButton onClick={() => router.push('/dashboards')}>
          <FaArrowLeft /> Back to Dashboards
        </BackButton>

        <Header>
          <TitleSection>
            <Title>{dashboard.title}</Title>
            <MetaInfo>
              <div>
                <FaUser />
                <span>{dashboard.author || "Sandesh Arsud"}</span>
              </div>
              <div>
                <FaCalendarAlt />
                <span>{formattedDate}</span>
              </div>
            </MetaInfo>
          </TitleSection>
          
          <ActionButtons>
            <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
              <ActionButton>
                {copied ? <FaCheck /> : <FaShareAlt />}
                {copied ? "Link Copied!" : "Share"}
              </ActionButton>
            </CopyToClipboard>
          </ActionButtons>
        </Header>

        <IframeContainer ref={iframeContainerRef} isFullscreen={isFullscreen}>
          <StyledIframe
            title={dashboard.title}
            src={dashboard.embed_url}
            allowFullScreen={true}
          />
          <FullscreenToggle onClick={toggleFullscreen}>
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </FullscreenToggle>
        </IframeContainer>

        <DescriptionSection>
          <MainDescription>
            <h3>About this Dashboard</h3>
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {dashboard.description}
              </ReactMarkdown>
            </div>
            
            {dashboard.tags && (
              <TagsContainer>
                <TagsLabel><FaTags /> Technologies & Tags</TagsLabel>
                <Tags>
                  {dashboard.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </Tags>
              </TagsContainer>
            )}
          </MainDescription>
        </DescriptionSection>
      </ContentWrapper>
      <Footer />
    </Container>
  );
}
