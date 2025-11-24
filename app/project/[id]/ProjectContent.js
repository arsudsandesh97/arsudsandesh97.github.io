"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion } from "framer-motion";
import { fetchSingleProjectClient, fetchProjectExplanationClient } from "@/lib/api/supabase-client";
import { FaArrowLeft } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  padding-top: 80px;
  position: relative;
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 100px;
  left: 40px;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + "40"};
  color: ${({ theme }) => theme.primary};
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    transform: translateX(-5px);
  }

  @media (max-width: 768px) {
    top: 70px;
    left: 16px;
    padding: 10px 16px;
    font-size: 14px;
  }
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 40px 80px;
  
  @media (max-width: 768px) {
    padding: 20px 20px 40px;
  }
`;

const MarkdownContainer = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.primary + "20"};
  border-radius: 20px;
  padding: 60px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    padding: 30px 20px;
    border-radius: 16px;
  }

  /* Markdown Styling */
  h1 {
    font-size: 42px;
    font-weight: 800;
    color: ${({ theme }) => theme.text_primary};
    margin: 0 0 24px 0;
    line-height: 1.2;
    background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primary}80);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 32px;
    }
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    margin: 48px 0 20px 0;
    padding-bottom: 12px;
    border-bottom: 2px solid ${({ theme }) => theme.primary + "30"};
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      font-size: 24px;
      margin: 36px 0 16px 0;
    }
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
    margin: 32px 0 16px 0;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  h4 {
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_secondary};
    margin: 24px 0 12px 0;
  }

  p {
    font-size: 18px;
    line-height: 1.8;
    color: ${({ theme }) => theme.text_secondary};
    margin: 0 0 20px 0;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  ul, ol {
    font-size: 18px;
    line-height: 1.8;
    color: ${({ theme }) => theme.text_secondary};
    margin: 0 0 20px 0;
    padding-left: 28px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  li {
    margin: 8px 0;
    padding-left: 8px;
  }

  ul li::marker {
    color: ${({ theme }) => theme.primary};
  }

  ol li::marker {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
  }

  code {
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.primary};
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.9em;
    font-family: 'Courier New', monospace;
    border: 1px solid ${({ theme }) => theme.primary + "30"};
  }

  pre {
    background: ${({ theme }) => theme.bg};
    border: 1px solid ${({ theme }) => theme.primary + "30"};
    border-radius: 12px;
    padding: 20px;
    overflow-x: auto;
    margin: 24px 0;

    code {
      background: none;
      border: none;
      padding: 0;
      color: ${({ theme }) => theme.text_primary};
    }
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.primary};
    padding: 16px 20px;
    margin: 24px 0;
    background: ${({ theme }) => theme.primary + "10"};
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: ${({ theme }) => theme.text_secondary};
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid ${({ theme }) => theme.primary + "40"};
    transition: all 0.2s ease;

    &:hover {
      border-bottom-color: ${({ theme }) => theme.primary};
      color: ${({ theme }) => theme.primary}dd;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 24px 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    font-size: 16px;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid ${({ theme }) => theme.text_secondary + "30"};
    }

    th {
      background: ${({ theme }) => theme.primary + "20"};
      color: ${({ theme }) => theme.text_primary};
      font-weight: 600;
    }

    tr:hover {
      background: ${({ theme }) => theme.primary + "05"};
    }
  }

  hr {
    border: none;
    height: 1px;
    background: ${({ theme }) => theme.text_secondary + "30"};
    margin: 40px 0;
  }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text_primary};
  font-size: 20px;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  
  h2 {
    font-size: 32px;
    color: ${({ theme }) => theme.text_primary};
    margin-bottom: 16px;
  }
  
  p {
    font-size: 18px;
    color: ${({ theme }) => theme.text_secondary};
    margin-bottom: 32px;
  }
`;

export default function ProjectContent({ id }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both project info and explanation
        const [projectResult, explanationResult] = await Promise.all([
          fetchSingleProjectClient(id),
          fetchProjectExplanationClient(id)
        ]);
        
        if (projectResult.error) {
          setError("Failed to load project");
          return;
        }
        
        if (!projectResult.data) {
          setError("Project not found");
          return;
        }
        
        setProject(projectResult.data);
        
        if (explanationResult.error || !explanationResult.data) {
          setError("No detailed explanation available for this project");
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
  }, [id]);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading project explanation...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <h2>Unable to Load</h2>
          <p>{error}</p>
          <BackButton
            onClick={() => router.push("/projects")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft /> Back to Projects
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton
        onClick={() => router.push("/projects")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Back
      </BackButton>

      <Content>
        <MarkdownContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownContent}
          </ReactMarkdown>
        </MarkdownContainer>
      </Content>
   </Container>
  );
}
