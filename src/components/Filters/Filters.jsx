import { useState, useCallback, useEffect } from 'react';

/* ══════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Geist:wght@300;400;500;600&display=swap');

  :root {
    --font-sans: 'Geist', system-ui, sans-serif;
    --font-ui: 'Syne', system-ui, sans-serif;
  }

  /* ── Filter button ── */
  .filter-btn {
    transition: background .18s ease, color .18s ease,
                border-color .18s ease, box-shadow .18s ease;
  }
  .filter-btn:hover:not(.filter-btn--active) {
    background: #f4f4f5;
    border-color: #a1a1aa;
  }
  .filter-btn--active {
    background: #0a0a0a;
    color: #ffffff;
    border-color: #0a0a0a;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  /* ── Badge ── */
  @keyframes badgeIn {
    from { opacity: 0; transform: scale(.8) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .badge-in { animation: badgeIn .22s cubic-bezier(.16,1,.3,1) both; }

  .filter-badge {
    transition: background .15s ease, border-color .15s ease;
  }
  .filter-badge-close {
    transition: background .15s ease, color .15s ease;
  }
  .filter-badge-close:hover { background: rgba(0,0,0,0.12); border-radius: 99px; }

  /* ── Clear all button ── */
  .clear-btn {
    transition: color .15s ease;
  }
  .clear-btn:hover { color: #0a0a0a; }

  /* ── Result counter ── */
  @keyframes countPop {
    0%   { transform: scale(.85); opacity: 0; }
    70%  { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  .count-pop { animation: countPop .3s cubic-bezier(.16,1,.3,1) both; }

  /* ── Section divider ── */
  .filter-divider {
    width: 1px;
    background: #e4e4e7;
    align-self: stretch;
    margin: 0 2px;
  }

  /* ── Dropdown ── */
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .drop-in { animation: dropIn .2s cubic-bezier(.16,1,.3,1) both; }

  .dropdown-item {
    transition: background .15s ease, padding-left .15s ease;
  }
  .dropdown-item:hover { background: #f4f4f5; padding-left: 18px; }
  .dropdown-item.selected { background: #fafafa; }
`;

/* ══════════════════════════════════════════════
   FILTER CONFIG
══════════════════════════════════════════════ */
const FILTER_GROUPS = [
  {
    key: 'niveau',
    label: 'Niveau',
    single: true, // radio behavior
    options: [
      { value: 'Licence', label: 'Licence', sub: 'binôme' },
      { value: 'Master',  label: 'Master',  sub: 'individuel' },
    ],
  },
  {
    key: 'statut',
    label: 'Statut',
    single: false,
    options: [
      { value: 'disponible', label: 'Disponible' },
      { value: 'urgent',     label: 'Urgent'     },
      { value: 'complet',    label: 'Complet'     },
    ],
  },
  {
    key: 'domaine',
    label: 'Domaine',
    single: false,
    options: [
      { value: 'tech',      label: 'Tech & Numérique' },
      { value: 'finance',   label: 'Finance'          },
      { value: 'sante',     label: 'Santé'            },
      { value: 'droit',     label: 'Droit'            },
      { value: 'marketing', label: 'Marketing'        },
      { value: 'industrie', label: 'Industrie'        },
    ],
  },
];

/* ══════════════════════════════════════════════
   ACTIVE BADGE
══════════════════════════════════════════════ */
function ActiveBadge({ label, onRemove }) {
  return (
    <span
      className="badge-in filter-badge inline-flex items-center gap-1.5
                 bg-zinc-950 text-white text-[11px] font-semibold
                 px-2.5 py-1 rounded-full border border-zinc-800"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="filter-badge-close w-3.5 h-3.5 flex items-center justify-center
                   opacity-60 hover:opacity-100 ml-0.5"
        aria-label={`Retirer ${label}`}
      >
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </span>
  );
}

/* ══════════════════════════════════════════════
   DROPDOWN GROUP
══════════════════════════════════════════════ */
function DropdownGroup({ group, selected, onToggle, onClose }) {
  const activeCount = selected.length;

  return (
    <div className="drop-in absolute top-full left-0 mt-2 z-50 w-full sm:w-auto sm:min-w-[180px]
                    bg-white border border-zinc-200 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                    overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-50">
        <p
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {group.label}
        </p>
        {activeCount > 0 && (
          <span className="text-[10px] font-bold text-zinc-500">
            {activeCount} sélectionné{activeCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Options */}
      <div className="py-1">
        {group.options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onToggle(opt.value); if (group.single) onClose(); }}
              className={`dropdown-item ${isSelected ? 'selected' : ''} w-full flex items-center justify-between
                         px-4 py-2.5 text-left text-sm font-medium text-zinc-600`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <span className="flex items-center gap-2.5">
                {/* Checkbox / radio visual */}
                <span
                  className="w-4 h-4 rounded-md border-2 flex items-center
                             justify-center shrink-0 border-zinc-300 bg-white"
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      className="text-zinc-700">
                      <polyline points="20 6 9 17 4 12"/>
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

/* ══════════════════════════════════════════════
   MAIN FILTER BAR
══════════════════════════════════════════════ */
export default function Filters({
  level,
  onLevelChange,
  resultCount,
  totalCount,
  onFiltersChange,
}) {
  // Internal multi-filter state
  const [activeFilters, setActiveFilters] = useState({
    niveau:  level ? [level] : [],
    statut:  [],
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

  /* Sync level prop → internal state */
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

  const removeFilter = (groupKey, value) => {
    setActiveFilters((prev) => {
      const next = { ...prev, [groupKey]: prev[groupKey].filter((v) => v !== value) };
      if (groupKey === 'niveau' && next.niveau.length === 0) next.niveau = [];
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

  // All active badges
  const allActive = FILTER_GROUPS.flatMap((g) =>
    (activeFilters[g.key] ?? []).map((val) => {
      const opt = g.options.find((o) => o.value === val);
      return { groupKey: g.key, value: val, label: opt?.label ?? val };
    })
  );

  const totalActive = allActive.length;

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="flex flex-col gap-3 w-full"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {/* ── Row 1: filter buttons + result count ── */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Level quick-toggle (primary) */}
          <div
            className="flex items-center bg-zinc-100 rounded-xl p-1 gap-0.5 shrink-0 w-full sm:w-auto"
          >
            {FILTER_GROUPS.find((g) => g.key === 'niveau').options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => syncLevel(opt.value)}
                className={`filter-btn flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-[11px] font-bold
                           uppercase tracking-widest border ${
                             (activeFilters.niveau ?? []).includes(opt.value)
                               ? 'filter-btn--active'
                               : 'border-transparent text-zinc-500'
                           }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {opt.label}
                {opt.sub && (
                  <span className="ml-1 font-normal normal-case tracking-normal opacity-40">
                    · {opt.sub}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="filter-divider hidden sm:block h-7" />

          {/* Additional filter group buttons */}
          {FILTER_GROUPS.filter((g) => g.key !== 'niveau').map((group) => {
            const count   = (activeFilters[group.key] ?? []).length;
            const isOpen  = openGroup === group.key;

            return (
              <div key={group.key} className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.key)}
                  className="filter-btn w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2
                             text-[12px] font-semibold rounded-xl border
                             bg-white border-zinc-200 text-zinc-600"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {group.label}
                  {count > 0 && (
                    <span
                      className="count-pop w-4 h-4 rounded-full bg-white/20 text-[10px]
                                 font-black flex items-center justify-center"
                    >
                      {count}
                    </span>
                  )}
                  <svg
                    width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {isOpen && (
                  <>
                    {/* Click-outside close */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenGroup(null)}
                    />
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

          {/* Result count */}
          {(resultCount !== undefined || totalCount !== undefined) && (
            <>
              <div className="filter-divider hidden sm:block h-7 ml-1" />
              <span
                key={resultCount}
                className="count-pop text-[11px] font-semibold text-zinc-400 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {resultCount !== undefined ? (
                  <>
                    <span className="text-zinc-800 font-black">{resultCount}</span>
                    {totalCount !== undefined && (
                      <span className="text-zinc-300"> / {totalCount}</span>
                    )}
                    {' '}résultat{resultCount > 1 ? 's' : ''}
                  </>
                ) : (
                  <span className="text-zinc-800 font-black">{totalCount} total</span>
                )}
              </span>
            </>
          )}

          {/* Clear all */}
          {totalActive > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="clear-btn sm:ml-auto flex items-center gap-1.5 text-[11px]
                         font-semibold text-zinc-400"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Tout effacer
            </button>
          )}
        </div>


      </div>
    </>
  );
}
