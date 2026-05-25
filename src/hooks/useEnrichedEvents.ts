import { useQuery } from '@tanstack/react-query';

import { getCategory, getImage, listEvents, listUrlsForEvent } from '../api/events';
import type { CategoryResponse, EnrichedEvent, EventSearchParams } from '../api/types';

async function enrichEvents(params: EventSearchParams) {
  const page = await listEvents(params);

  const enriched = await Promise.all(
    page.content.map(async (event): Promise<EnrichedEvent> => {
      const [categories, urls, image] = await Promise.all([
        Promise.all(event.categoryIds.map((categoryId) => getCategory(categoryId).catch(() => undefined))),
        listUrlsForEvent(event.id).catch(() => undefined),
        event.thumbnail ? getImage(event.thumbnail).catch(() => undefined) : undefined,
      ]);

      return {
        ...event,
        categories: categories.filter((category): category is CategoryResponse => category !== undefined),
        urls,
        thumbnailUrl: image?.readUrl,
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
