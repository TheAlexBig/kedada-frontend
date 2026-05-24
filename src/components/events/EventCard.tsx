import { ArrowUpRight, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { EnrichedEvent } from '../../api/types';
import { formatCurrency, formatDate, truncate } from '../../utils/format';

export function EventCard({ event }: { event: EnrichedEvent }) {
  const primaryUrl = event.urls?.find((url) => url.kind === 'official') ?? event.urls?.[0];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md">
      <Link to={`/eventos/${event.id}`} className="block">
        <div className="aspect-[16/9] bg-gradient-to-br from-rose-100 via-amber-100 to-teal-100">
          {event.thumbnail ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm font-medium text-stone-600">
              Imagen registrada: {event.thumbnail.slice(0, 8)}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-stone-600">
              Kedada
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {event.categories?.map((category) => (
            <span key={category.id} className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
              <Tag className="h-3.5 w-3.5" />
              {category.name}
            </span>
          ))}
        </div>

        <h2 className="line-clamp-2 text-lg font-bold text-stone-950">
          <Link to={`/eventos/${event.id}`} className="hover:text-rose-700">
            {event.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600">
          {truncate(event.description)}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-stone-700">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-stone-400" />
            Publicado {formatDate(event.createdAt)}
          </span>
          <span className="font-semibold text-stone-950">{formatCurrency(event.price)}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to={`/eventos/${event.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-stone-950 px-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Ver detalle
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          {primaryUrl?.url && (
            <a
              href={primaryUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md border border-stone-300 px-3 text-sm font-semibold text-stone-800 transition hover:border-rose-300 hover:text-rose-700"
            >
              {primaryUrl.description || 'Sitio oficial'}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
