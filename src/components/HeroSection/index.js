import React, { useEffect, useState, Suspense } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import styled, { useTheme } from "styled-components";
import { fetchBioData } from "../../api/supabase";
// import _default from "../../themes/default";
import {
  headContainerAnimation,
  headContentAnimation,
  headTextAnimation,
} from "../../utils/motion";
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
  ResumeButton,
  FloatingImage,
  ImageContainer,
} from "./HeroStyle";

// Lazy load non-critical components
const Typewriter = React.lazy(() => import("typewriter-effect"));
const Tilt = React.lazy(() =>
  import("react-tilt").then((mod) => ({ default: mod.Tilt }))
);
const HeroBgAnimation = React.lazy(() => import("../HeroBgAnimation"));
// const StarCanvas = React.lazy(() => import("../canvas/Stars"));

const HeroSection = ({ bioData: initialBioData }) => {
  const [bioData, setBioData] = useState(initialBioData || {});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();

  const placeholderImage = `https://placehold.co/400x400/1d1836/ffffff?text=${bioData.name?.charAt(
    0
  ) || "?"}`;

  // Update state if prop changes (though unlikely in static export)
  useEffect(() => {
    if (initialBioData) {
      setBioData(initialBioData);
    }
  }, [initialBioData]);

  // Fetch bio data only if not provided via props
  useEffect(() => {
    if (initialBioData) return; // Skip if we have data

    const fetchBio = async () => {
      // Try loading from local JSON first
      try {
        const response = await fetch('/data/profile.json', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const jsonData = await response.json();
          console.log('✓ Loaded profile from local JSON');
          setBioData(jsonData.data || {});
          return;
        }
      } catch (error) {
        console.warn('Local JSON not found, using Supabase');
      }

      // Fallback to Supabase
      const { data } = await fetchBioData();
      if (data) {
        setBioData(data);
      }
    };

    fetchBio();
  }, [initialBioData]);

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
            <Suspense fallback={null}>
              {/* <StarCanvas /> - Disabled due to WebGL compatibility issues */}
              <HeroBgAnimation />
            </Suspense>
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
                  <TextLoop>
                    <Span>
                      <Suspense fallback={null}>
                        {bioData.roles && (
                          <Typewriter
                            options={{
                              strings: bioData.roles || [],
                              autoStart: true,
                              loop: true,
                              delay: 50,
                            }}
                          />
                        )}
                      </Suspense>
                    </Span>
                  </TextLoop>
                </motion.div>

                <motion.div {...headContentAnimation}>
                  {bioData.description && (
                    <SubTitle>{bioData.description}</SubTitle>
                  )}
                </motion.div>

                <ResumeButton
                  href={bioData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check Resume
                </ResumeButton>
              </HeroLeftContainer>

              <HeroRightContainer>
                <motion.div {...headContentAnimation}>
                  <Suspense fallback={null}>
                    <Tilt options={{ max: 25, scale: 1.05 }}>
                      <FloatingImage
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <ImageContainer>
                          <Img
                            src={imageError ? placeholderImage : bioData.Image}
                            alt={bioData.name || "Profile"}
                            loading="eager"
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
                    </Tilt>
                  </Suspense>
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
