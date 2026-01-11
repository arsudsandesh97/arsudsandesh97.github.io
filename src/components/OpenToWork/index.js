"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { supabase } from "../../supabaseClient";
import {
  WidgetContainer,
  MinimalWidget,
  StatusDot,
  StatusText,
  ExpandedWidget,
  WidgetHeader,
  HeaderLeft,
  HeaderTitle,
  OpenBadge,
  CloseButton,
  WidgetDescription,
  ContactMethods,
  ContactButton,
  ContactIcon,
  ContactInfo,
  ContactLabel,
  ContactValue,
  ArrowIcon,
  Divider,
  FooterNote,
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

/**
 * OpenToWork Widget Component
 * 
 * A customizable floating widget that displays "Open to Work" status
 * with real-time updates from Supabase.
 * 
 * @param {Object} props
 * @param {string} props.position - Widget position: "bottom-left" or "bottom-right"
 * @param {Object} props.contactInfo - Contact information to display
 * @param {string} props.contactInfo.email - Email address
 * @param {string} props.contactInfo.linkedin - LinkedIn URL
 * @param {string} props.contactInfo.twitter - Twitter/X URL
 * @param {string} props.message - Custom message to display
 */
const OpenToWork = ({
  position = "bottom-right",
  contactInfo = {},
  message = "I'm currently available for new opportunities and excited to connect with recruiters and hiring managers.",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const widgetRef = useRef(null);

  // Fetch initial visibility state from Supabase
  const fetchVisibilityState = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("open_to_work_settings")
        .select("*")
        .single();

      if (error) {
        // Table might not exist yet, default to hidden
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

    // Subscribe to real-time updates
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

  // Handle click outside to collapse expanded widget
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

  // Handle escape key to close expanded widget
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  // Merge settings from Supabase with props
  const mergedContactInfo = {
    email: settings?.contact_email || contactInfo.email,
    linkedin: settings?.linkedin_url || contactInfo.linkedin,
    twitter: settings?.twitter_url || contactInfo.twitter,
  };

  const displayMessage = settings?.custom_message || message;

  // Don't render if not visible or still loading
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
              aria-label="Click to view contact options - Currently open to work"
              aria-expanded="false"
              aria-controls="open-to-work-panel"
            >
              <StatusDot aria-hidden="true" />
              <StatusText>Open to Work</StatusText>
            </MinimalWidget>
          ) : (
            <ExpandedWidget
              key="expanded"
              id="open-to-work-panel"
              variants={expandedVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-labelledby="widget-title"
              aria-describedby="widget-description"
            >
              <WidgetHeader>
                <HeaderLeft>
                  <HeaderTitle id="widget-title">
                    <OpenBadge>
                      <StatusDot style={{ width: 8, height: 8 }} />
                      Open
                    </OpenBadge>
                  </HeaderTitle>
                </HeaderLeft>
                <CloseButton
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close contact panel"
                >
                  ✕
                </CloseButton>
              </WidgetHeader>

              <WidgetDescription id="widget-description">
                {displayMessage}
              </WidgetDescription>

              <ContactMethods role="list" aria-label="Contact methods">
                {mergedContactInfo.email && (
                  <ContactButton
                    href={`mailto:${mergedContactInfo.email}`}
                    $variant="email"
                    role="listitem"
                    aria-label={`Send email to ${mergedContactInfo.email}`}
                  >
                    <ContactIcon $variant="email" aria-hidden="true">
                      ✉️
                    </ContactIcon>
                    <ContactInfo>
                      <ContactLabel>Email</ContactLabel>
                      <ContactValue>{mergedContactInfo.email}</ContactValue>
                    </ContactInfo>
                    <ArrowIcon aria-hidden="true">→</ArrowIcon>
                  </ContactButton>
                )}

                {mergedContactInfo.linkedin && (
                  <ContactButton
                    href={mergedContactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    $variant="linkedin"
                    role="listitem"
                    aria-label="View LinkedIn profile (opens in new tab)"
                  >
                    <ContactIcon $variant="linkedin" aria-hidden="true">
                      💼
                    </ContactIcon>
                    <ContactInfo>
                      <ContactLabel>LinkedIn</ContactLabel>
                      <ContactValue>Connect on LinkedIn</ContactValue>
                    </ContactInfo>
                    <ArrowIcon aria-hidden="true">→</ArrowIcon>
                  </ContactButton>
                )}

                {mergedContactInfo.twitter && (
                  <ContactButton
                    href={mergedContactInfo.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    $variant="twitter"
                    role="listitem"
                    aria-label="View Twitter/X profile (opens in new tab)"
                  >
                    <ContactIcon $variant="twitter" aria-hidden="true">
                      🐦
                    </ContactIcon>
                    <ContactInfo>
                      <ContactLabel>Twitter / X</ContactLabel>
                      <ContactValue>Message on X</ContactValue>
                    </ContactInfo>
                    <ArrowIcon aria-hidden="true">→</ArrowIcon>
                  </ContactButton>
                )}
              </ContactMethods>

              <Divider />

              <FooterNote>
                💡 Looking for Data Analyst roles • Available to start immediately
              </FooterNote>
            </ExpandedWidget>
          )}
        </AnimatePresence>
      </WidgetContainer>
    </AnimatePresence>
  );
};

export default React.memo(OpenToWork);
