export type UUID = string;

export interface PageResponse<T> {
  content: T[];
  pageable?: unknown;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort?: unknown;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface EventResponse {
  id: UUID;
  title: string;
  description: string | null;
  priority: number | null;
  thumbnail: UUID | null;
  price: number | null;
  siteUrlId: UUID | null;
  referenceUrlId: UUID | null;
  categoryId: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  id: UUID;
  name: string;
  ownerId: UUID | null;
  type: string[];
}

export interface UrlResponse {
  id: UUID;
  url: string;
  description: string | null;
  ownerId: UUID | null;
  kind: string | null;
}

export interface ScheduleResponse {
  id: UUID;
  eventId: UUID | null;
  startDate: string;
  endDate: string | null;
  ownerId: UUID | null;
}

export interface EventMetricSummaryResponse {
  eventId: UUID;
  views: number;
  shares: number;
}

export interface EventSearchParams {
  q?: string;
  categoryId?: UUID;
  minPrice?: number;
  maxPrice?: number;
  priority?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface EnrichedEvent extends EventResponse {
  category?: CategoryResponse;
  siteUrl?: UrlResponse;
  referenceUrl?: UrlResponse;
  schedules?: ScheduleResponse[];
}

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: Array<{
    field: string;
    message: string;
  }>;
}
