export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 bg-white px-4 sm:px-6 py-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-zinc-400 font-medium"
          style={{ fontFamily: 'Syne, system-ui, sans-serif' }}>
          © {year} <span className="text-zinc-600 font-semibold">#Find</span>. Tous droits réservés.
        </p>
        <div className="flex items-center justify-center flex-wrap gap-4">
          {[
            { label: 'Mentions légales', href: '#mentions' },
            { label: 'À propos',         href: '/#about'   },
            { label: 'Contact',          href: '/#contacts' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors duration-200 font-medium"
              style={{ fontFamily: 'Syne, system-ui, sans-serif' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
