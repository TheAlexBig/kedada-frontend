import type { CategoryResponse, UUID } from '../../api/types';

export function EventFilters({
  categories,
  categoryId,
  onCategoryChange,
}: {
  categories: CategoryResponse[];
  categoryId: UUID | '';
  onCategoryChange: (value: UUID | '') => void;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <label className="block text-sm font-semibold text-stone-900" htmlFor="category">
        Categoria
      </label>
      <select
        id="category"
        value={categoryId}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
      >
        <option value="">Todas las categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
