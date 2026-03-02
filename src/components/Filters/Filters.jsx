import { useState, useCallback, useEffect } from 'react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --font-sans: 'DM Sans', system-ui, sans-serif;
    --ink: #111111;
    --soft-bg: #FAFAF8;
    --line: #E5E5E5;
    --accent: #111111;
    --accent-strong: #111111;
  }

  .level-toggle {
    background: var(--soft-bg);
    border: 1px solid var(--line);
    border-radius: 10px;
    padding: 4px;
  }
  .level-btn {
    transition: background .3s ease, color .3s ease, border-color .3s ease;
  }
  .level-btn.level-btn--active {
    background: #6366F1 !important;
    color: #ffffff !important;
    border-color: #6366F1 !important;
  }
  .level-btn:not(.level-btn--active) {
    background: transparent !important;
    color: #6366F1 !important;
    border-color: #6366F1 !important;
  }
  .level-btn:not(.level-btn--active):hover {
    background: #6366F1 !important;
    color: #ffffff !important;
    border-color: #6366F1 !important;
  }

  .filter-btn {
    background: transparent !important;
    border: 1.5px solid var(--accent) !important;
    color: var(--accent) !important;
    letter-spacing: .02em;
    transition: all .3s ease;
  }
  .filter-btn:hover:not(.filter-btn--active) {
    background: var(--accent) !important;
    color: #ffffff !important;
    border-color: var(--accent) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.18);
  }
  .filter-btn--active {
    background: var(--accent) !important;
    color: #ffffff !important;
    border-color: var(--accent) !important;
  }
  .filter-btn:active {
    transform: scale(.98);
  }

  .clear-btn { transition: color .3s ease, opacity .3s ease; }
  .clear-btn:hover { color: var(--ink); opacity: .95; }

  .filter-divider {
    width: 1px;
    background: var(--line);
    align-self: stretch;
    margin: 0 6px;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .drop-in { animation: dropIn .3s ease both; }

  .dropdown-shell {
    border: 1px solid var(--line);
    border-radius: 10px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.06);
  }

  .dropdown-item {
    transition: background .3s ease;
  }
  .dropdown-item:hover { background: #f8f8f6; }
  .dropdown-item.selected { background: #f5f5f2; }
`;

const FILTER_GROUPS = [
  {
    key: 'niveau',
    label: 'Niveau',
    single: true,
    options: [
      { value: 'Licence', label: 'Licence', sub: 'binome' },
      { value: 'Master', label: 'Master', sub: 'individuel' },
    ],
  },
  {
    key: 'statut',
    label: 'Statut',
    single: false,
    options: [
      { value: 'disponible', label: 'Disponible' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'complet', label: 'Complet' },
    ],
  },
  {
    key: 'domaine',
    label: 'Domaine',
    single: false,
    options: [
      { value: 'tech', label: 'Tech et Numerique' },
      { value: 'finance', label: 'Finance' },
      { value: 'sante', label: 'Sante' },
      { value: 'droit', label: 'Droit' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'industrie', label: 'Industrie' },
    ],
  },
];

function DropdownGroup({ group, selected, onToggle, onClose }) {
  const activeCount = selected.length;

  return (
    <div className="drop-in dropdown-shell absolute top-full left-0 mt-2 z-50 w-full sm:w-auto sm:min-w-[200px] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500" style={{ fontFamily: 'var(--font-sans)' }}>
          {group.label}
        </p>
        {activeCount > 0 && (
          <span className="text-[10px] font-medium text-zinc-500">
            {activeCount} selectionne{activeCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="py-1">
        {group.options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onToggle(opt.value); if (group.single) onClose(); }}
              className={`dropdown-item ${isSelected ? 'selected' : ''} w-full flex items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-zinc-700`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-sm border border-zinc-300 flex items-center justify-center shrink-0 bg-white">
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                {opt.label}
              </span>
              {opt.sub && (
                <span className="text-[10px] text-zinc-400 font-normal">{opt.sub}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Filters({
  level,
  onLevelChange,
  resultCount,
  totalCount,
  onFiltersChange,
}) {
  const [activeFilters, setActiveFilters] = useState({
    niveau: level ? [level] : [],
    statut: [],
    domaine: [],
  });
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    setActiveFilters((prev) => {
      const nextLevel = level ? [level] : [];
      if ((prev.niveau ?? [])[0] === nextLevel[0]) return prev;
      return { ...prev, niveau: nextLevel };
    });
  }, [level]);

  const syncLevel = useCallback((val) => {
    setActiveFilters((prev) => {
      const next = { ...prev, niveau: [val] };
      onFiltersChange?.(next);
      return next;
    });
    onLevelChange?.(val);
  }, [onLevelChange, onFiltersChange]);

  const toggleFilter = (groupKey, value) => {
    const group = FILTER_GROUPS.find((g) => g.key === groupKey);
    setActiveFilters((prev) => {
      let next;
      if (group.single) {
        next = { ...prev, [groupKey]: [value] };
        if (groupKey === 'niveau') onLevelChange?.(value);
      } else {
        const cur = prev[groupKey];
        next = {
          ...prev,
          [groupKey]: cur.includes(value)
            ? cur.filter((v) => v !== value)
            : [...cur, value],
        };
      }
      onFiltersChange?.(next);
      return next;
    });
  };

  const clearAll = () => {
    const reset = { niveau: [], statut: [], domaine: [] };
    setActiveFilters(reset);
    onFiltersChange?.(reset);
    setOpenGroup(null);
  };

  const totalActive = (activeFilters.niveau?.length ?? 0)
    + (activeFilters.statut?.length ?? 0)
    + (activeFilters.domaine?.length ?? 0);

  return (
    <>
      <style>{STYLES}</style>

      <div className="flex flex-col gap-4 w-full" style={{ fontFamily: 'var(--font-sans)' }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="level-toggle flex items-center gap-1 shrink-0 w-full sm:w-auto">
            {FILTER_GROUPS.find((g) => g.key === 'niveau').options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => syncLevel(opt.value)}
                className={`level-btn flex-1 sm:flex-none px-4 py-2.5 rounded-md text-[11px] font-semibold uppercase tracking-[0.14em] border ${(activeFilters.niveau ?? []).includes(opt.value)
                  ? 'level-btn--active'
                  : ''
                }`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {opt.label}
                {opt.sub && (
                  <span className="ml-1 font-normal normal-case tracking-normal opacity-55">· {opt.sub}</span>
                )}
              </button>
            ))}
          </div>

          <div className="filter-divider hidden sm:block h-8" />

          {FILTER_GROUPS.filter((g) => g.key !== 'niveau').map((group) => {
            const count = (activeFilters[group.key] ?? []).length;
            const isOpen = openGroup === group.key;

            return (
              <div key={group.key} className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.key)}
                  className="filter-btn w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-4 py-2.5 text-[12px] font-medium rounded-md border bg-white border-[#E5E5E5] text-zinc-700"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {group.label}
                  {count > 0 && (
                    <span className="w-4 h-4 rounded-sm bg-zinc-100 text-[10px] font-semibold flex items-center justify-center text-zinc-700">
                      {count}
                    </span>
                  )}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenGroup(null)} />
                    <DropdownGroup
                      group={group}
                      selected={activeFilters[group.key] ?? []}
                      onToggle={(val) => toggleFilter(group.key, val)}
                      onClose={() => setOpenGroup(null)}
                    />
                  </>
                )}
              </div>
            );
          })}

          {(resultCount !== undefined || totalCount !== undefined) && (
            <>
              <div className="filter-divider hidden sm:block h-8 ml-1" />
              <span className="text-[11px] font-medium text-zinc-500 whitespace-nowrap" style={{ fontFamily: 'var(--font-sans)' }}>
                {resultCount !== undefined ? (
                  <>
                    <span className="text-zinc-900 font-semibold">{resultCount}</span>
                    {totalCount !== undefined && (
                      <span className="text-zinc-400"> / {totalCount}</span>
                    )}
                    {' '}resultat{resultCount > 1 ? 's' : ''}
                  </>
                ) : (
                  <span className="text-zinc-900 font-semibold">{totalCount} total</span>
                )}
              </span>
            </>
          )}

          {totalActive > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="clear-btn sm:ml-auto flex items-center gap-1.5 text-[11px] font-medium text-zinc-500"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Tout effacer
            </button>
          )}
        </div>
      </div>
    </>
  );
}


