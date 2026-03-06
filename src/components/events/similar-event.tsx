import React from "react";
import EventCard from "./event-card";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";

const SimilarEvents = async ({ slug }: { slug: string }) => {
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  if (similarEvents.length === 0) {
    return <p>no similar events found.</p>;
  }

  return (
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
      </div>
    </div>
  );
};

export default SimilarEvents;
