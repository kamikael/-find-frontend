import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Filters from '../../components/Filters/Filters';
import { useApplication } from '../../context/ApplicationContext';
import { getSectors } from '../../utils/api';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DESIGN TOKENS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const G = {
  gold:       '#C9A84C',
  goldLight:  '#E2C97E',
  goldDark:   '#A8892A',
  goldDim:    'rgba(201,168,76,0.10)',
  goldBorder: 'rgba(201,168,76,0.25)',
  ink:        '#0A0A0A',
  white:      '#FFFFFF',
  offWhite:   '#F9F8F5',
  border:     '#E8E4DC',
  muted:      '#8A8680',
  success:    '#15803D',
  successBg:  '#F0FDF4',
  danger:     '#DC2626',
  dangerBg:   '#FEF2F2',
  amber:      '#D97706',
  amberBg:    '#FFFBEB',
};

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GLOBAL STYLES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Cabinet+Grotesk:wght@300;400;500;600;700;800&display=swap');

  :root {
    --gold:        #C9A84C;
    --gold-light:  #E2C97E;
    --gold-dark:   #A8892A;
    --gold-dim:    rgba(201,168,76,0.10);
    --gold-border: rgba(201,168,76,0.25);
    --ink:         #0A0A0A;
    --white:       #FFFFFF;
    --off-white:   #F9F8F5;
    --border:      #E8E4DC;
    --muted:       #8A8680;
    --font-display: 'Cormorant Garamond', serif;
    --font-body:    'Cabinet Grotesk', sans-serif;
  }

  * { box-sizing: border-box; }

  /* â”€â”€ Page â”€â”€ */
  .ds-root {
    font-family: var(--font-body);
    background: var(--off-white);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-image:
      radial-gradient(ellipse 80% 50% at 0% 0%, rgba(201,168,76,0.05) 0%, transparent 55%),
      radial-gradient(ellipse 60% 40% at 100% 100%, rgba(201,168,76,0.04) 0%, transparent 55%);
  }

  /* â”€â”€ Animations â”€â”€ */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%{background-position:-600px 0;} 100%{background-position:600px 0;} }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes barFill  { from{width:0%;} to{width:var(--bw);} }
  @keyframes breathe  { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(1.7);} }
  @keyframes toastIn  { from{opacity:0;transform:translateX(20px) scale(.96);} to{opacity:1;transform:translateX(0) scale(1);} }
  @keyframes cardIn   { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
  @keyframes lineGrow { from{width:0;} to{width:48px;} }
  @keyframes shimmerGold {
    0%{background-position:-200% center;}
    100%{background-position:200% center;}
  }
  @keyframes urgentPulse {
    0%,100%{box-shadow:0 0 0 0 rgba(217,119,6,0.5);}
    50%{box-shadow:0 0 0 6px rgba(217,119,6,0);}
  }

  .au1  { animation: fadeUp .55s cubic-bezier(.16,1,.3,1) .05s both; }
  .au2  { animation: fadeUp .55s cubic-bezier(.16,1,.3,1) .12s both; }
  .au3  { animation: fadeUp .55s cubic-bezier(.16,1,.3,1) .20s both; }
  .au4  { animation: fadeUp .55s cubic-bezier(.16,1,.3,1) .28s both; }
  .au5  { animation: fadeUp .55s cubic-bezier(.16,1,.3,1) .36s both; }
  .a-card { opacity:0; animation: cardIn .45s cubic-bezier(.16,1,.3,1) forwards; }
  .a-toast { animation: toastIn .28s cubic-bezier(.22,1,.36,1) both; }
  .a-spin { animation: spin .85s linear infinite; }

  /* â”€â”€ Skeleton â”€â”€ */
  .skel {
    background: linear-gradient(90deg, #F0EDE6 25%, #E8E3DA 50%, #F0EDE6 75%);
    background-size: 600px 100%;
    animation: shimmer 1.3s infinite;
    border-radius: 20px;
  }

  /* â”€â”€ Gold breathe dot â”€â”€ */
  .g-dot { animation: breathe 2.2s ease-in-out infinite; }

  /* â”€â”€ Accent line â”€â”€ */
  .accent-line {
    display: block; height: 2px; border-radius: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    animation: lineGrow .65s cubic-bezier(.16,1,.3,1) .5s both;
  }

  /* â”€â”€ Gold heading shimmer â”€â”€ */
  .gold-shimmer {
    background: linear-gradient(120deg, var(--gold) 0%, var(--gold-light) 45%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerGold 4s linear infinite;
  }

  /* â”€â”€ Sector card â”€â”€ */
  .sc-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .25s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.04);
    cursor: pointer;
  }
  .sc-wrap:not(.is-full) .sc-card:hover {
    transform: translateY(-5px);
    border-color: var(--gold-border);
    box-shadow:
      0 0 0 1px rgba(201,168,76,0.15),
      0 20px 50px -10px rgba(0,0,0,0.12),
      0 8px 20px -5px rgba(201,168,76,0.12);
  }

  /* â”€â”€ Card CTA button â”€â”€ */
  .sc-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 18px;
    border-radius: 12px;
    border: 1.5px solid var(--ink);
    background: transparent;
    color: var(--ink);
    font-family: var(--font-body);
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    transition: background .25s ease, color .25s ease, border-color .2s ease, transform .2s ease, box-shadow .25s ease;
    cursor: pointer;
  }
  .sc-wrap:not(.is-full) .sc-card:hover .sc-btn {
    background: var(--ink);
    color: var(--white);
    box-shadow: 0 6px 18px rgba(0,0,0,0.16);
  }
  .sc-btn .arr { transition: transform .25s ease; }
  .sc-wrap:not(.is-full) .sc-card:hover .sc-btn .arr { transform: translateX(4px); }
  .sc-btn:active { transform: scale(.97); }

  /* â”€â”€ Gold CTA (apply btn hover state - alternative gold variant) â”€â”€ */
  .sc-wrap:not(.is-full) .sc-card:hover .sc-btn-gold {
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
    border-color: var(--gold);
    color: var(--white);
    box-shadow: 0 6px 20px rgba(201,168,76,0.30);
  }

  /* â”€â”€ Bar â”€â”€ */
  .bar-track { height: 3px; background: #EFEDE7; border-radius: 3px; overflow: hidden; }
  .bar-fill  { height: 100%; border-radius: 3px; animation: barFill .8s cubic-bezier(.16,1,.3,1) .2s both; }

  /* â”€â”€ Search â”€â”€ */
  .ds-search { transition: border-color .2s ease, box-shadow .2s ease; outline: none; }
  .ds-search:focus {
    border-color: var(--gold) !important;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.13);
  }

  /* â”€â”€ Sort dropdown â”€â”€ */
  .sort-btn {
    border: 1.5px solid #1a1a1a; color: #1a1a1a;
    transition: background .22s ease, color .22s ease, transform .2s ease, box-shadow .2s ease;
  }
  .sort-btn:hover {
    background: #1a1a1a; color: var(--white);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.14);
  }

  /* â”€â”€ Stepper â”€â”€ */
  .step-cur  { background: var(--gold) !important; border-color: var(--gold) !important; color: var(--white) !important; }
  .step-done { background: var(--ink) !important; border-color: var(--ink) !important; color: var(--white) !important; }

  /* â”€â”€ Stats card hover â”€â”€ */
  .stat-card { transition: transform .25s ease, box-shadow .25s ease, border-color .2s ease; }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.06);
    border-color: rgba(201,168,76,0.28);
  }

  /* â”€â”€ Sticky control bar â”€â”€ */
  .ctrl-bar {
    background: rgba(249,248,245,0.95);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  /* â”€â”€ Urgent ring â”€â”€ */
  .urgent-ring { animation: urgentPulse 1.8s ease-in-out infinite; }

  :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 6px; }
`;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SECTOR ICONS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const ICONS = {
  informatique:  c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  'numérique':   c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  marketing:     c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  communication: c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  finance:       c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  'comptabilité': c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  banque:        c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="11" width="20" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  'santé':       c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  droit:         c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  industrie:     c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M2 20h20M7 20V10l5-5 5 5v10M10 20v-5h4v5"/></svg>,
  'ingénierie':  c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>,
  rh:            c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  commerce:      c => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
};

function getSectorIcon(sector, color = G.ink) {
  const n = (sector.name ?? '').toLowerCase();
  for (const [k, fn] of Object.entries(ICONS)) {
    if (n.includes(k)) return fn(color);
  }
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>;
}

/* â”€â”€ Per-sector accent palettes â”€â”€ */
const ACCENTS = [
  { keys: ['informatique','numérique','tech','digital'], hex:'#C9A84C', tint:'#FDFAF0' },
  { keys: ['finance','comptabilité','banque'],           hex:'#0D9488', tint:'#F0FDFA' },
  { keys: ['santé','médical','soin'],                    hex:'#E11D48', tint:'#FFF1F2' },
  { keys: ['droit','juridique'],                         hex:'#7C3AED', tint:'#F5F3FF' },
  { keys: ['marketing','communication'],                 hex:'#0284C7', tint:'#F0F9FF' },
  { keys: ['industrie','btp','ingénierie'],              hex:'#EA580C', tint:'#FFF7ED' },
  { keys: ['rh','ressources'],                           hex:'#475569', tint:'#F8FAFC' },
  { keys: ['commerce','vente'],                          hex:'#A8892A', tint:'#FFFBEB' },
];

function getAccent(sector) {
  const n = (sector.name ?? '').toLowerCase();
  for (const p of ACCENTS) {
    if (p.keys.some(k => n.includes(k))) return p;
  }
  return { hex: '#6B7280', tint: '#F9FAFB' };
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STATUS CONFIG
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function getStatus(sector) {
  const r = sector.remaining ?? 0;
  if (r <= 0)   return { label: 'Complet',   dotColor: G.danger,  dotCls: '', pill: { bg: G.dangerBg, color: G.danger,  border: '#FECACA' }, barColor: G.danger,  isUrgent: false, isFull: true  };
  if (r <= 3)   return { label: `${r} place${r > 1 ? 's' : ''}`, dotColor: G.amber, dotCls: 'urgent-ring', pill: { bg: G.amberBg, color: G.amber, border: '#FDE68A' }, barColor: G.amber, isUrgent: true, isFull: false };
  return        { label: 'Disponible', dotColor: '#22C55E', dotCls: '', pill: { bg: G.successBg, color: G.success, border: '#BBF7D0' }, barColor: getAccent(sector).hex, isUrgent: false, isFull: false };
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SECTOR CARD
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function SectorCard({ sector, level, onApply }) {
  const accent  = getAccent(sector);
  const status  = getStatus(sector);
  const fillPct = (sector.total ?? 0) > 0
    ? Math.round(((sector.total - (sector.remaining ?? 0)) / sector.total) * 100)
    : null;

  return (
    <article className={`sc-wrap${status.isFull ? ' is-full' : ''}`} style={status.isFull ? { opacity: 0.52, pointerEvents: 'none' } : {}}>
      <div className="sc-card" onClick={() => !status.isFull && onApply(sector)}>

        {/* â”€â”€ Tinted header â”€â”€ */}
        <div className="relative px-5 pt-5 pb-4" style={{ background: accent.tint, borderBottom: `1px solid ${G.border}` }}>
          {/* Top row: icon + pill */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.75)', border: `1px solid ${accent.hex}28`, backdropFilter: 'blur(4px)' }}>
              {getSectorIcon(sector, accent.hex)}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 shrink-0 text-[10px] font-bold uppercase tracking-[0.10em]"
              style={{ background: status.pill.bg, color: status.pill.color, border: `1px solid ${status.pill.border}` }}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dotCls}`} style={{ background: status.dotColor }} />
              {status.label}
            </span>
          </div>

          {/* Sector name */}
          <h2 className="text-[15px] font-bold leading-snug tracking-tight text-gray-900"
            style={{ fontFamily: 'var(--font-body)' }}>
            {sector.name}
          </h2>
        </div>

        {/* â”€â”€ Card body â”€â”€ */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-4">

          {/* Progress bar */}
          {fillPct !== null && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10.5px] text-gray-400 font-medium">
                  {sector.total - (sector.remaining ?? 0)} / {sector.total} places
                </span>
                <span className="text-[10.5px] font-bold" style={{ color: status.barColor }}>
                  {fillPct}%
                </span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ '--bw': `${fillPct}%`, background: status.barColor }} />
              </div>
            </div>
          )}

          {/* Level badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] rounded-lg px-2.5 py-1 border"
              style={{ background: G.offWhite, color: G.muted, borderColor: G.border }}>
              {level === 'Licence'
                ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              }
              {level}
            </span>
            {level === 'Licence' && (
              <span className="text-[10px]" style={{ color: G.muted }}>· Binôme requis</span>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${G.border}, transparent)` }} />

          {/* CTA */}
          {status.isFull ? (
            <div className="w-full rounded-xl py-3 text-center text-[11.5px] font-semibold text-gray-300"
              style={{ background: '#F7F7F7', border: `1px solid #F0F0F0` }}>
              Section complète
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onApply(sector); }}
              className="sc-btn sc-btn-gold"
            >
              Postuler
              <svg className="arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          )}
        </div>

        {/* Bottom accent line revealed on hover */}
        <div className="absolute bottom-0 left-5 right-5 h-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, ${accent.hex}, ${accent.hex}66)` }} />
      </div>
    </article>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STEPPER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Stepper({ step }) {
  const steps = ['Choisir un secteur', 'Remplir le dossier', 'Confirmation'];
  return (
    <div className="flex items-center justify-center flex-wrap gap-y-3" style={{ fontFamily: 'var(--font-body)' }}>
      {steps.map((label, i) => {
        const id = i + 1;
        const done = id < step;
        const cur  = id === step;
        return (
          <div key={id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-300
                ${cur ? 'step-cur' : done ? 'step-done' : 'bg-white border-gray-200 text-gray-400'}`}>
                {done
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : id}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider text-center w-20 sm:w-auto
                ${cur ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden sm:block w-16 sm:w-24 h-px mx-3 mb-4 rounded-full transition-all duration-700"
                style={{ background: done ? G.gold : G.border }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ANIMATED NUMBER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STATS BAR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function StatsBar({ sectors }) {
  const getR = s => s.remaining ?? s.available ?? null;
  const getT = s => s.total ?? s.capacity ?? null;
  const hasData   = sectors.some(s => getT(s) !== null);
  const totPlaces = sectors.reduce((a, s) => a + (getT(s) ?? 0), 0);
  const totRem    = sectors.reduce((a, s) => a + (getR(s) ?? 0), 0);
  const open      = sectors.filter(s => { const r = getR(s); return r === null || r > 0; }).length;

  const stats = [
    { value: open,      label: 'Secteurs ouverts',  always: true,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.7" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
    { value: totRem,    label: 'Places restantes',   always: false,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.7" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { value: totPlaces, label: 'Places au total',    always: false,
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.7" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
  ];

  return (
    <div className="mb-10 rounded-2xl overflow-hidden border"
      style={{ borderColor: G.border, background: G.white, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E4DC]">
        {stats.map(({ value, label, icon, always }, i) => (
          <div key={i} className="stat-card flex flex-col sm:flex-row items-center gap-4 py-7 px-6 sm:px-8 cursor-default"
            style={{ borderColor: G.border }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)' }}>
              {icon}
            </div>
            <div className="text-center sm:text-left">
              <p className="leading-none mb-1 font-light" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: G.ink, letterSpacing: '-1px' }}>
                {always || hasData ? <Num value={value} /> : <span style={{ color: '#E0E0E0', fontSize: '1.8rem' }}>—</span>}
              </p>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em]" style={{ color: G.muted }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SEARCH BAR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function SearchBar({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); ref.current?.focus(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div className="relative w-full sm:w-auto">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
        width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        ref={ref} type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder="Rechercher un secteur..."
        className="ds-search w-full sm:w-52 pl-9 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-xl"
        style={{ border: `1.5px solid ${G.border}`, background: G.white, fontFamily: 'var(--font-body)' }}
      />
      {value ? (
        <button onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-700 transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      ) : (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-gray-300 pointer-events-none bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-mono">
          Ctrl+K
        </kbd>
      )}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SORT MENU
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const SORT_OPTIONS = [
  { value: 'default', label: 'Par défaut' },
  { value: 'places',  label: 'Plus de places' },
  { value: 'alpha',   label: 'Alphabétique' },
];

function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const cur = SORT_OPTIONS.find(o => o.value === value) ?? SORT_OPTIONS[0];
  return (
    <div className="relative w-full sm:w-auto" style={{ fontFamily: 'var(--font-body)' }}>
      <button type="button" onClick={() => setOpen(p => !p)}
        className="sort-btn w-full sm:w-[165px] flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-transparent">
        {cur.label}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-[185px] bg-white rounded-xl overflow-hidden"
            style={{ border: `1px solid ${G.border}`, boxShadow: '0 10px 26px rgba(0,0,0,0.08)' }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: G.border }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">Trier par</p>
            </div>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-amber-50"
                style={{ color: value === opt.value ? G.goldDark : '#374151', fontWeight: value === opt.value ? '700' : '400', background: value === opt.value ? 'rgba(201,168,76,0.07)' : 'transparent' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   TOAST
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className="a-toast pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-2xl max-w-full sm:max-w-[310px] text-sm font-medium"
          style={{ background: G.white, color: G.ink, border: `1px solid ${G.border}`, boxShadow: '0 10px 28px rgba(0,0,0,0.10)', fontFamily: 'var(--font-body)' }}>
          {t.icon && (
            <span className="shrink-0 w-7 h-7 rounded-lg grid place-items-center text-base"
              style={{ background: 'rgba(201,168,76,0.10)', color: G.goldDark }}>{t.icon}</span>
          )}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)}
            className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UTILS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const stripAccents = (v = '') => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const DOMAIN_KEYWORDS = {
  tech:      ['informatique','developpement','numerique','tech','digital'],
  finance:   ['finance','comptabilite','banque'],
  sante:     ['sante','medical','soin'],
  droit:     ['droit','juridique','notaire'],
  marketing: ['marketing','communication','pub'],
  industrie: ['industrie','ingenierie','btp','construction'],
};

function matchStatus(sector, statuses = []) {
  if (!statuses.length) return true;
  const r = sector.remaining ?? 0;
  return statuses.some(s =>
    (s === 'disponible' && r > 0) ||
    (s === 'urgent'     && r > 0 && r <= 3) ||
    (s === 'complet'    && r <= 0)
  );
}

function matchDomain(sector, domains = []) {
  if (!domains.length) return true;
  const h = stripAccents(sector.name ?? '');
  return domains.some(d => (DOMAIN_KEYWORDS[d] ?? []).some(k => h.includes(k)));
}

function readJson(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) ?? fallback : fallback; }
  catch { return fallback; }
}

const UI_KEY   = 'find:demande-stage:ui:v1';
const DATA_KEY = 'find:demande-stage:data:v1';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN PAGE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function DemandeStage() {
  const navigate = useNavigate();
  const { setSectorAndModality } = useApplication();

  const pUi   = readJson(UI_KEY, null);
  const pData = readJson(DATA_KEY, []);

  const [level,    setLevel]    = useState(pUi?.level ?? 'Licence');
  const [data,     setData]     = useState(Array.isArray(pData) ? pData : []);
  const [filters,  setFilters]  = useState(pUi?.filters ?? { niveau: ['Licence'], statut: [], domaine: [] });
  const [search,   setSearch]   = useState(pUi?.search ?? '');
  const [sortBy,   setSortBy]   = useState(pUi?.sortBy ?? 'default');
  const [loading,  setLoading]  = useState(true);
  const [apiError, setApiError] = useState('');
  const [visible,  setVisible]  = useState(false);
  const [toasts,   setToasts]   = useState([]);
  const tid = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => { setLoading(false); setVisible(true); }, 900);
    return () => clearTimeout(t);
  }, []);

  const addToast = useCallback((message, icon = '✨') => {
    const id = ++tid.current;
    setToasts(p => [...p, { id, message, icon }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4200);
  }, []);
  const removeToast = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);

  const handleApply = sector => {
    if ((sector.remaining ?? 0) <= 0) { addToast('Ce secteur est complet.', '⚠️'); return; }
    setSectorAndModality(sector, level);
    addToast(`Candidature "${sector.name}".`, '');
    setTimeout(() => navigate('/formulaire'), 550);
  };

  const handleLevel = v => {
    setLevel(v);
    addToast(v === 'Licence' ? 'Mode binôme activé.' : 'Mode individuel activé.', '🔄');
  };

  const handleFiltersChange = useCallback(next => {
    setFilters(next);
    const nl = next?.niveau?.[0];
    if (nl && nl !== level) setLevel(nl);
  }, [level]);

  useEffect(() => {
    try { localStorage.setItem(UI_KEY, JSON.stringify({ level, filters, search, sortBy, updatedAt: Date.now() })); }
    catch {}
  }, [level, filters, search, sortBy]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setApiError('');
      const response = await getSectors();
      const sectors  = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
      if (cancelled) return;
      const mapped = sectors.map(item => ({
        id: item.id ?? item._id ?? null,
        name: item.name,
        description: item.description,
        domain: item.name,
        remaining: item.available_slots ?? 0,
        total: item.total_slots ?? 0,
      }));
      setData(mapped);
      try { localStorage.setItem(DATA_KEY, JSON.stringify(mapped)); } catch {}
    })().catch(err => {
      if (cancelled) return;
      setApiError(err?.message || 'Erreur API inconnue');
      const cached = readJson(DATA_KEY, []);
      if (Array.isArray(cached) && cached.length > 0) setData(cached);
    });
    return () => { cancelled = true; };
  }, []);

  const sectors = data
    .filter(s => !search || stripAccents(s.name ?? '').includes(stripAccents(search)) || stripAccents(s.description ?? '').includes(stripAccents(search)))
    .filter(s => matchStatus(s, filters.statut))
    .filter(s => matchDomain(s, filters.domaine))
    .sort((a, b) => {
      if (sortBy === 'places') return (b.remaining ?? 0) - (a.remaining ?? 0);
      if (sortBy === 'alpha')  return (a.name ?? '').localeCompare(b.name ?? '');
      return 0;
    });

  return (
    <>
      <style>{STYLES}</style>

      <div className="ds-root">
        <Navbar />

        <main className="flex-1 pt-[72px] md:pt-[80px]">

          {/* â•â• HERO â•â• */}
          <div className="border-b pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6"
            style={{ borderColor: G.border, background: 'linear-gradient(180deg, #FDFCF8 0%, #F9F7F1 100%)' }}>
            <div className="max-w-5xl mx-auto space-y-6">

              {/* Live badge */}
              <div className="flex justify-center au1">
                <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 bg-white border"
                  style={{ borderColor: G.border, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <span className="g-dot w-1.5 h-1.5 rounded-full shrink-0" style={{ background: G.gold }} />
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase"
                    style={{ color: G.muted, fontFamily: 'var(--font-body)' }}>
                    Réservations ouvertes · Promo 2026
                  </span>
                </div>
              </div>

              {/* Stepper */}
              <div className="au2"><Stepper step={1} /></div>

              {/* Headline */}
              <div className="text-center au3">
                <h1 className="font-light leading-[1.06] mb-3 tracking-tight"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', color: G.ink }}>
                  Choisissez votre{' '}
                  <em className="gold-shimmer not-italic font-semibold">secteur de stage</em>
                </h1>
                <p className="text-sm sm:text-base text-gray-500 max-w-[400px] mx-auto leading-relaxed">
                  Stage académique 2026 — sélectionnez un secteur et déposez votre candidature.
                </p>
                <div className="flex justify-center mt-4">
                  <span className="accent-line" style={{ width: 48 }} />
                </div>
              </div>

              {/* Level indicator */}
              <div className="flex justify-center au4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border"
                  style={level === 'Licence'
                    ? { background: 'rgba(201,168,76,0.09)', color: G.goldDark, borderColor: 'rgba(201,168,76,0.22)', fontFamily: 'var(--font-body)' }
                    : { background: G.white, color: G.muted, borderColor: G.border, fontFamily: 'var(--font-body)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {level === 'Licence' ? 'Inscription en binôme — Licence' : 'Inscription individuelle — Master'}
                </div>
              </div>
            </div>
          </div>

          {/* â•â• CONTENT â•â• */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-20">

            {/* Stats */}
            {!loading && <StatsBar sectors={data} />}

            {/* Control bar */}
            <div className="ctrl-bar au5 sticky top-[76px] md:top-[86px] z-30 mb-8
                            flex flex-col sm:flex-row gap-3 items-stretch sm:items-center
                            rounded-2xl border px-4 sm:px-5 py-3.5"
              style={{ borderColor: G.border, boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
              <div className="flex-1 min-w-0">
                <Filters
                  level={level}
                  onLevelChange={handleLevel}
                  onFiltersChange={handleFiltersChange}
                  resultCount={sectors.length}
                  totalCount={data.length}
                />
              </div>
              <div className="hidden sm:block self-stretch w-px my-1" style={{ background: G.border }} />
              <SearchBar value={search} onChange={setSearch} />
              <SortMenu value={sortBy} onChange={setSortBy} />
            </div>

            {/* Result count */}
            {!loading && search && (
              <p className="text-sm text-gray-400 mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                {sectors.length === 0
                  ? <>Aucun résultat pour <strong className="text-gray-700">"{search}"</strong></>
                  : <><strong className="text-gray-700">{sectors.length}</strong> secteur{sectors.length > 1 ? 's' : ''} trouvé{sectors.length > 1 ? 's' : ''}</>}
              </p>
            )}

            {/* API Error */}
            {!loading && apiError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                style={{ fontFamily: 'var(--font-body)' }}>
                Erreur de connexion : {apiError}
              </div>
            )}

            {/* Skeletons */}
            {loading && (
              <div>
                <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skel h-[240px]" style={{ animationDelay: `${i * 0.07}s` }} />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-2.5 mt-8 text-gray-400 text-sm">
                  <span className="a-spin w-4 h-4 rounded-full border-2 border-gray-200 inline-block"
                    style={{ borderTopColor: G.gold }} />
                  Chargement des offres...
                </div>
              </div>
            )}

            {/* Cards grid */}
            {!loading && sectors.length > 0 && (
              <div className={`grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
                {sectors.map((sector, i) => (
                  <div key={sector.id ?? i} className="a-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <SectorCard sector={sector} level={level} onApply={handleApply} />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && sectors.length === 0 && (
              <div className="flex flex-col items-center text-center py-20 px-8 rounded-2xl border-2 border-dashed"
                style={{ borderColor: G.border, background: 'rgba(249,248,245,0.6)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl"
                  style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
                  {search ? '🔍' : '📭'}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: G.ink, fontSize: '1.4rem' }}>
                  {search ? 'Aucun résultat' : 'Aucune place disponible'}
                </h3>
                <p className="text-gray-400 text-sm max-w-[260px] leading-relaxed mb-6">
                  {search ? `Aucun secteur ne correspond à "${search}".` : 'Tous les quotas sont remplis. Revenez bientôt.'}
                </p>
                {search && (
                  <button onClick={() => setSearch('')}
                    className="text-[12.5px] font-bold px-6 py-2.5 rounded-xl text-white"
                    style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.goldDark})`, fontFamily: 'var(--font-body)', letterSpacing: '.05em', textTransform: 'uppercase', boxShadow: '0 4px 16px rgba(201,168,76,0.28)' }}>
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
