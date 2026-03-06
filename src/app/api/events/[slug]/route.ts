import { Event, type IEvent } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Slug format: lowercase alphanumeric characters and hyphens only
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Route context type for dynamic segment parameters
type RouteParams = { params: Promise<{ slug: string }> };

/**
 * GET /api/events/[slug]
 * Fetches a single event by its URL-friendly slug.
 */
export async function GET(
    _request: NextRequest,
    { params }: RouteParams,
): Promise<NextResponse> {
    try {
        const { slug } = await params;

        // Validate slug presence and format
        if (!slug || typeof slug !== "string") {
            return NextResponse.json(
                { message: "Event slug is required" },
                { status: 400 },
            );
        }

        const trimmedSlug = slug.trim().toLowerCase();

        if (!SLUG_REGEX.test(trimmedSlug)) {
            return NextResponse.json(
                { message: "Invalid slug format. Use lowercase alphanumeric characters and hyphens only." },
                { status: 400 },
            );
        }

        await connectDB();

        const event: IEvent | null = await Event.findOne({ slug: trimmedSlug }).lean();

        if (!event) {
            return NextResponse.json(
                { message: `Event with slug '${trimmedSlug}' not found` },
                { status: 404 },
            );
        }

        return NextResponse.json({ event }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch event:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch event",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}
