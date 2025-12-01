"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { FaChartBar, FaArrowRight } from "react-icons/fa";

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
  padding: 120px 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 100px 16px 80px;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 48px;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.secondary || theme.text_primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Card = styled(Link)`
  background: ${({ theme }) => theme.card};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.text_primary + 10};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    border-color: ${({ theme }) => theme.primary + 40};

    .card-image {
      transform: scale(1.05);
    }
    
    .arrow-icon {
      transform: translateX(4px);
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const ImageContainer = styled.div`
  height: 220px;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-color: ${({ theme }) => theme.bgLight};
`;

const CardImage = styled.div`
  height: 100%;
  width: 100%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
  class-name: "card-image";
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.2) 100%);
`;

const CardContent = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.3;
  flex: 1;
  padding-right: 12px;
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 20px;
  margin-top: 4px;
  transition: all 0.3s ease;
  
  &.arrow-icon {
    font-size: 18px;
  }
`;

const CardDescription = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.text_primary + 10};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 18px;
`;

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboards() {
      try {
        const response = await fetch("/data/dashboards.json");
        if (response.ok) {
          const data = await response.json();
          setDashboards(data.data || []);
        } else {
          console.error("Failed to fetch dashboards.json");
        }
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboards();
  }, []);

  return (
    <Container>
      <Navbar />
      <MobileBottomNav />
      <ContentWrapper>
        <HeaderSection>
          <Title>Power BI Dashboards</Title>
          <Subtitle>
            Explore my collection of interactive data visualizations. 
            These dashboards demonstrate my ability to transform complex data into actionable insights.
          </Subtitle>
        </HeaderSection>

        {loading ? (
          <LoadingState>Loading dashboards...</LoadingState>
        ) : (
          <Grid>
            {dashboards.map((dashboard) => (
              <Card
                key={dashboard.id}
                href={`/dashboards/${dashboard.slug}`}
              >
                <ImageContainer>
                  <CardImage
                    className="card-image"
                    src={
                      dashboard.image_url ||
                      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                    }
                  />
                  <Overlay />
                </ImageContainer>
                <CardContent>
                  <CardHeader>
                    <CardTitle>{dashboard.title}</CardTitle>
                    <IconWrapper className="arrow-icon">
                      <FaArrowRight />
                    </IconWrapper>
                  </CardHeader>
                  <CardDescription>{dashboard.description}</CardDescription>
                  {dashboard.tags && (
                    <Tags>
                      {dashboard.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </Tags>
                  )}
                </CardContent>
              </Card>
            ))}
          </Grid>
        )}
      </ContentWrapper>
      <Footer />
    </Container>
  );
}
