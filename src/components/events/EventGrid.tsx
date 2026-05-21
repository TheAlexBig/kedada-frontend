import type { EnrichedEvent } from '../../api/types';

import { EventCard } from './EventCard';

export function EventGrid({ events }: { events: EnrichedEvent[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
