import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Jelajah', end: true },
  { to: '/favorites', label: 'Favorit', end: false },
  { to: '/notes', label: 'Catatan', end: false },
  { to: '/about', label: 'Tentang', end: false },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap shrink-0 text-[16px] font-medium py-1 border-b-2 transition-colors duration-150 ${
      isActive
        ? 'text-[var(--lampu)] border-[var(--lampu)]'
        : 'text-[var(--kertas)] border-transparent hover:text-[var(--lampu)]'
    }`;

  return (
    <header className="bg-[var(--layar)] border-b border-[var(--tirai)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between gap-8">
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="font-display text-[20px] font-bold lowercase text-[var(--kertas)] whitespace-nowrap shrink-0 inline-flex items-baseline"
        >
          cineva
          <span
            aria-hidden="true"
            className="inline-block w-2 h-2 rounded-full bg-[var(--lampu)] ml-1"
          />
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClassName}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[10px] bg-[var(--tirai)] text-[var(--kertas)]"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi seluler"
          className="md:hidden border-t border-[var(--tirai)] px-6 py-4 flex flex-col gap-3 bg-[var(--layar)]"
        >
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-[16px] font-medium py-2 px-3 rounded-[10px] ${
                  isActive
                    ? 'bg-[var(--tirai)] text-[var(--lampu)]'
                    : 'text-[var(--kertas)] hover:bg-[var(--tirai)]'
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
