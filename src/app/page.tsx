import EventCard from "@/components/events/event-card";
import ExploreBtn from "@/components/explore/explore-btn";
import { events } from "@/lib/constants";

const Home = () => {
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
          {events.map((event) => (
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
