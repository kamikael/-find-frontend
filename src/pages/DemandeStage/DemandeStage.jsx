import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Filters from '../../components/Filters/Filters';
import { useApplication } from '../../context/ApplicationContext';
import { getSectors } from '../../utils/api';
/* ══════════════════════════════════════════════════════════════════
   PALETTE GLOBALE
   ─ Base    : #ffffff blanc  /  #09090b noir
   ─ Accent  : #6366F1 indigo (moderne, tech, confiance)
   ─ Chaud   : #F59E0B amber  (urgence, énergie)
   ─ Neutre  : gamme zinc pour les gris
══════════════════════════════════════════════════════════════════ */
const C = {
  indigo:       '#6366F1',
  indigoLight:  '#EEF2FF',
  indigoDim:    'rgba(99,102,241,0.12)',
  amber:        '#F59E0B',
  amberLight:   '#FFFBEB',
  black:        '#09090b',
  white:        '#ffffff',
  success:      '#16A34A',
  successLight: '#F0FDF4',
  danger:       '#DC2626',
  dangerLight:  '#FEF2F2',
};

/* ══════════════════════════════════════════════
   STYLES GLOBAUX
══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --indigo:      #6366F1;
    --indigo-light:#EEF2FF;
    --amber:       #F59E0B;
    --amber-light: #FFFBEB;
    --ink:         #09090b;
  }

  /* ── Live dot indigo ── */
  @keyframes pulse-indigo {
    0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,.55); }
    50%      { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
  }
  .live-dot { animation: pulse-indigo 2s ease-in-out infinite; }

  /* ── Card entrance ── */
  @keyframes card-rise {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-entry {
    opacity: 0;
    animation: card-rise .5s cubic-bezier(.22,1,.36,1) forwards;
  }

  /* ── Hero reveal ── */
  @keyframes hero-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-in    { animation: hero-in .5s ease both; }
  .hero-in.d1 { animation-delay: .08s; }
  .hero-in.d2 { animation-delay: .18s; }
  .hero-in.d3 { animation-delay: .28s; }
  .hero-in.d4 { animation-delay: .40s; }

  /* ── Spinner ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin .9s linear infinite; }

  /* ── Skeleton ── */
  @keyframes shimmer {
    0%   { background-position: -500px 0; }
    100% { background-position:  500px 0; }
  }
  .skel {
    background: linear-gradient(90deg,#f4f4f5 25%,#e4e4e7 50%,#f4f4f5 75%);
    background-size: 500px 100%;
    animation: shimmer 1.2s infinite;
    border-radius: .875rem;
  }

  /* ── Toast ── */
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(32px) scale(.97); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  .toast-in { animation: toast-in .28s cubic-bezier(.22,1,.36,1) both; }

  /* ── Grain texture ── */
  .grain::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E");
  }

  :focus-visible { outline: 2px solid var(--indigo); outline-offset: 3px; border-radius: 6px; }
  select { -webkit-appearance:none; appearance:none; }

  /* ══ STEPPER ══ */
  .step-active {
    background: var(--indigo) !important;
    border-color: var(--indigo) !important;
    color: white !important;
  }
  .step-done {
    background: var(--ink) !important;
    border-color: var(--ink) !important;
    color: white !important;
  }

  /* ══ SECTOR CARD ══ */
  @keyframes bar-fill {
    from { width: 0%; }
    to   { width: var(--bar-target); }
  }
  @keyframes dot-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%     { opacity:.45; transform:scale(1.5); }
  }
  .sc-bar-animated {
    animation: bar-fill .9s cubic-bezier(.16,1,.3,1) forwards;
    animation-delay:.2s;
    width:0%;
  }
  .sc-dot-urgent { animation: dot-pulse 1.5s ease-in-out infinite; }

  /* Card elevation */
  .sc-card {
    transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .2s;
  }
  .sc-root:not(.sc-full):hover .sc-card {
    transform: translateY(-3px);
    box-shadow:
      0 0 0 1px rgba(99,102,241,0.14),
      0 20px 56px -12px rgba(0,0,0,0.14),
      0 6px 18px -6px rgba(99,102,241,0.10);
    border-color: rgba(99,102,241,0.22);
  }

  /* Sector CTA - transparent indigo */
  .sc-cta {
    position: relative;
    overflow: hidden;
    background: transparent;
    border: 1.5px solid #6366F1;
    color: #6366F1;
    border-radius: 18px;
    padding: 9px 22px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: all .3s ease;
  }
  .sc-root:not(.sc-full):hover .sc-cta {
    background: #6366F1;
    color: #FFFFFF;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.25);
  }
  .sc-cta:active { transform: scale(.98); }
  .sc-cta .sc-cta-arrow { transition: transform .3s ease; }
  .sc-root:not(.sc-full):hover .sc-cta .sc-cta-arrow { transform: translateX(3px); }

  /* Separator */
  .sc-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(0,0,0,0.06),transparent); }

  /* Hover accent line */
  .sc-root:not(.sc-full):hover [data-accent-line] { opacity: 1 !important; }

  /* ══ CONTROL BAR ══ */
  .ctrl-search {
    transition: border-color .3s ease, box-shadow .3s ease;
  }
  .ctrl-search:focus {
    outline: none;
    border-color: #111111 !important;
    box-shadow: inset 0 -2px 0 #111111;
  }

  .inst-select {
    background: transparent;
    border: 1.5px solid #111111;
    color: #111111;
    letter-spacing: .02em;
    transition: all .3s ease;
  }
  .inst-select:hover {
    background: #111111;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.18);
  }
  .inst-select:focus {
    outline: none;
    border-color: #111111 !important;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.14);
  }

  .certified-btn {
    background: #6366F1;
    border: 1px solid #6366F1;
    color: #ffffff;
    transition: none;
  }
  .certified-btn:hover {
    background: #6366F1;
    color: #ffffff;
    transform: none;
    box-shadow: none;
  }

  /* ══ HERO UNDERLINE — indigo ══ */
  .hero-underline { stroke: var(--indigo); }

  /* ══ FOND ARRIÈRE — ivoire + radial-gradient ══ */
  .hero-bg {
    background-color: #faf9f7;
    background-image:
      radial-gradient(circle at 20% 50%, rgba(99,102,241,0.04) 0%, transparent 55%),
      radial-gradient(circle at 80% 20%, rgba(245,158,11,0.03) 0%, transparent 45%);
  }
`;

/* ══════════════════════════════════════════════
   ICÔNES SVG PAR SECTEUR
══════════════════════════════════════════════ */
const SECTOR_ICONS = {
  informatique:  (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  numérique:     (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  marketing:     (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  communication: (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  finance:       (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  comptabilité:  (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  banque:        (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="11" width="20" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  santé:         (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  médical:       (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  droit:         (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  juridique:     (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  industrie:     (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M7 20V10l5-5 5 5v10M10 20v-5h4v5"/></svg>,
  ingénierie:    (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M17.66 17.66l-1.41-1.41M6.34 17.66l1.41-1.41"/></svg>,
  btp:           (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M7 20V10l5-5 5 5v10M10 20v-5h4v5"/></svg>,
  rh:            (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ressources:    (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  commerce:      (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  vente:         (c) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

function getSectorIcon(sector, color = '#09090b') {
  const name = (sector.name ?? '').toLowerCase();
  for (const [key, fn] of Object.entries(SECTOR_ICONS)) {
    if (name.includes(key)) return fn(color);
  }
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   PALETTE SECTEUR — teintes très légères
   L'accent indigo/amber reste réservé à l'UI globale.
   Ici on utilise des teintes neutres par domaine.
══════════════════════════════════════════════ */
const SECTOR_ACCENTS = [
  { keys: ['informatique','numérique','tech','digital'], hex: C.indigo,   tint: C.indigoLight },
  { keys: ['finance','comptabilité','banque'],           hex: '#0D9488',  tint: '#F0FDFA'     },
  { keys: ['santé','médical','soin'],                    hex: '#E11D48',  tint: '#FFF1F2'     },
  { keys: ['droit','juridique','notaire'],               hex: C.amber,    tint: C.amberLight  },
  { keys: ['marketing','communication','pub'],           hex: '#7C3AED',  tint: '#F5F3FF'     },
  { keys: ['industrie','btp','construction','ingénierie'], hex: '#0284C7', tint: '#F0F9FF'    },
  { keys: ['rh','ressources','humaines'],                hex: '#475569',  tint: '#F8FAFC'     },
  { keys: ['commerce','vente','retail'],                 hex: '#EA580C',  tint: '#FFF7ED'     },
];

function getAccent(sector) {
  const name = (sector.name ?? '').toLowerCase();
  for (const p of SECTOR_ACCENTS) {
    if (p.keys.some((k) => name.includes(k))) return p;
  }
  return { hex: '#52525B', tint: '#FAFAFA' };
}

/* ══════════════════════════════════════════════
   SECTOR CARD
══════════════════════════════════════════════ */
function SectorCard({ sector, level, onApply }) {
  const isFull   = (sector.remaining ?? 0) <= 0;
  const isUrgent = !isFull && (sector.remaining ?? 0) <= 3;
  const accent   = getAccent(sector);

  const fillPct = (sector.total ?? 0) > 0
    ? Math.round(((sector.total - sector.remaining) / sector.total) * 100)
    : null;

  const rootRef = useRef(null);
  const onMove  = (e) => {
    const el = rootRef.current; if (!el) return;
    const r  = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top)  / r.height) * 100}%`);
  };

  /* Status — couleurs système cohérentes */
  const status = isFull
    ? { label: 'Complet',   dot: '#F87171', pill: { bg: C.dangerLight, color: C.danger,  border: '#FECACA' }, bar: C.danger  }
    : isUrgent
      ? { label: `${sector.remaining} place${sector.remaining > 1 ? 's' : ''}`,
          dot: C.amber, pill: { bg: C.amberLight, color: '#B45309', border: '#FDE68A' }, bar: C.amber,
          dotCls: 'sc-dot-urgent' }
      : { label: 'Disponible', dot: '#4ADE80', pill: { bg: C.successLight, color: C.success, border: '#BBF7D0' }, bar: accent.hex };

  return (
    <article
      ref={rootRef}
      onMouseMove={onMove}
      className={`sc-root${isFull ? ' sc-full opacity-50 pointer-events-none' : ''}`}
    >
      <div className="sc-card flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_14px_rgba(0,0,0,0.04)]">

        {/* ── Header teinté ── */}
        <div className="relative px-5 pt-5 pb-4"
          style={{ background: accent.tint }}>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-200/70" />

          <h2 className="text-[1rem] font-semibold text-zinc-900 leading-snug tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
            {sector.name}
          </h2>
        </div>

        {/* -- Body -- */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-5 bg-white">

          {sector.domain && (
            <p className="mb-4 text-[11px] text-zinc-400 font-medium">{sector.domain}</p>
          )}

          {/* Progress */}
          {fillPct !== null && (
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-zinc-400 tabular-nums">
                  {sector.total - sector.remaining} / {sector.total} places
                </span>
                <span className="text-[11px] font-semibold tabular-nums" style={{ color: status.bar }}>
                  {fillPct}%
                </span>
              </div>
              <div className="h-[3px] w-full rounded-full bg-zinc-100 overflow-hidden">
                <div className="sc-bar-animated h-full rounded-full"
                  style={{ '--bar-target': `${fillPct}%`, background: status.bar }} />
              </div>
            </div>
          )}

          <div className="sc-divider mb-4" />

          {/* Niveau — indigo accent quand actif */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1
                             text-[10px] font-semibold uppercase tracking-[0.13em]
                             border border-zinc-200 bg-zinc-50 text-zinc-500">
              {level === 'Licence' ? (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ) : (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              )}
              {level}
            </span>
            {level === 'Licence' && <span className="text-[10px] text-zinc-400">· Binôme requis</span>}
          </div>

          {/* CTA */}
          {isFull ? (
            <div className="w-full rounded-xl py-3 text-center text-[12px] font-medium text-zinc-300 bg-zinc-50 border border-zinc-100">
              Section complète
            </div>
          ) : (
            <button
              onClick={() => onApply(sector)}
              className="sc-cta w-full text-[13px] flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Postuler
                <svg className="sc-cta-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </button>
          )}
        </div>

        {/* Accent line bas — couleur secteur */}
        <div className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full opacity-0 transition-opacity duration-300"
          style={{ background: accent.hex }} data-accent-line />
      </div>
    </article>
  );
}

/* ══════════════════════════════════════════════
   TOAST — indigo
══════════════════════════════════════════════ */
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className="toast-in pointer-events-auto flex items-center gap-3
                     pl-3.5 pr-3 py-3 rounded-2xl max-w-full sm:max-w-[340px]
                     border text-sm font-medium leading-snug"
          style={{
            background: '#ffffff',
            color: '#111111',
            border: '1px solid #E5E5E5',
            boxShadow: '0 10px 26px rgba(0,0,0,0.10)',
            fontFamily: 'DM Sans, system-ui, sans-serif',
          }}>
          {t.icon && (
            <span
              className="shrink-0 w-7 h-7 rounded-lg grid place-items-center text-[13px]"
              style={{ background: '#EEF2FF', color: '#4F46E5' }}
            >
              {t.icon}
            </span>
          )}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)}
            className="shrink-0 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SEARCH BAR — focus ring indigo
══════════════════════════════════════════════ */
function SearchBar({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); ref.current?.focus(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  return (
    <div className="relative group w-full sm:w-auto" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-700 transition-colors duration-300"
        width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        ref={ref} type="text" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher..."
        className="ctrl-search w-full sm:w-48 pl-9 pr-12 py-2.5 bg-white border border-[#E5E5E5] rounded-[10px]
                   text-sm text-zinc-900 placeholder:text-zinc-400"
      />
      {value ? (
        <button onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors duration-300 p-0.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      ) : (
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none
                        text-[9px] text-zinc-300 bg-[#FAFAF8] border border-[#E5E5E5]
                        rounded px-1.5 py-0.5 font-mono select-none">Ctrl+K</kbd>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   STEPPER — actif en indigo
══════════════════════════════════════════════ */
function Stepper({ step }) {
  const steps = ['Choisir un secteur', 'Remplir le dossier', 'Confirmation'];
  return (
    <div className="flex items-center justify-center flex-wrap gap-y-3" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      {steps.map((label, i) => {
        const id = i + 1;
        const done = id < step;
        const current = id === step;
        return (
          <div key={id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-400 bg-white"
                style={{ borderColor: C.indigo, color: C.indigo }}
              >
                {id}
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-center w-[78px] sm:w-auto whitespace-normal sm:whitespace-nowrap text-zinc-600">
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden sm:block w-20 sm:w-28 h-px mx-3 mb-4 rounded-full transition-all duration-700"
                style={{ background: done ? C.indigo : '#e4e4e7' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ANIMATED NUMBER
══════════════════════════════════════════════ */
function Num({ value }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!value) return;
    let f = 0;
    const T = setInterval(() => {
      f++;
      setN(Math.round((1 - Math.pow(1 - f / 40, 3)) * value));
      if (f >= 40) { setN(value); clearInterval(T); }
    }, 900 / 40);
    return () => clearInterval(T);
  }, [value]);
  return <>{n}</>;
}

/* ══════════════════════════════════════════════
   STATS BAR — icônes indigo/amber
══════════════════════════════════════════════ */
function StatsBar({ sectors }) {
  const getR = (s) => s.remaining ?? s.available ?? s.left ?? null;
  const getT = (s) => s.total ?? s.capacity ?? s.spots ?? null;

  const hasData = sectors.some((s) => getT(s) !== null);
  const totPlaces = sectors.reduce((a, s) => a + (getT(s) ?? 0), 0);
  const totRem = sectors.reduce((a, s) => a + (getR(s) ?? 0), 0);
  const pct = totPlaces > 0 ? Math.round(((totPlaces - totRem) / totPlaces) * 100) : 0;
  const open = sectors.filter((s) => { const r = getR(s); return r === null || r > 0; }).length;

  const [bar, setBar] = useState(0);
  useEffect(() => {
    if (!hasData) return;
    const t = setTimeout(() => setBar(pct), 350);
    return () => clearTimeout(t);
  }, [pct, hasData]);

  const cells = [
    {
      key: 'open', always: true, val: open, label: 'SECTEURS OUVERTS',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F343A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
    },
    {
      key: 'rem', always: false, val: totRem, label: 'PLACES RESTANTES',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F343A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      key: 'tot', always: false, val: totPlaces, label: 'PLACES AU TOTAL',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F343A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-14 rounded-xl overflow-hidden border border-[#E5E5E5] bg-[#FAFAF8] shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
      style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E5]">
        {cells.map(({ key, always, val, label, icon }) => (
          <div key={key} className="flex flex-col items-center justify-center gap-4 py-10 sm:py-12 px-8 sm:px-10">
            <div className="text-[#2F343A]">{icon}</div>
            <p className="relative -top-[1px] text-[48px] font-medium text-[#111111] leading-none text-center"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '-1px', fontVariantNumeric: 'lining-nums tabular-nums' }}>
              {always || hasData ? <Num value={val} /> : <span className="text-zinc-300 text-3xl">-</span>}
            </p>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#6B7280] text-center"
              style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

const SORT_OPTIONS = [
  { value: 'default', label: 'Par defaut' },
  { value: 'places', label: 'Plus de places' },
  { value: 'alpha', label: 'Alphabetique' },
];

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((opt) => opt.value === value) ?? SORT_OPTIONS[0];

  const selectValue = (next) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="relative shrink-0 w-full sm:w-auto" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inst-select w-full sm:w-[190px] flex items-center justify-between gap-2 px-4 py-2.5 rounded-[10px]
                   text-sm font-medium"
      >
        <span>{current.label}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-[220px] bg-white border border-[#E5E5E5] rounded-[10px]
                          shadow-[0_10px_24px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E5E5E5]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">TRI</p>
            </div>
            <div className="py-1">
              {SORT_OPTIONS.map((opt) => {
                const active = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectValue(opt.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-300 ${
                      active ? 'bg-[#F5F5F2] text-[#111111] font-medium' : 'text-zinc-700 hover:bg-[#F8F8F6]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
function GlowCursor() {
  const r = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (r.current) { r.current.style.left = e.clientX+'px'; r.current.style.top = e.clientY+'px'; } };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);
  return (
    <div ref={r} style={{
      position:'fixed', width:480, height:480, borderRadius:'50%',
      background:`radial-gradient(circle,rgba(99,102,241,0.03) 0%,transparent 65%)`,
      pointerEvents:'none', transform:'translate(-50%,-50%)', zIndex:1,
    }} />
  );
}

/* ══════════════════════════════════════════════
   PAGE PRINCIPALE — DemandeStage
══════════════════════════════════════════════ */
const DOMAIN_KEYWORDS = {
  tech: ['informatique', 'developpement', 'numerique', 'tech', 'digital'],
  finance: ['finance', 'comptabilite', 'banque'],
  sante: ['sante', 'medical', 'soin'],
  droit: ['droit', 'juridique', 'notaire'],
  marketing: ['marketing', 'communication', 'pub'],
  industrie: ['industrie', 'ingenierie', 'btp', 'construction'],
};

const stripAccents = (value = '') =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function matchStatus(sector, statuses = []) {
  if (!statuses.length) return true;
  const remaining = sector.remaining ?? 0;

  return statuses.some((status) => {
    if (status === 'disponible') return remaining > 0;
    if (status === 'urgent') return remaining > 0 && remaining <= 3;
    if (status === 'complet') return remaining <= 0;
    return false;
  });
}

function matchDomain(sector, domains = []) {
  if (!domains.length) return true;
  const haystack = stripAccents(sector.name ?? '');

  return domains.some((domain) => {
    const keywords = DOMAIN_KEYWORDS[domain] ?? [];
    return keywords.some((keyword) => haystack.includes(keyword));
  });
}

export default function DemandeStage() {
  const navigate = useNavigate();
  const { setSectorAndModality } = useApplication();

  const [level, setLevel]     = useState('Licence');
  const [data, setdata] = useState([]);
  const [filters, setFilters] = useState({ niveau: ['Licence'], statut: [], domaine: [] });
  const [search, setSearch]   = useState('');
  const [sortBy, setSortBy]   = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [toasts, setToasts]   = useState([]);
  const tid = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => { setIsLoading(false); setVisible(true); }, 900);
    return () => clearTimeout(t);
  }, []);

  const addToast = useCallback((message, icon = '✨') => {
    const id = ++tid.current;
    setToasts((p) => [...p, { id, message, icon }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4200);
  }, []);
  const removeToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  const handleApply = (sector) => {
    if ((sector.remaining ?? 0) <= 0) { addToast('Ce secteur est complet.', '⚠️'); return; }
    setSectorAndModality(sector, level);
    addToast(`Candidature "${sector.name}" démarrée.`, '');
    setTimeout(() => navigate('/formulaire'), 550);
  };
  const handleLevel = (v) => {
    setLevel(v);
    addToast(v === 'Licence' ? 'Mode binôme activé.' : 'Mode individuel activé.', '🔄');
  };

  const handleFiltersChange = useCallback((next) => {
    setFilters(next);
    const nextLevel = next?.niveau?.[0];
    if (nextLevel && nextLevel !== level) {
      setLevel(nextLevel);
    }
  }, [level]);
  
  useEffect(()=>{

   (async () => {
    const sectors = await getSectors(); 
    setdata(sectors.map(item=>{
  return {
    id : item.id ?? item._id ?? null,
    name: item.name,
    description: item.description,
    domain: item.name,
    remaining: item.available_slots,
    total: item.total_slots,
  }
}) ?? []);
  })().catch(console.error);
  
},[])

const sectors = data
  .filter((s) =>
    !search
    || stripAccents(s.name ?? '').includes(stripAccents(search))
    || stripAccents(s.description ?? '').includes(stripAccents(search))
  )
  .filter((s) => matchStatus(s, filters.statut))
  .filter((s) => matchDomain(s, filters.domaine))
  .sort((a, b) => {
    if (sortBy === 'places') return (b.remaining ?? 0) - (a.remaining ?? 0);
    if (sortBy === 'alpha')  return (a.name ?? '').localeCompare(b.name ?? '');
    return 0;
  });
  

  return (
    <>
      <style>{STYLES}</style>
      <GlowCursor />

      <div className="grain min-h-screen bg-white flex flex-col"
        style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
        <Navbar />

        <main className="flex-1 relative z-10">

          {/* ══ HERO ══ */}
          <div className="hero-bg border-b border-zinc-100 pt-10 sm:pt-14 pb-10 sm:pb-12 px-4 sm:px-6">
            <div className="max-w-[1120px] mx-auto space-y-6 sm:space-y-8">

              {/* Live pill — indigo */}
              <div className="flex justify-center hero-in">
                <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5
                                border border-zinc-200 bg-white shadow-sm">
                  <span className="live-dot w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: C.indigo }} />
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-500 text-center">
                    Réservations ouvertes · Promo 2026
                  </span>
                </div>
              </div>

              {/* Stepper */}
              <div className="hero-in d1"><Stepper step={1} /></div>

              {/* Headline — underline indigo */}
              <div className="text-center hero-in d2">
                <h1 className="text-[clamp(2.4rem,5.5vw,4.2rem)] font-black tracking-tight leading-[1.05] text-zinc-950 mb-4"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  Trouvez votre{' '}
                  <em className="not-italic inline-block">
                    Opportunité
                  </em>
                </h1>
                <p className="text-zinc-400 text-[1.02rem] max-w-md mx-auto leading-relaxed font-normal">
                  Stage académique 2026 — sélectionnez un secteur et déposez votre candidature.
                </p>
              </div>

              {/* Chip niveau — indigo si actif */}
              <div className="flex justify-center hero-in d3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 text-center"
                  style={level === 'Licence'
                    ? { background: C.indigo, color: C.white, borderColor: C.indigo }
                    : { background: C.white, color: '#71717A', borderColor: '#E4E4E7' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {level === 'Licence' ? 'Inscription en binôme — Licence' : 'Inscription individuelle — Master'}
                </div>
              </div>
            </div>
          </div>

          {/* ══ CONTENU ══ */}
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-24">

            {!isLoading && <StatsBar sectors={data} />}

            {/* ── Barre de contrôle sticky ── */}
            <div className="hero-in d4 sticky top-2 sm:top-3 z-30 mb-10 sm:mb-12
                            flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center
                            bg-[#FAFAF8]/95 backdrop-blur-xl border border-[#E5E5E5] rounded-xl
                            px-4 sm:px-5 py-3.5
                            shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="flex-1 min-w-0">
                <Filters
                  level={level}
                  onLevelChange={handleLevel}
                  onFiltersChange={handleFiltersChange}
                  resultCount={sectors.length}
                  totalCount={data.length}
                />
              </div>

              <div className="hidden sm:block self-stretch w-px bg-[#E5E5E5] my-1" />

              <SearchBar value={search} onChange={setSearch} />

              <SortMenu value={sortBy} onChange={setSortBy} />


                            {/* Bouton certifie institutionnel */}
              <button
                type="button"
                className="certified-btn hidden lg:flex shrink-0 items-center gap-1.5 px-4 py-2.5 rounded-[10px]
                              text-[11px] font-semibold tracking-[0.04em]"
                style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <polyline points="17 11 19 13 23 9"/>
                </svg>
                Places certifiees
              </button>
            </div>

            {/* Compteur */}
            {!isLoading && search && (
              <p className="text-sm text-zinc-400 mb-7">
                {sectors.length === 0
                  ? <>Aucun résultat pour <strong className="text-zinc-800">"{search}"</strong></>
                  : <><strong className="text-zinc-800">{sectors.length}</strong> secteur{sectors.length > 1 ? 's' : ''} pour <strong className="text-zinc-800">"{search}"</strong></>}
              </p>
            )}

            {/* Skeletons */}
            {isLoading && (
              <div>
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skel h-[230px]" style={{ animationDelay: `${i * 0.07}s` }} />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2.5 mt-8 text-zinc-400 text-sm font-medium">
                  <span className="spin w-4 h-4 rounded-full border-2 border-zinc-200 border-t-zinc-500 inline-block"
                    style={{ borderTopColor: C.indigo }} />
                  Chargement des offres…
                </div>
              </div>
            )}

            {/* Grille */}
            {!isLoading && sectors.length > 0 && (
              <div className={`grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]
                              transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                {sectors.map((sector, i) => (
                  <div key={sector.id} className="card-entry" style={{ animationDelay: `${i * 0.05}s` }}>
                    <SectorCard sector={sector} level={level} onApply={handleApply} />
                  </div>
                ))}
              </div>
            )}    

            {/* État vide */}
            {!isLoading && sectors.length === 0 && (
              <div className="flex flex-col items-center text-center py-24 px-8
                              border-2 border-dashed border-zinc-100 rounded-2xl bg-zinc-50/40">
                <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-5 text-2xl">
                  {search ? '🔍' : '📭'}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1.5"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  {search ? 'Aucun résultat' : 'Aucune place disponible'}
                </h3>
                <p className="text-zinc-400 text-sm max-w-[260px] leading-relaxed mb-5">
                  {search ? `Aucun secteur ne correspond à "${search}".` : 'Tous les quotas sont remplis. Revenez bientôt.'}
                </p>
                {search && (
                  <button onClick={() => setSearch('')}
                    className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ background: C.indigo }}>
                    Effacer la recherche
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

      <Toast toasts={toasts} remove={removeToast} />
    </>
  );
}











