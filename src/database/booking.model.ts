import mongoose, { Schema, Document, Model, Types, CallbackError } from "mongoose";

// TypeScript interface for the Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => EMAIL_REGEX.test(v),
        message: "Invalid email format",
      },
    },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt
  }
);

// Index on eventId for efficient lookups of bookings by event
BookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook:
 * Verifies the referenced eventId exists in the Event collection.
 * Prevents orphaned bookings by rejecting saves for non-existent events.
 */
BookingSchema.pre<IBooking>("save", async function (next: (err?: CallbackError) => void) {
  // Only validate eventId when it is new or has been modified
  if (this.isModified("eventId")) {
    const EventModel = mongoose.model("Event");
    const eventExists = await EventModel.exists({ _id: this.eventId });

    if (!eventExists) {
      return next(new Error(`Event with ID ${this.eventId} does not exist`));
    }
  }

  next();
});

// Prevent model recompilation in Next.js hot-reload environments
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
