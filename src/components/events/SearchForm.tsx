import { Search } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Button } from '../ui/Button';

export function SearchForm({
  initialValue = '',
  onSearch,
}: {
  initialValue?: string;
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label className="relative flex-1">
        <span className="sr-only">Buscar eventos</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          className="h-12 w-full rounded-md border border-stone-300 bg-white pl-11 pr-4 text-base text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Busca conciertos, ferias, teatro..."
        />
      </label>
      <Button type="submit" className="h-12">
        Buscar
      </Button>
    </form>
  );
}
