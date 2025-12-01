"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
  align-items: center;
  padding: 100px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 80px 16px 80px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ShareButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${({ theme }) => theme.primary + 99};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const IframeContainer = styled.div`
  width: 100%;
  height: 80vh;
  background: ${({ theme }) => theme.card};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.text_primary + 15};
  position: relative;
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  padding: 20px;

  h3 {
    font-size: 24px;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.text_primary};
  }

  p {
    font-size: 16px;
    max-width: 500px;
    line-height: 1.5;
  }
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

function DashboardContent() {
  const searchParams = useSearchParams();
  const [dashboardUrl, setDashboardUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = searchParams.get("url");
    if (url) {
      setDashboardUrl(url);
    }
  }, [searchParams]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Container>
      <Navbar />
      <MobileBottomNav />
      <ContentWrapper>
        <Header>
          <Title>Power BI Dashboard</Title>
          {dashboardUrl && (
            <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
              <ShareButton>
                {copied ? "Link Copied!" : "Share Dashboard"}
              </ShareButton>
            </CopyToClipboard>
          )}
        </Header>

        <IframeContainer>
          {dashboardUrl ? (
            <StyledIframe
              title="Power BI Dashboard"
              src={dashboardUrl}
              allowFullScreen={true}
            />
          ) : (
            <Placeholder>
              <h3>No Dashboard Selected</h3>
              <p>
                To view a dashboard, please provide a valid Power BI report URL via
                the 'url' query parameter.
                <br />
                <br />
                Example: <code>/dashboard?url=https://app.powerbi.com/...</code>
              </p>
            </Placeholder>
          )}
        </IframeContainer>
      </ContentWrapper>
      <Footer />
    </Container>
  );
}

export default function DashboardClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
