import React from "react";
import SimilarEvents from "./similar-event";
import { notFound } from "next/navigation";
import Image from "next/image";
import EventDetailItem from "./event-detail-item";
import EventAgenda from "./event-agenda";
import EventTags from "./event-tags";
import BookEvent from "./book-event";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);

  const {
    event: {
      _id,
      title,
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      organizer,
    },
  } = await request.json();

  const bookings = 10;

  if (!title || !description) {
    return notFound();
  }

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <Image
            className="banner"
            src={image}
            alt="Event Banner"
            width={800}
            height={400}
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon={"/icons/calendar.svg"}
              alt="Calendar"
              label={`${date}`}
            />
            <EventDetailItem
              icon={"/icons/clock.svg"}
              alt="Time"
              label={`${time}`}
            />
            <EventDetailItem
              icon={"/icons/pin.svg"}
              alt="Location"
              label={`${location}`}
            />
            <EventDetailItem
              icon={"/icons/mode.svg"}
              alt="mode"
              label={`${mode}`}
            />
            <EventDetailItem
              icon={"/icons/audience.svg"}
              alt="audience"
              label={`${audience}`}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>
        <aside className="booking">
          <div className="signup-card">
            <h2>Book your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                join {bookings} others who have booked their spot for this
                event.
              </p>
            ) : (
              <p className="text-sm text-red-500">
                Be the 1st to book your spot
              </p>
            )}

            <BookEvent eventId={`${_id}`} slug={slug} />
          </div>
        </aside>
      </div>

      <SimilarEvents slug={slug} />
    </section>
  );
};

export default EventDetails;
