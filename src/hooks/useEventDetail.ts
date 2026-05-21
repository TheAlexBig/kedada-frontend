import { useQuery } from '@tanstack/react-query';

import {
  getCategory,
  getEvent,
  getEventMetricSummary,
  getUrl,
  listSchedulesForEvent,
} from '../api/events';
import type { EnrichedEvent, UUID } from '../api/types';

export function useEventDetail(id: UUID | undefined) {
  return useQuery({
    queryKey: ['event', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const event = await getEvent(id as UUID);
      const [category, siteUrl, referenceUrl, schedules, metrics] = await Promise.all([
        getCategory(event.categoryId).catch(() => undefined),
        event.siteUrlId ? getUrl(event.siteUrlId).catch(() => undefined) : undefined,
        event.referenceUrlId ? getUrl(event.referenceUrlId).catch(() => undefined) : undefined,
        listSchedulesForEvent(event.id).catch(() => undefined),
        getEventMetricSummary(event.id).catch(() => undefined),
      ]);

      return {
        event: {
          ...event,
          category,
          siteUrl,
          referenceUrl,
          schedules,
        } satisfies EnrichedEvent,
        metrics,
      };
    },
  });
}
