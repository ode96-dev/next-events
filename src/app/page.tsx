import EventCard from "@/components/events/event-card";
import ExploreBtn from "@/components/explore/explore-btn";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const Home = async () => {
  "use cache";
  cacheLife("hours");
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  return (
    <section>
      <h1 className="text-center">
        next event <br /> you cannot miss!
      </h1>
      <p className="text-center mt-5">
        hackathons, meetups and conferences. all in one place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <div className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
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
    </section>
  );
};

export default Home;
