"use client";

const EMAIL_LIMIT = 10;
const EMAIL_COUNTER_KEY = "emailSendCount";
const EMAIL_DATE_KEY = "emailSendDate";

export const canSendEmail = () => {
  if (typeof window === "undefined") return true;
  
  const today = new Date().toDateString();
  const lastSendDate = localStorage.getItem(EMAIL_DATE_KEY);
  const sendCount = parseInt(localStorage.getItem(EMAIL_COUNTER_KEY) || "0");

  if (lastSendDate !== today) {
    // Reset counter for new day
    localStorage.setItem(EMAIL_DATE_KEY, today);
    localStorage.setItem(EMAIL_COUNTER_KEY, "0");
    return true;
  }

  return sendCount < EMAIL_LIMIT;
};

export const incrementEmailCount = () => {
  if (typeof window === "undefined") return;
  
  const today = new Date().toDateString();
  const sendCount = parseInt(localStorage.getItem(EMAIL_COUNTER_KEY) || "0");

  localStorage.setItem(EMAIL_DATE_KEY, today);
  localStorage.setItem(EMAIL_COUNTER_KEY, (sendCount + 1).toString());
};

export const getRemaining = () => {
  if (typeof window === "undefined") return EMAIL_LIMIT;
  
  const today = new Date().toDateString();
  const lastSendDate = localStorage.getItem(EMAIL_DATE_KEY);

  if (lastSendDate !== today) {
    return EMAIL_LIMIT;
  }

  const sendCount = parseInt(localStorage.getItem(EMAIL_COUNTER_KEY) || "0");
  return EMAIL_LIMIT - sendCount;
};

