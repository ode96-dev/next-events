import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const formData = await request.formData();
        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (error) {
            return NextResponse.json(
                {
                    message: "Invalid form data",
                    error: error instanceof Error ? error.message : "Unknown error",
                },
                { status: 400 },
            );
        }

        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json(
                { message: "Image is required" },
                { status: 400 },
            );
        }

        const tags = JSON.parse(formData.get('tags') as string)
        const agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { resource_type: "image", folder: "NextEvent" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    },
                )
                .end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda
        });
        console.log("[createdEvent]", createdEvent)
        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: "Event creation failed",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ events }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                message: "Failed to fetch events",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        );
    }
}