import BookEvent from "@/components/events/book-event";
import EventAgenda from "@/components/events/event-agenda";
import EventCard from "@/components/events/event-card";
import EventDetailItem from "@/components/events/event-detail-item";
import EventTags from "@/components/events/event-tags";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const EventPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {
    event: {
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

  if (!title || !description) {
    return notFound();
  }

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

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

            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((event) => (
              <EventCard
                key={event.title}
                title={event.title}
                image={event.image}
                slug={event.slug}
                location={event.location}
                date={event.date}
                time={event.time}
              />
            ))}
          {similarEvents.length === 0 && <p>No similar events found.</p>}
        </div>
      </div>
    </section>
  );
};

export default EventPage;
