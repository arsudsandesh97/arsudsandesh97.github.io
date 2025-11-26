// Next.js API Route: /api/revalidate
// Revalidates specified paths when triggered by Edge Function

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Validate revalidation secret
    const revalidateSecret = request.headers.get("x-revalidate-secret");
    const expectedSecret = process.env.NEXT_REVALIDATE_SECRET;

    if (!revalidateSecret || revalidateSecret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid revalidation secret" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { paths } = body;

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json(
        { error: "Bad request: paths array is required" },
        { status: 400 }
      );
    }

    // Revalidate each path
    const results: Array<{ path: string; status: string }> = [];

    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, status: "success" });
        console.log(`Revalidated path: ${path}`);
      } catch (error: any) {
        console.error(`Error revalidating path ${path}:`, error);
        results.push({ path, status: "error" });
      }
    }

    return NextResponse.json({
      revalidated: true,
      results,
      message: "Revalidation completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
