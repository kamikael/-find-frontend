import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 bg-white px-4 sm:px-6 py-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p
          className="text-xs text-zinc-400 font-medium"
          style={{ fontFamily: 'Syne, system-ui, sans-serif' }}
        >
          © {year} <span className="text-zinc-600 font-semibold">#Find</span>. Tous droits réservés.
        </p>

        <div className="flex items-center justify-center flex-wrap gap-4">
          <a
            href="#mentions"
            className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors duration-200 font-medium"
            style={{ fontFamily: 'Syne, system-ui, sans-serif' }}
          >
            Mentions légales
          </a>
          <a
            href="/#about"
            className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors duration-200 font-medium"
            style={{ fontFamily: 'Syne, system-ui, sans-serif' }}
          >
            À propos
          </a>
          <Link
            to="/contact"
            className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors duration-200 font-medium"
            style={{ fontFamily: 'Syne, system-ui, sans-serif' }}
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
