// API Route: /api/update-local-json
// Receives data from Edge Function and saves it to public/data/ folder

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Validate secret
    const secret = request.headers.get("x-webhook-secret");
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { error: "Missing section or data" },
        { status: 400 }
      );
    }

    // Define data directory
    const dataDir = path.join(process.cwd(), "public", "data");
    
    // Ensure directory exists
    try {
      await mkdir(dataDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Write JSON file
    const filePath = path.join(dataDir, `${section}.json`);
    const jsonContent = JSON.stringify(data, null, 2);
    
    await writeFile(filePath, jsonContent, "utf-8");

    console.log(`✓ Updated ${section}.json in public/data/`);

    return NextResponse.json({
      success: true,
      section,
      file: `/data/${section}.json`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error updating local JSON:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Only allow POST
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
