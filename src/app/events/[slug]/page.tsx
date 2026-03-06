import EventDetails from "@/components/events/event-details";
import { Suspense } from "react";

const EventPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<p>Loading event details...</p>}>
      <EventDetails params={params} />
    </Suspense>
  );
};

export default EventPage;
