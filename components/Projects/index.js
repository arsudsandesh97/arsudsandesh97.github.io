"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import { Container, Wrapper, Title } from "./ProjectsStyle";
import ProjectCard from "../Cards/ProjectCards";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProjectsClient } from "@/lib/api/supabase-client";

// Add these animation variants at the top after your imports
const popUpVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

// Add these animation variants at the top
const mobileNavVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: { scale: 0.95 },
};

// Add this animation variant
const categoryVariants = {
  enter: {
    x: 50,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    x: -50,
    opacity: 0,
  },
};

// Update the CardContainer styling
const CardContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 330px));
  gap: 32px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  justify-content: center;
  align-items: start;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 330px));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 16px;
    justify-items: center;
  }
`;

// Update the ToggleButtonGroup styling
const ToggleButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${({ theme }) => theme.card};
  border: 1.5px solid ${({ theme }) => theme.primary + "40"};
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  border-radius: 16px;
  padding: 8px;
  margin: 28px auto;
  max-width: 800px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    width: 90%;
    padding: 12px;
    justify-content: space-between;
    gap: 8px;
  }
`;

// Add the NavigationArrow component
const NavigationArrow = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.primary + "15"};
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary + "30"};
  }

  @media (max-width: 768px) {
    font-size: 20px;
    width: 36px;
    height: 36px;
  }
`;

// Update the ToggleButton styling
const ToggleButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  background: ${({ active, theme }) =>
    active ? theme.primary : "transparent"};
  color: ${({ active, theme }) => (active ? theme.white : theme.primary)};
  cursor: pointer;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

// Update the Divider styling
const Divider = styled.div`
  width: 1.5px;
  background: ${({ theme }) => theme.primary};
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 20px;
    align-self: center;
  }
`;

// Skeleton components for loading state
const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.card_light}50;
  border: 1px solid ${({ theme }) => theme.primary}15;
  border-radius: 16px;
  padding: 20px;
  height: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonElement = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.card_light}40 0%,
    ${({ theme }) => theme.card_light}60 50%,
    ${({ theme }) => theme.card_light}40 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
  border-radius: ${({ radius }) => radius || "8px"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "20px"};
`;


const Projects = ({ openModal, setOpenModal, initialData }) => {
  const [toggle, setToggle] = useState("All");
  const [projects, setProjects] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const toggleGroupRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Add this handleMobileNavigation function
  const handleMobileNavigation = (direction) => {
    const categories = [
      "All",
      ...new Set(projects.map((project) => project.category)),
    ];
    const currentIndex = categories.indexOf(toggle);
    let newIndex;

    if (direction === "right") {
      newIndex = (currentIndex + 1) % categories.length;
    } else {
      newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = categories.length - 1;
    }

    setToggle(categories[newIndex]);
  };

  // Debug: Monitor loading state changes
  useEffect(() => {
    console.log("Loading state changed to:", loading);
  }, [loading]);

  // Debug: Monitor projects state changes
  useEffect(() => {
    console.log("Projects state changed, count:", projects.length);
  }, [projects]);

  // Update the containerVariants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Add the titleVariants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    if (initialData) {
      setProjects(initialData);
      setLoading(false);
      return;
    }

    const fetchProjectsData = async () => {
      try {
        console.log("Starting to fetch projects, setting loading to true");
        setLoading(true);
        const { data, error } = await fetchProjectsClient();
        if (error) {
          console.error("Error fetching projects:", error);
          setProjects([]);
        } else {
          console.log("Project data:", data);
          console.log("Number of projects:", data?.length);
          setProjects(data || []);
        }
      } catch (err) {
        console.error("Exception fetching projects:", err);
        setProjects([]);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };
    fetchProjectsData();
  }, [initialData]);

  const checkScroll = () => {
    if (toggleGroupRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = toggleGroupRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const toggleGroup = toggleGroupRef.current;
    if (toggleGroup) {
      toggleGroup.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => toggleGroup.removeEventListener("scroll", checkScroll);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check initial size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <Container id="projects">
        <Wrapper>
          <Title>Projects</Title>
          <ToggleButtonGroup>
            <SkeletonElement width="80px" height="40px" radius="12px" />
            <Divider />
            <SkeletonElement width="100px" height="40px" radius="12px" />
            <Divider />
            <SkeletonElement width="90px" height="40px" radius="12px" />
          </ToggleButtonGroup>
          <CardContainer>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i}>
                <SkeletonElement height="200px" radius="12px" />
                <SkeletonElement width="80%" height="24px" />
                <SkeletonElement width="100%" height="16px" />
                <SkeletonElement width="90%" height="16px" />
                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  <SkeletonElement width="60px" height="28px" radius="50px" />
                  <SkeletonElement width="70px" height="28px" radius="50px" />
                  <SkeletonElement width="65px" height="28px" radius="50px" />
                </div>
              </SkeletonCard>
            ))}
          </CardContainer>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container id="projects">
      <Wrapper>
        <Title
          as={motion.h1}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Projects
        </Title>
        <ToggleButtonGroup ref={toggleGroupRef}>
          {isMobile ? (
            <>
              <NavigationArrow
                variants={mobileNavVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleMobileNavigation("left")}
              >
                &lt;
              </NavigationArrow>
              <AnimatePresence mode="wait">
                <ToggleButton
                  key={toggle}
                  variants={categoryVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  active={true}
                >
                  {toggle}
                </ToggleButton>
              </AnimatePresence>
              <NavigationArrow
                variants={mobileNavVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleMobileNavigation("right")}
              >
                &gt;
              </NavigationArrow>
            </>
          ) : (
            <>
              {(() => {
                const categories = [
                  "All",
                  ...new Set(projects.map((project) => project.category)),
                ];
                return categories.map((category, index) => (
                  <Fragment key={category}>
                    <ToggleButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      active={toggle === category}
                      onClick={() => setToggle(category)}
                    >
                      {category}
                    </ToggleButton>
                    {index !== categories.length - 1 && <Divider />}
                  </Fragment>
                ));
              })()}
            </>
          )}
        </ToggleButtonGroup>
        <CardContainer
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          layout
        >
          {projects
            .filter(
              (project) => toggle === "All" || project.category === toggle
            )
            .map((project) => (
              <motion.div
                key={project.id}
                variants={popUpVariants}
                layout
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 300 },
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <ProjectCard
                  project={project}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              </motion.div>
            ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
};

export default Projects;
