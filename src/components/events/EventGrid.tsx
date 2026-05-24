import clsx from 'clsx';

import type { EnrichedEvent } from '../../api/types';

import { EventCard } from './EventCard';

export function EventGrid({
  events,
  constrained = false,
}: {
  events: EnrichedEvent[];
  constrained?: boolean;
}) {
  return (
    <div className={clsx('grid gap-5 sm:grid-cols-2', !constrained && 'lg:grid-cols-3')}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
