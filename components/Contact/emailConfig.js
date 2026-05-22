"use client";

// Lazy getters to ensure env vars are read at runtime, not at module load time.
// This fixes issues where the module is loaded in a server context before
// NEXT_PUBLIC_* vars are available in the browser.
export const getEmailJSConfig = () => ({
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
});

export const isEmailJSConfigured = () => {
  const config = getEmailJSConfig();
  return !!(config.serviceId && config.templateId && config.publicKey);
};

// Keep backward-compatible exports for any other consumers,
// but these are now getters on a module-level object so they
// re-evaluate each time the module is freshly imported.
export const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
export const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
export const EMAILJS_USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

// Validation (client-side only, non-blocking)
if (typeof window !== "undefined") {
  // Defer the check so Next.js has time to hydrate env vars
  setTimeout(() => {
    if (!isEmailJSConfigured()) {
      console.warn("⚠️ EmailJS configuration missing or incomplete:", {
        serviceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        templateId: !!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        publicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      });
    }
  }, 0);
}
