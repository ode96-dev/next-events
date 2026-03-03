import mongoose, { Schema, Document, Model, CallbackError } from "mongoose";

// TypeScript interface for the Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be one of: online, offline, hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Agenda must have at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "Tags must have at least one item",
      },
    },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt
  }
);

// Unique index on slug for fast lookups and URL routing
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-save hook:
 * 1. Generates a URL-friendly slug from title (only when title changes)
 * 2. Normalizes date to ISO format (YYYY-MM-DD)
 * 3. Normalizes time to HH:MM 24-hour format
 */
EventSchema.pre<IEvent>("save", function (next: (err?: CallbackError) => void) {
  // Slug generation: convert title to lowercase, replace non-alphanumeric chars with hyphens
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Date normalization: parse the date string and store as ISO date (YYYY-MM-DD)
  if (this.isModified("date")) {
    const parsed = new Date(this.date);
    if (isNaN(parsed.getTime())) {
      return next(new Error("Invalid date format"));
    }
    this.date = parsed.toISOString().split("T")[0];
  }

  // Time normalization: ensure consistent HH:MM 24-hour format
  if (this.isModified("time")) {
    const timeMatch = this.time.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i
    );
    if (!timeMatch) {
      return next(new Error("Invalid time format. Expected HH:MM or HH:MM AM/PM"));
    }

    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const period = timeMatch[3]?.toUpperCase();

    // Convert 12-hour to 24-hour format if AM/PM is provided
    if (period) {
      if (hours === 12 && period === "AM") hours = 0;
      else if (hours !== 12 && period === "PM") hours += 12;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return next(new Error("Time out of valid range"));
    }

    this.time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  // Validate that required string fields are non-empty after trimming
  const requiredFields: (keyof IEvent)[] = [
    "title", "description", "overview", "image",
    "venue", "location", "audience", "organizer",
  ];
  for (const field of requiredFields) {
    if (typeof this[field] === "string" && (this[field] as string).trim() === "") {
      return next(new Error(`${field} must not be empty`));
    }
  }

  next();
});

// Prevent model recompilation in Next.js hot-reload environments
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
