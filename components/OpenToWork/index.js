"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import {
  WidgetContainer,
  MinimalWidget,
  StatusDot,
  StatusText,
  ExpandedWidget,
  WidgetHeader,
  HeaderLeft,
  CloseButton,
  ProfileSection,
  ProfileImage,
  ProfileInfo,
  ProfileName,
  ProfileRole,
  StatusBadge,
  Section,
  SectionTitle,
  TagsContainer,
  Tag,
  InfoGrid,
  InfoItem,
  InfoIcon,
  InfoContent,
  InfoLabel,
  InfoValue,
  ContactMethods,
  ContactButton,
  ContactIcon,
  ContactInfo,
  ContactLabel,
  ContactValue,
  ArrowIcon,
  Divider,
  FooterActions,
  PrimaryButton,
  SecondaryButton,
  AvailabilityBadge,
  FresherBadge,
} from "./OpenToWorkStyle";

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const expandedVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Experience type display mapping
const getExperienceIcon = (type) => {
  switch (type) {
    case 'fresher':
      return '🎓';
    case 'entry':
      return '🌱';
    case 'junior':
      return '📈';
    case 'mid':
      return '💼';
    case 'senior':
      return '⭐';
    case 'lead':
      return '👑';
    default:
      return '🎯';
  }
};

/**
 * OpenToWork Widget Component - Recruiter-Friendly Version
 * 
 * A comprehensive floating widget that displays professional details
 * for recruiters with real-time updates from Supabase.
 */
const OpenToWork = ({
  position = "bottom-right",
  bioData = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const widgetRef = useRef(null);

  // Default profile data (can be overridden by Supabase settings)
  const defaultProfile = {
    name: bioData?.name || "Sandesh Arsud",
    role: "Data Analyst",
    image: bioData?.Image || "https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/public/Portfolio/Icons%20and%20Logos/Sandesh%20Arsud.jpg",
    location: "India",
    experienceType: "fresher",
    experienceDisplay: "Fresher",
    availability: "Immediate",
    jobTypes: ["Full-time", "Internship", "Remote"],
    preferredRoles: ["Data Analyst", "Business Analyst", "Junior Data Analyst"],
    skills: ["Power BI", "SQL", "Python", "Excel", "Tableau"],
    email: bioData?.email || "sandesh.arsud@gmail.com",
    linkedin: bioData?.linkedin || "https://www.linkedin.com/in/sandesharsud",
    twitter: bioData?.twitter,
    resume: bioData?.resume,
    message: "Passionate Data Analyst seeking my first professional opportunity. Eager to apply my analytical skills and drive data-driven insights.",
  };

  // Fetch initial visibility state from Supabase
  const fetchVisibilityState = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("open_to_work_settings")
        .select("*")
        .single();

      if (error) {
        console.warn("OpenToWork settings not found:", error.message);
        setIsVisible(false);
      } else if (data) {
        setSettings(data);
        setIsVisible(data.is_visible ?? false);
      }
    } catch (err) {
      console.error("Error fetching OpenToWork settings:", err);
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    fetchVisibilityState();

    const channel = supabase
      .channel("open_to_work_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "open_to_work_settings",
        },
        (payload) => {
          console.log("OpenToWork settings changed:", payload);
          if (payload.new) {
            setSettings(payload.new);
            setIsVisible(payload.new.is_visible ?? false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVisibilityState]);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isExpanded]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  // Merge settings from Supabase with defaults
  const profile = {
    ...defaultProfile,
    ...(settings?.custom_message && { message: settings.custom_message }),
    ...(settings?.location && { location: settings.location }),
    ...(settings?.experience_type && { experienceType: settings.experience_type }),
    ...(settings?.experience_display && { experienceDisplay: settings.experience_display }),
    ...(settings?.availability && { availability: settings.availability }),
    ...(settings?.contact_email && { email: settings.contact_email }),
    ...(settings?.linkedin_url && { linkedin: settings.linkedin_url }),
    ...(settings?.twitter_url && { twitter: settings.twitter_url }),
    ...(settings?.job_types && { jobTypes: settings.job_types }),
    ...(settings?.preferred_roles && { preferredRoles: settings.preferred_roles }),
    ...(settings?.skills && { skills: settings.skills }),
  };

  const isFresher = profile.experienceType === 'fresher' || profile.experienceType === 'entry';

  if (isLoading || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <WidgetContainer
        ref={widgetRef}
        $position={position}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        role="complementary"
        aria-label="Open to work status widget"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <MinimalWidget
              key="minimal"
              onClick={() => setIsExpanded(true)}
              variants={expandedVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Click to view professional details - Currently open to work"
              aria-expanded="false"
            >
              <StatusDot aria-hidden="true" />
              <StatusText>Open to Work</StatusText>
            </MinimalWidget>
          ) : (
            <ExpandedWidget
              key="expanded"
              variants={expandedVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-labelledby="widget-title"
            >
              {/* Header */}
              <WidgetHeader>
                <HeaderLeft>
                  <StatusBadge>
                    <StatusDot style={{ width: 8, height: 8 }} />
                    Actively Looking
                  </StatusBadge>
                </HeaderLeft>
                <CloseButton
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close panel"
                >
                  ✕
                </CloseButton>
              </WidgetHeader>

              {/* Profile Section */}
              <ProfileSection>
                <ProfileImage
                  src={profile.image}
                  alt={profile.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=22c55e&color=fff&size=80`;
                  }}
                />
                <ProfileInfo>
                  <ProfileName id="widget-title">{profile.name}</ProfileName>
                  <ProfileRole>{profile.role}</ProfileRole>
                  <AvailabilityBadge>
                    ⚡ Available {profile.availability}
                  </AvailabilityBadge>
                </ProfileInfo>
              </ProfileSection>

              <Divider />

              {/* Quick Info - Location & Experience */}
              <InfoGrid>
                <InfoItem>
                  <InfoIcon>📍</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Location</InfoLabel>
                    <InfoValue>{profile.location}</InfoValue>
                  </InfoContent>
                </InfoItem>
                <InfoItem $highlight={isFresher}>
                  <InfoIcon>{getExperienceIcon(profile.experienceType)}</InfoIcon>
                  <InfoContent>
                    <InfoLabel>Experience</InfoLabel>
                    <InfoValue>{profile.experienceDisplay}</InfoValue>
                  </InfoContent>
                </InfoItem>
              </InfoGrid>


              {/* Custom Message Badge */}
              {profile.message && (
                <FresherBadge>
                  {profile.message}
                </FresherBadge>
              )}

              {/* Looking For */}
              <Section>
                <SectionTitle>🎯 Looking For</SectionTitle>
                <TagsContainer>
                  {profile.preferredRoles.map((role, index) => (
                    <Tag key={index} $variant="primary">
                      {role}
                    </Tag>
                  ))}
                </TagsContainer>
              </Section>

              {/* Job Types */}
              <Section>
                <SectionTitle>📋 Job Type</SectionTitle>
                <TagsContainer>
                  {profile.jobTypes.map((type, index) => (
                    <Tag key={index} $variant="secondary">
                      {type}
                    </Tag>
                  ))}
                </TagsContainer>
              </Section>

              {/* Key Skills */}
              <Section>
                <SectionTitle>🛠️ Key Skills</SectionTitle>
                <TagsContainer>
                  {profile.skills.map((skill, index) => (
                    <Tag key={index} $variant="skill">
                      {skill}
                    </Tag>
                  ))}
                </TagsContainer>
              </Section>

              <Divider />

              {/* Contact Methods */}
              <Section>
                <SectionTitle>📬 Get in Touch</SectionTitle>
                <ContactMethods>
                  {profile.email && (
                    <ContactButton
                      href={`mailto:${profile.email}?subject=Job Opportunity - ${profile.role}&body=Hi ${profile.name.split(' ')[0]},%0D%0A%0D%0AI came across your portfolio and would like to discuss a potential opportunity.%0D%0A%0D%0A`}
                      $variant="email"
                      aria-label={`Send email to ${profile.email}`}
                    >
                      <ContactIcon $variant="email">✉️</ContactIcon>
                      <ContactInfo>
                        <ContactLabel>Email</ContactLabel>
                        <ContactValue>{profile.email}</ContactValue>
                      </ContactInfo>
                      <ArrowIcon>→</ArrowIcon>
                    </ContactButton>
                  )}

                  {profile.linkedin && (
                    <ContactButton
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      $variant="linkedin"
                      aria-label="View LinkedIn profile"
                    >
                      <ContactIcon $variant="linkedin">💼</ContactIcon>
                      <ContactInfo>
                        <ContactLabel>LinkedIn</ContactLabel>
                        <ContactValue>Connect with me</ContactValue>
                      </ContactInfo>
                      <ArrowIcon>→</ArrowIcon>
                    </ContactButton>
                  )}
                </ContactMethods>
              </Section>

              {/* Footer Actions */}
              <FooterActions>
                {profile.resume && (
                  <PrimaryButton
                    href={profile.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📄 Download Resume
                  </PrimaryButton>
                )}
                <SecondaryButton href="#contact">
                  💬 Send Message
                </SecondaryButton>
              </FooterActions>
            </ExpandedWidget>
          )}
        </AnimatePresence>
      </WidgetContainer>
    </AnimatePresence>
  );
};

export default React.memo(OpenToWork);
