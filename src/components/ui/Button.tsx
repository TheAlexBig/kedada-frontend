import { Link } from 'react-router-dom';
import type React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variants = {
  primary:
    'bg-rose-600 text-white shadow-sm shadow-rose-200 hover:bg-rose-700 focus-visible:outline-rose-600',
  secondary:
    'border border-stone-300 bg-white text-stone-900 hover:border-rose-300 hover:text-rose-700 focus-visible:outline-rose-600',
  ghost: 'text-stone-700 hover:bg-stone-100 focus-visible:outline-stone-500',
};

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function ButtonLink({
  className = '',
  variant = 'primary',
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
