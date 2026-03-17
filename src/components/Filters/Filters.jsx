import { useState, useCallback, useEffect, useRef } from 'react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --gold:        #C9A84C;
    --gold-light:  #E8C96A;
    --gold-dim:    rgba(201,168,76,0.12);
    --gold-border: rgba(201,168,76,0.28);
    --ink:         #0C0C0C;
    --ink-80:      rgba(12,12,12,0.80);
    --white:       #FFFFFF;
    --off-white:   #F9F8F5;
    --border:      rgba(12,12,12,0.10);
    --muted:       #8A8680;
    --font:        'Outfit', sans-serif;
    --mono:        'DM Mono', monospace;
  }

  /* ── Level Toggle ── */
  .lvl-wrap {
    display: inline-flex;
    background: var(--off-white);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 4px;
    gap: 3px;
  }
  .lvl-btn {
    font-family: var(--font);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 8px 18px;
    border-radius: 10px;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.22,1,0.36,1);
    white-space: nowrap;
  }
  .lvl-btn--off {
    background: transparent;
    color: var(--muted);
  }
  .lvl-btn--off:hover {
    color: var(--ink);
    background: rgba(12,12,12,0.04);
  }
  .lvl-btn--on {
    background: var(--ink);
    color: var(--white);
    border-color: var(--ink);
    box-shadow: 0 3px 12px rgba(12,12,12,0.22), 0 1px 3px rgba(12,12,12,0.14);
  }

  /* ── Filter button ── */
  .flt-btn {
    font-family: var(--font);
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 16px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--white);
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
  }
  .flt-btn:hover {
    border-color: rgba(12,12,12,0.28);
    color: var(--ink);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(12,12,12,0.07);
  }
  .flt-btn--active {
    background: var(--ink) !important;
    color: var(--white) !important;
    border-color: var(--ink) !important;
    box-shadow: 0 4px 14px rgba(12,12,12,0.20) !important;
  }
  .flt-btn:active { transform: scale(0.97); }

  /* ── Divider ── */
  .flt-sep {
    width: 1px;
    background: var(--border);
    align-self: stretch;
  }

  /* ── Result count ── */
  .res-count {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    white-space: nowrap;
    letter-spacing: 0.03em;
  }
  .res-count strong { color: var(--ink); font-weight: 500; }

  /* ── Dropdown ── */
  @keyframes dropReveal {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .drop-panel {
    animation: dropReveal 0.2s cubic-bezier(0.22,1,0.36,1) both;
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 50;
    min-width: 200px;
    width: 100%;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 16px 40px rgba(12,12,12,0.10), 0 4px 12px rgba(12,12,12,0.06);
    overflow: hidden;
  }
  .drop-header {
    padding: 10px 14px 8px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .drop-label {
    font-family: var(--mono);
    font-size: 9.5px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .drop-count {
    font-family: var(--mono);
    font-size: 9.5px;
    color: var(--gold);
    font-weight: 500;
  }
  .drop-item {
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-family: var(--font);
    font-size: 13px;
    color: #374151;
    transition: background 0.14s ease;
  }
  .drop-item:hover { background: rgba(201,168,76,0.06); }
  .drop-item.is-sel { background: rgba(201,168,76,0.09); }
  .drop-item.is-sel .ditem-text { font-weight: 600; color: var(--ink); }
  .ditem-left { display: flex; align-items: center; gap: 10px; }
  .ditem-check {
    width: 16px; height: 16px;
    border-radius: 5px;
    border: 1.5px solid var(--border);
    background: var(--white);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.14s ease, background 0.14s ease;
  }
  .drop-item.is-sel .ditem-check {
    background: var(--gold);
    border-color: var(--gold);
  }
  .ditem-sub {
    font-family: var(--mono);
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const FILTER_GROUPS = [
  {
    key: 'niveau', label: 'Niveau', single: true,
    options: [
      { value: 'Licence', label: 'Licence', sub: 'binôme' },
      { value: 'Master',  label: 'Master',  sub: 'individuel' },
    ],
  },
  {
    key: 'statut', label: 'Statut', single: false,
    options: [
      { value: 'disponible', label: 'Disponible' },
      { value: 'urgent',     label: 'Urgent' },
      { value: 'complet',    label: 'Complet' },
    ],
  },
  {
    key: 'domaine', label: 'Domaine', single: false,
    options: [
      { value: 'tech',      label: 'Tech & Numérique' },
      { value: 'finance',   label: 'Finance' },
      { value: 'sante',     label: 'Santé' },
      { value: 'droit',     label: 'Droit' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'industrie', label: 'Industrie' },
    ],
  },
];

const DEFAULT_FILTERS = {
  niveau: [],
  statut: [],
  domaine: [],
};

function normalizeDomainOptions(domainOptions = []) {
  if (!Array.isArray(domainOptions) || domainOptions.length === 0) {
    return FILTER_GROUPS.find((group) => group.key === 'domaine')?.options ?? [];
  }

  return domainOptions
    .filter((option) => option?.value && option?.label)
    .map((option) => ({
      value: option.value,
      label: option.label,
      sub: option.sub,
    }));
}

function DropdownPanel({ group, selected, onToggle, onClose }) {
  return (
    <div className="drop-panel">
      <div className="drop-header">
        <span className="drop-label">{group.label}</span>
        {selected.length > 0 && (
          <span className="drop-count">{selected.length} sél.</span>
        )}
      </div>
      <div style={{ padding: '4px 0' }}>
        {group.options.map(opt => {
          const isSel = selected.includes(opt.value);
          return (
            <button key={opt.value} type="button"
              className={`drop-item ${isSel ? 'is-sel' : ''}`}
              onClick={() => { onToggle(opt.value); onClose(); }}>
              <span className="ditem-left">
                <span className="ditem-check">
                  {isSel && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0C0C0C" strokeWidth="3.2" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="ditem-text">{opt.label}</span>
              </span>
              {opt.sub && <span className="ditem-sub">{opt.sub}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Filters({
  level,
  filters,
  domainOptions,
  onLevelChange,
  resultCount,
  totalCount,
  onFiltersChange,
}) {
  const [activeFilters, setActiveFilters] = useState({
    ...DEFAULT_FILTERS,
    ...(filters ?? {}),
    niveau: filters?.niveau?.length ? filters.niveau : (level ? [level] : []),
  });
  const [openGroup, setOpenGroup] = useState(null);
  const shouldNotifyParentRef = useRef(false);
  const availableGroups = FILTER_GROUPS.map((group) => (
    group.key === 'domaine'
      ? { ...group, options: normalizeDomainOptions(domainOptions) }
      : group
  ));

  useEffect(() => {
    setActiveFilters(prev => {
      const nextLevel = level ? [level] : [];
      if ((prev.niveau ?? [])[0] === nextLevel[0]) return prev;
      return { ...prev, niveau: nextLevel };
    });
  }, [level]);

  useEffect(() => {
    if (!filters) return;
    setActiveFilters(prev => {
      const next = {
        ...DEFAULT_FILTERS,
        ...filters,
        niveau: filters?.niveau?.length ? filters.niveau : (level ? [level] : []),
      };

      const unchanged = ['niveau', 'statut', 'domaine']
        .every((key) => JSON.stringify(prev[key] ?? []) === JSON.stringify(next[key] ?? []));

      return unchanged ? prev : next;
    });
  }, [filters, level]);

  useEffect(() => {
    if (!shouldNotifyParentRef.current) return;
    shouldNotifyParentRef.current = false;
    onFiltersChange?.(activeFilters);
  }, [activeFilters, onFiltersChange]);

  const syncLevel = useCallback((val) => {
    shouldNotifyParentRef.current = true;
    setActiveFilters(prev => ({ ...prev, niveau: [val] }));
    onLevelChange?.(val);
  }, [onLevelChange]);

  const toggleFilter = (groupKey, value) => {
    const group = availableGroups.find(g => g.key === groupKey);
    shouldNotifyParentRef.current = true;
    setActiveFilters(prev => {
      if (group.single) {
        return { ...prev, [groupKey]: [value] };
      }

      const cur = prev[groupKey];
      return { ...prev, [groupKey]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] };
    });
    if (group?.single && groupKey === 'niveau') onLevelChange?.(value);
  };

  const niveauGroup = availableGroups.find(g => g.key === 'niveau');

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ fontFamily: 'var(--font)' }}>
        <div className="flex flex-wrap items-center gap-2.5">

          {/* Level Toggle */}
          <div className="lvl-wrap shrink-0">
            {niveauGroup.options.map(opt => (
              <button key={opt.value} type="button"
                className={`lvl-btn ${(activeFilters.niveau ?? []).includes(opt.value) ? 'lvl-btn--on' : 'lvl-btn--off'}`}
                onClick={() => syncLevel(opt.value)}>
                {opt.label}
                {opt.sub && (
                  <span style={{ marginLeft: 5, fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', opacity: 0.5, fontSize: 9 }}>
                    · {opt.sub}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flt-sep hidden sm:block" style={{ height: 30 }} />

          {/* Dropdowns */}
          {availableGroups.filter(g => g.key !== 'niveau').map(group => {
            const isOpen = openGroup === group.key;
            const isActive = (activeFilters[group.key] ?? []).length > 0;

            return (
              <div key={group.key} className="relative w-full sm:w-auto">
                <button type="button"
                  className={`flt-btn w-full sm:w-auto ${isActive ? 'flt-btn--active' : ''}`}
                  onClick={() => setOpenGroup(isOpen ? null : group.key)}>
                  {group.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease', opacity: 0.6 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenGroup(null)} />
                    <DropdownPanel
                      group={group}
                      selected={activeFilters[group.key] ?? []}
                      onToggle={val => toggleFilter(group.key, val)}
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
              <div className="flt-sep hidden sm:block" style={{ height: 30 }} />
              <span className="res-count">
                {resultCount !== undefined ? (
                  <><strong>{resultCount}</strong>{totalCount !== undefined && <> / {totalCount}</>} résultat{resultCount !== 1 ? 's' : ''}</>
                ) : (
                  <strong>{totalCount}</strong>
                )}
              </span>
            </>
          )}

        </div>
      </div>
    </>
  );
}
