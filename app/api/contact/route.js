import { NextResponse } from "next/server";
import { storeContactData } from "@/lib/api/supabase";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_USER_ID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, subject, message } = body;

    // Validation
    if (!email || !name || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const formData = {
      email,
      name,
      subject,
      message,
      created_at: new Date().toISOString(),
    };

    // Store data in Supabase
    const { error: supabaseError } = await storeContactData(formData);

    if (supabaseError) {
      console.error("Supabase error:", supabaseError);
      return NextResponse.json(
        { error: "Failed to store contact data" },
        { status: 500 }
      );
    }

    // Send email using EmailJS (client-side only, so we'll handle this differently)
    // For server-side, you might want to use a different email service
    // For now, we'll just store in Supabase and let the client handle EmailJS

    return NextResponse.json(
      { message: "Contact form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

