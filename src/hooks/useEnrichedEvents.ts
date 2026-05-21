import { useQuery } from '@tanstack/react-query';

import { getCategory, getUrl, listEvents } from '../api/events';
import type { EnrichedEvent, EventSearchParams } from '../api/types';

async function enrichEvents(params: EventSearchParams) {
  const page = await listEvents(params);

  const enriched = await Promise.all(
    page.content.map(async (event): Promise<EnrichedEvent> => {
      const [category, siteUrl, referenceUrl] = await Promise.all([
        getCategory(event.categoryId).catch(() => undefined),
        event.siteUrlId ? getUrl(event.siteUrlId).catch(() => undefined) : undefined,
        event.referenceUrlId
          ? getUrl(event.referenceUrlId).catch(() => undefined)
          : undefined,
      ]);

      return {
        ...event,
        category,
        siteUrl,
        referenceUrl,
      };
    }),
  );

  return { ...page, content: enriched };
}

export function useEnrichedEvents(params: EventSearchParams) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => enrichEvents(params),
    placeholderData: (previousData) => previousData,
  });
}
