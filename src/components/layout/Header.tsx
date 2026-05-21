import { CalendarDays, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Inicio' },
  { to: '/eventos', label: 'Eventos' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 text-stone-950">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-rose-600 text-white">
            <CalendarDays className="h-5 w-5" />
          </span>
          <span className="text-lg font-black tracking-normal">Kedada</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-stone-100 text-rose-700'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-md text-stone-700 hover:bg-stone-100 md:hidden"
          type="button"
          aria-label={open ? 'Cerrar menu' : 'Abrir menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-semibold ${
                  isActive ? 'bg-stone-100 text-rose-700' : 'text-stone-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
