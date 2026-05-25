import { apiClient } from './client';
import type {
  CategoryResponse,
  EventMetricSummaryResponse,
  EventResponse,
  EventSearchParams,
  MediaAssetResponse,
  PageResponse,
  ScheduleResponse,
  UrlResponse,
  UUID,
} from './types';

function compactParams(params: object) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  );
}

export async function listEvents(params: EventSearchParams = {}) {
  const response = await apiClient.get<PageResponse<EventResponse>>('/api/v1/events', {
    params: compactParams(params),
  });

  return response.data;
}

export async function getEvent(id: UUID) {
  const response = await apiClient.get<EventResponse>(`/api/v1/events/${id}`);
  return response.data;
}

export async function listCategories(page = 0, size = 100) {
  const response = await apiClient.get<PageResponse<CategoryResponse>>(
    '/api/v1/categories',
    {
      params: { page, size, sort: 'name,asc' },
    },
  );

  return response.data;
}

export async function getCategory(id: UUID) {
  const response = await apiClient.get<CategoryResponse>(`/api/v1/categories/${id}`);
  return response.data;
}

export async function getImage(id: UUID) {
  const response = await apiClient.get<MediaAssetResponse>(`/api/v1/media/${id}`);
  return response.data;
}

async function listUrls(eventId: UUID, page = 0, size = 100) {
  const response = await apiClient.get<PageResponse<UrlResponse>>('/api/v1/urls', {
    params: { eventId, page, size, sort: 'kind,asc' },
  });

  return response.data;
}

export async function listUrlsForEvent(eventId: UUID) {
  const firstPage = await listUrls(eventId);
  if (firstPage.last) {
    return firstPage.content;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      listUrls(eventId, index + 1).then((page) => page.content),
    ),
  );
  return [firstPage.content, ...remainingPages].flat();
}

export async function listSchedules(eventId: UUID, page = 0, size = 100) {
  const response = await apiClient.get<PageResponse<ScheduleResponse>>(
    '/api/v1/schedules',
    {
      params: { eventId, page, size, sort: 'startDate,asc' },
    },
  );

  return response.data;
}

export async function listSchedulesForEvent(eventId: UUID) {
  const firstPage = await listSchedules(eventId, 0, 100);
  if (firstPage.last) {
    return firstPage.content;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
      listSchedules(eventId, index + 1, 100).then((page) => page.content),
    ),
  );
  return [firstPage.content, ...remainingPages].flat();
}

export async function getEventMetricSummary(id: UUID) {
  const response = await apiClient.get<EventMetricSummaryResponse>(
    `/api/v1/events/${id}/metrics/summary`,
  );
  return response.data;
}

export async function recordEventView(id: UUID) {
  await apiClient.post(`/api/v1/events/${id}/view`);
}

export async function recordEventShare(id: UUID) {
  await apiClient.post(`/api/v1/events/${id}/share`);
}
