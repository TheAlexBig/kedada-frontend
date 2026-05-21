import { AlertCircle, Search } from 'lucide-react';

export function LoadingState({ label = 'Cargando eventos...' }: { label?: string }) {
  return (
    <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-stone-300 bg-white/70 p-8 text-center">
      <div>
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
        <p className="text-sm font-medium text-stone-700">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-900">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">Algo salio mal</p>
          <p className="mt-1 text-sm text-red-800">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'No encontramos eventos',
  description = 'Proba con otra busqueda o volve mas tarde.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-stone-300 bg-white/70 p-8 text-center">
      <div>
        <Search className="mx-auto mb-4 h-10 w-10 text-stone-400" />
        <p className="text-base font-semibold text-stone-900">{title}</p>
        <p className="mt-2 text-sm text-stone-600">{description}</p>
      </div>
    </div>
  );
}
