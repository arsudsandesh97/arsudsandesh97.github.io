"use client";

import React, { useEffect, useState } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import styled, { useTheme } from "styled-components";
import { fetchBioDataClient } from "@/lib/api/supabase-client";
import { ArticleOutlined, Email } from "@mui/icons-material";
import Typewriter from "typewriter-effect";
import HeroBgAnimation from "../HeroBgAnimation";
import StarCanvas from "../canvas/Stars";
import SkillsShowcase from "./SkillsShowcase";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from "@/utils/motion";
import {
  HeroContainer,
  HeroBg,
  HeroLeftContainer,
  Img,
  HeroRightContainer,
  HeroInnerContainer,
  TextLoop,
  Title,
  Span,
  SubTitle,
  CTAContainer,
  ResumeButton,
  ContactButton,
  FloatingImage,
  ImageContainer,
} from "./HeroStyle";

const HeroSection = () => {
  const [bioData, setBioData] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const shouldReduceMotion = typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const placeholderImage = `https://placehold.co/400x400/1d1836/ffffff?text=${
    bioData.name?.charAt(0) || "?"
  }`;

  // Prefetch and cache bio data
  useEffect(() => {
    const preFetchData = async () => {
      if (typeof window !== "undefined") {
        const cachedData = sessionStorage.getItem("bioData");
        if (cachedData) {
          setBioData(JSON.parse(cachedData));
          return;
        }
      }

      const { data } = await fetchBioDataClient();
      if (data) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("bioData", JSON.stringify(data));
        }
        setBioData(data);
      }
    };

    preFetchData();
  }, []);

  // Preload hero image
  useEffect(() => {
    if (bioData?.Image) {
      const img = new Image();
      img.src = bioData.Image;
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      img.onerror = () => {
        setImageLoaded(true);
        setImageError(true);
      };
    }
  }, [bioData?.Image]);

  return (
    <LazyMotion features={domAnimation}>
      <div id="about">
        <HeroContainer>
          <HeroBg>
            {!shouldReduceMotion && <StarCanvas />}
            <HeroBgAnimation />
          </HeroBg>

          <motion.div {...headContainerAnimation}>
            <HeroInnerContainer>
              <HeroLeftContainer>
                <motion.div {...headTextAnimation}>
                  <Title>
                    {bioData.name && (
                      <>
                        Hi, I am <br /> {bioData.name}
                      </>
                    )}
                  </Title>
                  <TextLoop aria-live="polite" aria-atomic="true">
                    I am a
                    <Span>
                      <Typewriter
                        options={{
                          strings: bioData.roles || [],
                          autoStart: true,
                          loop: true,
                          delay: 50,
                        }}
                      />
                    </Span>
                  </TextLoop>
                </motion.div>

                <motion.div {...headContentAnimation}>
                  {bioData.description && (
                    <SubTitle>{bioData.description}</SubTitle>
                  )}
                </motion.div>

                <SkillsShowcase />

                <CTAContainer>
                  <ResumeButton
                    href={bioData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArticleOutlined fontSize="small" />
                    Check Resume
                  </ResumeButton>
                  <ContactButton href="#contact">
                    <Email fontSize="small" />
                    Let's Talk
                  </ContactButton>
                </CTAContainer>
              </HeroLeftContainer>

              <HeroRightContainer>
                <motion.div {...headContentAnimation}>
                  <FloatingImage
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      y: shouldReduceMotion ? 0 : [0, -20, 0] 
                    }}
                    transition={{ 
                      duration: 0.8, 
                      ease: "easeOut",
                      y: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    whileHover={!shouldReduceMotion ? { 
                      rotateX: 5, 
                      rotateY: 5,
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    } : {}}
                  >
                    <ImageContainer>
                      <Img
                        src={imageError ? placeholderImage : bioData.Image}
                        alt={bioData.name || "Profile"}
                        loading="eager"
                        fetchPriority="high"
                        width="400"
                        height="400"
                        onError={(e) => {
                          e.target.src = placeholderImage;
                          setImageError(true);
                        }}
                        style={{
                          opacity: imageLoaded ? 1 : 0,
                          transition: "opacity 0.3s ease-in-out",
                          backgroundColor: theme.card_light,
                        }}
                      />
                    </ImageContainer>
                  </FloatingImage>
                </motion.div>
              </HeroRightContainer>
            </HeroInnerContainer>
          </motion.div>
        </HeroContainer>
      </div>
    </LazyMotion>
  );
};

export default React.memo(HeroSection);
