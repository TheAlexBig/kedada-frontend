import { useQuery } from '@tanstack/react-query';

import {
  getCategory,
  getEvent,
  getEventMetricSummary,
  listSchedulesForEvent,
  listUrlsForEvent,
} from '../api/events';
import type { CategoryResponse, EnrichedEvent, UUID } from '../api/types';

export function useEventDetail(id: UUID | undefined) {
  return useQuery({
    queryKey: ['event', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const event = await getEvent(id as UUID);
      const [categories, urls, schedules, metrics] = await Promise.all([
        Promise.all(event.categoryIds.map((categoryId) => getCategory(categoryId).catch(() => undefined))),
        listUrlsForEvent(event.id).catch(() => undefined),
        listSchedulesForEvent(event.id).catch(() => undefined),
        getEventMetricSummary(event.id).catch(() => undefined),
      ]);

      return {
        event: {
          ...event,
          categories: categories.filter((category): category is CategoryResponse => category !== undefined),
          urls,
          schedules,
        } satisfies EnrichedEvent,
        metrics,
      };
    },
  });
}
