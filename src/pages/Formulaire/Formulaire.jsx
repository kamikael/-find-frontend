import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import Navbar from '../../components/Navbar/Navbar';
import { getSectors } from '../../utils/api';
import { normalizeSector } from '../../utils/sectors';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STYLES â€” Gold / Black / Ivory system
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  :root {
    --gold:        #D4A017;
    --gold-dark:   #B8860B;
    --gold-ring:   rgba(212,160,23,0.16);
    --gold-muted:  rgba(212,160,23,0.09);
    --ink:         #0A0A0A;
    --ivory:       #FDFCF8;
    --white:       #ffffff;
    --border:      #E5E1D8;
    --muted:       #9CA3AF;
    --danger:      #DC2626;
    --danger-bg:   #FEF2F2;
    --success:     #15803D;
    --success-bg:  #F0FDF4;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
  }

  .form-page {
    background-color: var(--ivory);
    background-image:
      radial-gradient(ellipse 65% 45% at 5% 0%, rgba(212,160,23,0.05) 0%, transparent 55%),
      radial-gradient(ellipse 55% 35% at 95% 100%, rgba(212,160,23,0.04) 0%, transparent 50%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* â”€â”€ Animations â”€â”€ */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes errIn {
    from { opacity:0; transform:translateY(-4px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes barFill { from { width: 0%; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fu  { opacity:0; animation: fadeUp .5s cubic-bezier(.16,1,.3,1) forwards; }
  .fu1 { animation-delay:.04s; }
  .fu2 { animation-delay:.10s; }
  .fu3 { animation-delay:.17s; }

  .spin-anim { animation: spin .75s linear infinite; }

  /* â•â•â•â• FLOATING LABEL FIELDS â•â•â•â• */
  .fl { position: relative; }

  .fl-in {
    width: 100%;
    padding: 22px 16px 8px 16px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color .2s ease, box-shadow .2s ease, background .15s ease;
    -webkit-appearance: none; appearance: none;
  }
  .fl-in::placeholder { color: transparent; }
  .fl-in:hover:not(:focus) { border-color: #C9C4B8; }
  .fl-in:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px var(--gold-ring);
    background: #FFFDF5;
  }
  .fl-in.ok  { border-color: var(--gold); background: #FFFDF5; }
  .fl-in.err { border-color: #FCA5A5; background: var(--danger-bg); }
  .fl-in.err:focus { border-color: var(--danger); box-shadow: 0 0 0 3px rgba(220,38,38,.10); }

  .fl-lb {
    position: absolute;
    left: 16px; top: 50%;
    transform: translateY(-50%);
    font-family: var(--font-body);
    font-size: 13px; color: #9CA3AF;
    pointer-events: none;
    transition: top .17s cubic-bezier(.16,1,.3,1), transform .17s cubic-bezier(.16,1,.3,1),
                font-size .17s, color .17s, font-weight .17s;
    transform-origin: left center;
  }
  .fl-in:focus + .fl-lb,
  .fl-in:not(:placeholder-shown) + .fl-lb,
  .fl-lb.up {
    top: 10px; transform: translateY(0) scale(.7);
    color: var(--gold-dark); font-weight: 700; letter-spacing: .04em;
  }

  select.fl-in { padding-top: 22px; padding-bottom: 8px; cursor: pointer; }
  textarea.fl-in { padding-top: 24px; resize: vertical; min-height: 108px; }
  textarea.fl-in + .fl-lb { top: 18px; transform: translateY(0); }
  textarea.fl-in:focus + .fl-lb,
  textarea.fl-in:not(:placeholder-shown) + .fl-lb {
    top: 8px; transform: translateY(0) scale(.7);
  }

  /* â”€â”€ Inline validation icon â”€â”€ */
  .val-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none; }

  /* â”€â”€ Custom select â”€â”€ */
  .sel { position: relative; }
  .sel-btn {
    width: 100%;
    padding: 22px 14px 8px 16px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    font-family: var(--font-body);
    color: var(--ink);
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
    transition: border-color .18s ease, box-shadow .18s ease;
  }
  .sel-btn:hover { border-color: #C9C4B8; }
  .sel.open .sel-btn { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-ring); }
  .sel-value { font-size: 14px; color: var(--ink); }
  .sel-value.ph { color: var(--muted); }
  .sel-menu {
    position: absolute; top: calc(100% + 6px); left:0; right:0; z-index:50;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    box-shadow: 0 16px 32px rgba(0,0,0,0.10);
    overflow: hidden;
  }
  .sel-opt {
    width: 100%; border:0; background:transparent; text-align:left;
    padding: 10px 14px; font-family: var(--font-body); font-size:14px; color:#374151;
    cursor:pointer; transition: background .15s ease;
  }
  .sel-opt:hover { background: var(--gold-muted); }
  .sel-opt.active { background: var(--ink); color:#fff; }

  /* â”€â”€ Error message â”€â”€ */
  .err-msg {
    animation: errIn .2s ease both;
    display: flex; align-items: center; gap: 4px;
    margin-top: 5px; font-family: var(--font-body);
    font-size: 11px; font-weight:500; color: var(--danger);
  }

  /* â”€â”€ Drop zone â”€â”€ */
  .dz {
    position:relative; overflow:hidden;
    border: 1.5px dashed var(--border);
    border-radius: 14px; padding: 28px 20px;
    text-align:center; background: var(--white); cursor:pointer;
    transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
  }
  .dz:hover, .dz.drag {
    border-color: var(--gold);
    background: #FFFDF5;
    box-shadow: 0 0 0 3px var(--gold-ring);
  }
  .dz input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }

  /* â”€â”€ Progress bar â”€â”€ */
  .bar-anim { animation: barFill .7s cubic-bezier(.16,1,.3,1) both; }

  /* â”€â”€ CTA button â”€â”€ */
  .btn-cta {
    width:100%; display:inline-flex; align-items:center; justify-content:center; gap:10px;
    padding: 16px 28px;
    background: var(--ink); color: var(--white);
    font-family: var(--font-display);
    font-size: 14px; font-weight: 700; letter-spacing: .03em;
    border: 1.5px solid var(--ink); border-radius: 14px; cursor:pointer;
    position:relative; overflow:hidden;
    transition: transform .2s ease, box-shadow .2s ease, background .15s ease;
  }
  .btn-cta::after {
    content:''; position:absolute; inset:0;
    background: linear-gradient(135deg, rgba(255,255,255,0.10), transparent);
    opacity:0; transition: opacity .2s ease;
  }
  .btn-cta:hover { transform:translateY(-2px); box-shadow:0 14px 32px rgba(0,0,0,.22); background:#111; }
  .btn-cta:hover::after { opacity:1; }
  .btn-cta:active { transform:scale(.985); }
  .btn-cta:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }

  /* â”€â”€ Section heading â”€â”€ */
  .sec-label {
    display: flex; align-items: center; gap: 12px;
  }
  .sec-bar {
    width: 3px; height: 16px; border-radius: 99px;
    background: linear-gradient(180deg, var(--gold), var(--gold-dark));
    flex-shrink: 0;
  }
  .sec-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(212,160,23,0.25), transparent);
  }

  :focus-visible { outline: 2px solid var(--gold); outline-offset:3px; border-radius:6px; }

  @media (max-width:767px) {
    .fl-in { font-size: 16px; }
  }
`;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FIELD COMPONENT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Field({ label, name, type='text', value, onChange, error, required, hint, options, rows, readOnly=false, disabled=false }) {
  const isSel = type === 'select';
  const isTxt = type === 'textarea';
  const hasVal = String(value ?? '').length > 0;
  const cls = error ? 'err' : hasVal ? 'ok' : '';
  const [open, setOpen] = useState(false);
  const selRef = useRef(null);

  const normalizedOptions = (options ?? []).map(o => ({ value: o?.value ?? o, label: o?.label ?? o }));
  const selectedOption = normalizedOptions.find(o => String(o.value) === String(value));

  useEffect(() => {
    if (!open) return;
    const onOut = e => { if (!selRef.current?.contains(e.target)) setOpen(false); };
    const onEsc = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onOut);
    document.addEventListener('keydown', onEsc);
    return () => { document.removeEventListener('mousedown', onOut); document.removeEventListener('keydown', onEsc); };
  }, [open]);

  const commitSelect = v => {
    if (disabled) return;
    onChange?.({ target: { name, value: v } });
    setOpen(false);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      <div className="fl">
        {isSel && (
          <>
            <div ref={selRef} className={`sel ${open ? 'open' : ''}`}>
              <input type="hidden" name={name} value={value ?? ''} />
              <button type="button" className={`sel-btn ${cls}`}
                onClick={() => !disabled && setOpen(v => !v)} aria-haspopup="listbox" aria-expanded={open} disabled={disabled}>
                <span className={`sel-value ${selectedOption ? '' : 'ph'}`}>
                  {selectedOption?.label ?? 'Sélectionner'}
                </span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"
                  style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s ease' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open && (
                <div className="sel-menu" role="listbox">
                  {normalizedOptions.map(opt => (
                    <button key={opt.value} type="button"
                      className={`sel-opt ${String(opt.value) === String(value) ? 'active' : ''}`}
                      onClick={() => commitSelect(opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <label className="fl-lb up" style={{ pointerEvents:'none' }}>
              {label}{required && <span style={{color:'var(--danger)',marginLeft:2}}>*</span>}
            </label>
          </>
        )}
        {isTxt && (
          <>
            <textarea name={name} value={value} onChange={onChange} required={required}
              rows={rows ?? 4} placeholder=" " className={`fl-in ${cls}`} readOnly={readOnly} disabled={disabled} />
            <label className="fl-lb">
              {label}{required && <span style={{color:'var(--danger)',marginLeft:2}}>*</span>}
            </label>
          </>
        )}
        {!isSel && !isTxt && (
          <>
            <input type={type} name={name} value={value} onChange={onChange}
              required={required} placeholder=" " className={`fl-in ${cls}`} readOnly={readOnly} disabled={disabled} />
            <label className="fl-lb">
              {label}{required && <span style={{color:'var(--danger)',marginLeft:2}}>*</span>}
            </label>
            {hasVal && (
              <span className="val-icon">
                {error
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                }
              </span>
            )}
          </>
        )}
      </div>
      {error && (
        <p className="err-msg">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ marginTop:5, fontSize:11, color:'#9CA3AF', fontFamily:'var(--font-body)', lineHeight:1.5 }}>{hint}</p>
      )}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FILE DROP ZONE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function FileZone({ file, onChange, error, label = 'CV / Document' }) {
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.15em', textTransform:'uppercase',
        color:'#6B6560', marginBottom:8, fontFamily:'var(--font-display)' }}>
        {label} <span style={{color:'var(--danger)'}}>*</span>
      </p>
      <div className={`dz ${drag ? 'drag' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); onChange(e.dataTransfer.files[0]); }}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={e => onChange(e.target.files[0])} />
        {file ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(212,160,23,0.10)',
              border:'1px solid rgba(212,160,23,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:'#3f3f46', fontFamily:'var(--font-body)',
                maxWidth:220, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</p>
              <p style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{(file.size/1024).toFixed(0)} Ko · Cliquer pour changer</p>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, pointerEvents:'none' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'rgba(212,160,23,0.08)',
              border:'1px solid rgba(212,160,23,0.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="1.7" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{ fontSize:13, fontWeight:500, color:'#52525b', fontFamily:'var(--font-body)' }}>
              Glisser-déposer ou{' '}
              <span style={{ color:'var(--gold-dark)', fontWeight:700 }}>parcourir</span>
            </p>
            <p style={{ fontSize:11, color:'#9CA3AF' }}>PDF, DOC, DOCX · Max 5 Mo</p>
          </div>
        )}
      </div>
      {error && (
        <p className="err-msg" style={{ marginTop:6 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SECTION LABEL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Section({ label }) {
  return (
    <div className="sec-label">
      <div className="sec-bar" />
      <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.22em', textTransform:'uppercase',
        color:'var(--gold-dark)', fontFamily:'var(--font-display)', flexShrink:0 }}>
        {label}
      </span>
      <div className="sec-line" />
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PROGRESS BAR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Progress({ pct }) {
  const color = pct === 100 ? 'var(--success)' : pct > 60 ? 'var(--gold)' : 'var(--ink)';
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase',
          color:'#9CA3AF', fontFamily:'var(--font-display)' }}>Complétion du dossier</span>
        <span style={{ fontSize:11, fontWeight:700, color, fontFamily:'var(--font-body)', transition:'color .5s' }}>
          {pct}%
        </span>
      </div>
      <div style={{ height:3, background:'#F0ECE4', borderRadius:99, overflow:'hidden' }}>
        <div className="bar-anim" style={{ height:'100%', width:`${pct}%`, background:color,
          borderRadius:99, transition:'width .7s ease' }} />
      </div>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN FORM
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function Form() {
  const navigate = useNavigate();
  const { sector, level, setSectorAndModality, student1, student2,
    setStudent1, setStudent2, setCvFile, setCvValid } = useApplication();
  const currentSector = sector ? normalizeSector(sector) : null;
  const [availableSectors, setAvailableSectors] = useState(currentSector ? [currentSector] : []);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [sectorsError, setSectorsError] = useState('');

  const [values, setValues] = useState({
    nom:           student1?.nom ?? '',
    prenom:        student1?.prenom ?? '',
    email:         student1?.email ?? '',
    telephone:     student1?.telephone ?? '',
    niveau:        level ?? '',
    secteur:       currentSector?.id ?? currentSector?._id ?? currentSector?.name ?? '',
    domaine:       currentSector?.domainLabel ?? '',
    universite:    student1?.universite ?? '',
    filiere:       student1?.filiere ?? '',
    nomBinome:     student2?.nom ?? '',
    prenomBinome:  student2?.prenom ?? '',
    emailBinome:   student2?.email ?? '',
  });
  const [files,   setFiles]   = useState({ primary: null, partner: null });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const isBinome = values.niveau === 'Licence';

  const req = ['nom','prenom','email','telephone','niveau','secteur','universite','filiere'];
  if (isBinome) req.push('nomBinome','prenomBinome');
  const filled = req.filter(f => String(values[f] ?? '').trim().length > 0).length;
  const reqFiles = isBinome ? 2 : 1;
  const curFiles = [files.primary, files.partner].filter(Boolean).length;
  const pct = Math.round(((filled + Math.min(curFiles, reqFiles)) / (req.length + reqFiles)) * 100);

  const catalog = [...new Map(
    [currentSector, ...availableSectors]
      .filter(Boolean)
      .map((item) => {
        const normalized = normalizeSector(item);
        const key = normalized.id ?? normalized._id ?? normalized.name;
        return [String(key), normalized];
      })
  ).values()];

  const findSector = (value) => catalog.find((item) => (
    String(item.id ?? item._id ?? '') === String(value)
      || String(item.name ?? '') === String(value)
  ));

  useEffect(() => {
    setValues((prev) => {
      const nextSector = currentSector?.id ?? currentSector?._id ?? currentSector?.name ?? '';
      const nextDomain = currentSector?.domainLabel ?? '';

      if (!nextSector || (prev.secteur === nextSector && prev.domaine === nextDomain && prev.niveau === (level ?? prev.niveau))) {
        return prev;
      }

      return {
        ...prev,
        niveau: level ?? prev.niveau,
        secteur: nextSector,
        domaine: nextDomain,
      };
    });
  }, [currentSector, level]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingSectors(true);
      setSectorsError('');

      try {
        const response = await getSectors();
        const list = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
        if (cancelled) return;
        setAvailableSectors(list.map(normalizeSector));
      } catch (error) {
        if (cancelled) return;
        setSectorsError(error?.message || 'Impossible de charger les secteurs.');
      } finally {
        if (!cancelled) setLoadingSectors(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handle = e => {
    const { name, value } = e.target;
    if (name === 'secteur') {
      const nextSector = findSector(value);
      const nextValue = nextSector ? String(nextSector.id ?? nextSector._id ?? nextSector.name) : value;

      setValues((prev) => ({
        ...prev,
        secteur: nextValue,
        domaine: nextSector?.domainLabel ?? '',
      }));

      setErrors((prev) => {
        const next = { ...prev };
        delete next.secteur;
        delete next.domaine;
        return next;
      });
      return;
    }

    setValues(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => { const n = {...p}; delete n[name]; return n; });
  };
  const handleFile = (key, next) => {
    setFiles(p => ({ ...p, [key]: next }));
    const ek = key === 'primary' ? 'filePrimary' : 'filePartner';
    if (errors[ek]) setErrors(p => { const n = {...p}; delete n[ek]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!values.nom.trim())         e.nom        = 'Le nom est requis.';
    if (!values.prenom.trim())      e.prenom     = 'Le prénom est requis.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'E-mail invalide.';
    if (!/^[\d\s+\-()]{7,}$/.test(values.telephone)) e.telephone = 'Numéro invalide.';
    if (!values.niveau)             e.niveau     = 'Sélectionnez votre niveau.';
    if (!values.secteur || !findSector(values.secteur)) e.secteur = 'Sélectionnez un secteur disponible.';
    if (!values.domaine.trim())     e.domaine    = 'Le domaine sera défini à partir du secteur.';
    if (!values.universite.trim())  e.universite = 'Université requise.';
    if (!values.filiere.trim())     e.filiere    = 'Filière requise.';
    if (isBinome) {
      if (!values.nomBinome.trim())    e.nomBinome    = 'Nom du binôme requis.';
      if (!values.prenomBinome.trim()) e.prenomBinome = 'Prénom requis.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailBinome)) e.emailBinome = 'E-mail du binôme invalide.';
    }
    if (!files.primary)              e.filePrimary = 'Veuillez joindre votre CV.';
    if (isBinome && !files.partner)  e.filePartner = 'Veuillez joindre le CV du binôme.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const nextSector = findSector(values.secteur) ?? currentSector;
    if (nextSector && values.niveau) setSectorAndModality(nextSector, values.niveau);
    setStudent1({ nom: values.nom.trim(), prenom: values.prenom.trim(), email: values.email.trim(),
      telephone: values.telephone.trim(), universite: values.universite.trim(),
      filiere: values.filiere.trim(), niveau: values.niveau });
    setStudent2(isBinome
      ? { nom: values.nomBinome.trim(), prenom: values.prenomBinome.trim(),
          email: values.emailBinome.trim(), telephone:'', universite:'', filiere:'', niveau: values.niveau }
      : { nom:'', prenom:'', email:'', telephone:'', universite:'', filiere:'', niveau:'' });
    setCvFile(isBinome ? { student1: files.primary, student2: files.partner } : files.primary);
    setCvValid(isBinome ? Boolean(files.primary && files.partner) : Boolean(files.primary));
    setLoading(false);
    navigate('/recapitulatif');
  };

  const NIVEAUX  = ['Licence','Master'];
  const SECTEURS = catalog.map((item) => ({
    value: String(item.id ?? item._id ?? item.name),
    label: item.name,
  }));

  const errCount = Object.keys(errors).length;

  return (
    <>
      <style>{STYLES}</style>
      <Navbar />

      <div className="form-page" style={{ fontFamily:'var(--font-body)' }}>
        <main className="relative z-10 flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">

          {/* Back button */}
          <div className="mx-auto mb-4 w-full max-w-2xl">
            <button type="button" onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Retour
            </button>
          </div>

          {/* Card */}
          <div className="fu fu1 mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">

            {/* Card header band */}
            <div className="border-b border-zinc-200 bg-linear-to-b from-[#fdfcf8] to-[#faf8f2] px-4 py-5 sm:px-8">
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:'var(--ink)',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontSize:10, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase',
                      color:'#9CA3AF', fontFamily:'var(--font-display)' }}>Dossier 2026</p>
                    <p style={{ fontSize:14, fontWeight:700, color:'var(--ink)', marginTop:1, fontFamily:'var(--font-display)' }}>
                      Stage académique
                    </p>
                  </div>
                </div>
                {/* Step indicator */}
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  {['Dossier','Récapitulatif','Paiement'].map((s,i) => (
                    <div key={s} style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                        width:22, height:22, borderRadius:'50%', fontSize:10, fontWeight:700,
                        fontFamily:'var(--font-display)',
                        background: i <= 1 ? 'var(--gold)' : '#F0ECE4',
                        color: i <= 1 ? '#fff' : '#9CA3AF',
                        border: i <= 1 ? '2px solid var(--gold)' : '2px solid #E5E1D8' }}>
                        {i + 1}
                      </div>
                      {i < 2 && <div style={{ width:14, height:1, background:'#E5E1D8' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card body */}
            <div className="flex flex-col gap-7 px-4 py-6 sm:px-8 sm:py-8">

              <Progress pct={pct} />

              <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:24 }}>

                <Section label="Informations personnelles" />

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
                  <Field label="Nom" name="nom" value={values.nom} onChange={handle} error={errors.nom} required />
                  <Field label="Prénom" name="prenom" value={values.prenom} onChange={handle} error={errors.prenom} required />
                </div>

                <Field label="Adresse e-mail" name="email" type="email"
                  value={values.email} onChange={handle} error={errors.email} required
                  hint="Les confirmations seront envoyées à cette adresse." />

                <Field label="Téléphone" name="telephone" type="tel"
                  value={values.telephone} onChange={handle} error={errors.telephone} required
                  hint="Format international accepté (+229...)" />

                <Section label="Parcours académique" />

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
                  <Field label="Niveau" name="niveau" type="select"
                    value={values.niveau} onChange={handle} error={errors.niveau} required options={NIVEAUX} />
                  <Field label="Secteur cible" name="secteur" type="select"
                    value={values.secteur} onChange={handle} error={errors.secteur} required options={SECTEURS} />
                </div>

                <Field label="Domaine" name="domaine"
                  value={values.domaine} onChange={handle} error={errors.domaine}
                  readOnly
                  hint={loadingSectors ? 'Chargement des secteurs et domaines depuis le backend...' : sectorsError || 'Renseigné automatiquement selon le secteur choisi.'} />

                <Field label="Université / École" name="universite"
                  value={values.universite} onChange={handle} error={errors.universite} required />

                <Field label="Filière / Spécialité" name="filiere"
                  value={values.filiere} onChange={handle} error={errors.filiere} required />

                {/* Binome section */}
                {isBinome && (
                  <>
                    <Section label="Informations du binôme" />
                    <div style={{ display:'flex', alignItems:'flex-start', gap:10,
                      background:'rgba(212,160,23,0.07)', border:'1px solid rgba(212,160,23,0.22)',
                      borderRadius:14, padding:'12px 16px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="var(--gold-dark)" strokeWidth="2.2" strokeLinecap="round"
                        style={{ flexShrink:0, marginTop:1 }}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <p style={{ fontSize:12, color:'#92400E', lineHeight:1.6, fontFamily:'var(--font-body)' }}>
                        La Licence requiert une inscription en binôme. Renseignez les informations de votre partenaire.
                      </p>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
                      <Field label="Prénom du binôme" name="prenomBinome" value={values.prenomBinome}
                        onChange={handle} error={errors.prenomBinome} required />
                      <Field label="Nom du binôme" name="nomBinome" value={values.nomBinome}
                        onChange={handle} error={errors.nomBinome} required />
                      <Field label="E-mail du binôme" name="emailBinome" type="email"
                        value={values.emailBinome} onChange={handle} error={errors.emailBinome} required
                        hint="Les confirmations seront envoyées à cette adresse." />
                    </div>
                  </>
                )}

                <Section label="Documents" />

                {isBinome ? (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
                    <FileZone label="CV étudiant 1" file={files.primary}
                      onChange={next => handleFile('primary', next)} error={errors.filePrimary} />
                    <FileZone label="CV étudiant 2 (binôme)" file={files.partner}
                      onChange={next => handleFile('partner', next)} error={errors.filePartner} />
                  </div>
                ) : (
                  <FileZone label="CV" file={files.primary}
                    onChange={next => handleFile('primary', next)} error={errors.filePrimary} />
                )}

                {/* Error summary */}
                {errCount > 0 && (
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10,
                    background:'var(--danger-bg)', border:'1px solid #FECACA',
                    borderRadius:14, padding:'12px 16px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round"
                      style={{ flexShrink:0, marginTop:1 }}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ fontSize:12, fontWeight:500, color:'#991B1B', lineHeight:1.5, fontFamily:'var(--font-body)' }}>
                      {errCount} erreur{errCount > 1 ? 's' : ''} détectée{errCount > 1 ? 's' : ''}. Veuillez corriger avant de continuer.
                    </p>
                  </div>
                )}

                <div style={{ height:1, background:'var(--border)', margin:'4px 0' }} />

                <button type="submit" disabled={loading} className="btn-cta">
                  {loading ? (
                    <>
                      <svg className="spin-anim" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                        <path d="M12 2a10 10 0 0 1 10 10"/>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Continuer vers le récapitulatif
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>

                <p style={{ textAlign:'center', fontSize:11, color:'#9CA3AF', lineHeight:1.6,
                  fontFamily:'var(--font-body)' }}>
                  En soumettant, vous acceptez nos conditions d'utilisation.<br/>
                  Vos données sont chiffrées et confidentielles.
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
