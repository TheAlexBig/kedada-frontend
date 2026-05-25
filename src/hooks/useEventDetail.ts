import { useQuery } from '@tanstack/react-query';

import {
  getCategory,
  getEvent,
  getEventMetricSummary,
  getImage,
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
      const [categories, urls, schedules, metrics, image] = await Promise.all([
        Promise.all(event.categoryIds.map((categoryId) => getCategory(categoryId).catch(() => undefined))),
        listUrlsForEvent(event.id).catch(() => undefined),
        listSchedulesForEvent(event.id).catch(() => undefined),
        getEventMetricSummary(event.id).catch(() => undefined),
        event.thumbnail ? getImage(event.thumbnail).catch(() => undefined) : undefined,
      ]);

      return {
        event: {
          ...event,
          categories: categories.filter((category): category is CategoryResponse => category !== undefined),
          urls,
          schedules,
          thumbnailUrl: image?.readUrl,
        } satisfies EnrichedEvent,
        metrics,
      };
    },
  });
}
