"use client";

import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import { supabase } from "@/lib/supabase/client";
import { getEmailJSConfig, isEmailJSConfigured } from "./emailConfig";
import {
  canSendEmail,
  incrementEmailCount,
} from "@/utils/emailLimiter";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  @media (max-width: 960px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1350px;
  padding: 0px 0px 80px 0px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 42px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card_light + "50"};
  backdrop-filter: blur(10px);
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.primary + "20"};
  margin-top: 28px;
  gap: 12px;
  transition: all 0.3s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.primary + "50"};
    box-shadow: 0 10px 30px -10px ${({ theme }) => theme.primary + "30"};
  }
`;

const ContactTitle = styled.div`
  font-size: 24px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ContactInput = styled.input`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + "50"};
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;

  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + "10"};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + "80"};
  }
`;

const ContactInputMessage = styled.textarea`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary + "50"};
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;

  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + "10"};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + "80"};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const ContactButton = styled.button`
  flex: 1;
  text-decoration: none;
  text-align: center;
  background: hsla(271, 100%, 50%, 1);
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  padding: 16px 16px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const StyledToaster = styled(Toaster)`
  && {
    z-index: 10000;
  }

  .react-hot-toast {
    z-index: 10000;
  }
`;

const Contact = () => {
  const formRef = useRef();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Read config lazily at runtime (not at module-load time)
    const config = getEmailJSConfig();
    if (config.publicKey) {
      emailjs.init({ publicKey: config.publicKey });
    }
  }, []);

  const sendEmailManually = async () => {
    const form = formRef.current;
    const email = form.from_email.value;
    const name = form.from_name.value;
    const subject = form.subject.value;
    const message = form.message.value;

    // Open default email client
    const mailtoLink = `mailto:contact.arsudsandesh@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `From: ${name} (${email})\n\nMessage:\n${message}`
    )}`;

    window.open(mailtoLink);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check email limit before proceeding
    if (!canSendEmail()) {
      // Show toast and redirect after a short delay
      toast.error("Message limit reached. Redirecting to Email...", {
        duration: 2000,
        style: {
          background: "#ef4444",
          color: "#fff",
          zIndex: 10000,
        },
      });

      // Wait for toast to be visible before redirecting
      setTimeout(() => {
        sendEmailManually();
      }, 1000);

      return;
    }

    setIsSending(true);

    const form = formRef.current;

    // Form validation with updated field names
    const email = form.from_email.value;
    const name = form.from_name.value;
    const subject = form.subject.value;
    const message = form.message.value;

    const loadingToast = toast.loading("Sending message...", {
      style: {
        background: "#1e293b",
        color: "#fff",
        zIndex: 10000,
      },
    });

    // Basic validation
    if (!email || !name || !subject || !message) {
      toast.error("Please fill in all fields", {
        id: loadingToast,
        duration: 3000,
      });
      setIsSending(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address", {
        id: loadingToast,
        duration: 3000,
      });
      setIsSending(false);
      return;
    }

    const formData = {
      email,
      name,
      subject,
      message,
      created_at: new Date().toISOString(),
    };

    // Read EmailJS config lazily at call time
    const config = getEmailJSConfig();
    const configured = isEmailJSConfigured();

    try {
      // Store data in Supabase
      const { error: supabaseError } = await supabase
        .from("contacts")
        .insert([formData]);

      if (supabaseError) throw supabaseError;

      console.log("Sending email with config:", {
        email,
        name,
        subject,
        message,
        serviceId: config.serviceId ? "✓ set" : "✗ missing",
        templateId: config.templateId ? "✓ set" : "✗ missing",
        publicKey: config.publicKey ? "✓ set" : "✗ missing",
        configured,
      });

      // Send email using EmailJS
      if (configured) {
        // Use emailjs.send() with explicit template params for reliability.
        // sendForm() relies on form field `name` attributes matching template
        // variables exactly, which is fragile. send() is explicit and debuggable.
        const templateParams = {
          from_email: email,
          from_name: name,
          subject: subject,
          message: message,
        };

        const emailResult = await emailjs.send(
          config.serviceId,
          config.templateId,
          templateParams,
          {
            publicKey: config.publicKey,
          }
        );

        console.log("EmailJS Response:", emailResult);

        if (emailResult.status !== 200) {
          console.error("EmailJS Response:", emailResult);
          throw new Error(`Failed to send email: ${emailResult.text}`);
        }
        
        // Increment the counter only after successful send
        incrementEmailCount();
        
        toast.success(`Message sent successfully! 🎉`, {
          id: loadingToast,
          duration: 4000,
        });
      } else {
        // EmailJS not configured - still save to Supabase but notify user
        console.warn("EmailJS not configured. Config values:", {
          serviceId: config.serviceId,
          templateId: config.templateId,
          publicKey: config.publicKey,
        });
        toast.success(`Message saved! Email notification not sent (EmailJS not configured)`, {
          id: loadingToast,
          duration: 5000,
        });
      }

      form.reset();
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
        stack: err.stack,
        emailJSError: err.text,
      });
      toast.error(err.message || "Failed to send message. Please try again.", {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container id="contact">
      <Wrapper>
        <StyledToaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            zIndex: 10000,
            top: 80,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              maxWidth: "350px",
              boxShadow: "0 3px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 10000,
            },
            success: {
              style: {
                background: "#22c55e",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#22c55e",
              },
            },
            error: {
              style: {
                background: "#ef4444",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#ef4444",
              },
            },
            loading: {
              style: {
                background: "#1e293b",
              },
            },
          }}
        />
        <Title>Contact</Title>
        <Desc>
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <ContactForm ref={formRef} onSubmit={handleSubmit}>
          <ContactTitle>Email Me 🚀</ContactTitle>
          <ContactInput
            placeholder="Your Email"
            name="from_email"
            type="email"
            required
          />
          <ContactInput
            placeholder="Your Name"
            name="from_name"
            type="text"
            required
          />
          <ContactInput
            placeholder="Subject"
            name="subject"
            type="text"
            required
          />
          <ContactInputMessage
            placeholder="Message"
            name="message"
            rows="4"
            required
          />
          <ButtonContainer>
            <ContactButton type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </ContactButton>
            <ContactButton type="button" onClick={sendEmailManually}>
              Send Email
            </ContactButton>
          </ButtonContainer>
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;

