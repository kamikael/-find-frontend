import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import Navbar from '../../components/Navbar/Navbar';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --indigo:        #6366F1;
    --indigo-light:  #EEF2FF;
    --indigo-ring:   rgba(99,102,241,0.16);
    --amber:         #F59E0B;
    --amber-light:   #FFFBEB;
    --ink:           #09090b;
    --white:         #ffffff;
    --surface:       #F8F8F8;
    --border:        #E4E4E7;
    --muted:         #A1A1AA;
    --danger:        #DC2626;
    --danger-light:  #FEF2F2;
    --success:       #16A34A;
    --success-light: #F0FDF4;
  }

  /* ── Reset ciblé uniquement sur le formulaire ── */
  .form-scope *, .form-scope *::before, .form-scope *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── Noise ── */
  .noise::before {
    content:''; position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.018'/%3E%3C/svg%3E");
  }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .fu   { opacity:0; animation: fadeUp .55s cubic-bezier(.16,1,.3,1) forwards; }
  .fu1  { animation-delay:.05s; }
  .fu2  { animation-delay:.12s; }
  .fu3  { animation-delay:.19s; }
  .fu4  { animation-delay:.26s; }
  .fu5  { animation-delay:.33s; }

  /* ════ FLOATING LABEL FIELDS ════ */
  .fl { position: relative; }

  .fl-in {
    width: 100%;
    padding: 20px 16px 8px 16px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .15s;
    -webkit-appearance: none; appearance: none;
  }
  .fl-in::placeholder { color: transparent; }

  .fl-lb {
    position: absolute;
    left: 16px; top: 50%;
    transform: translateY(-50%);
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13.5px; color: var(--muted);
    pointer-events: none;
    transition: top .17s cubic-bezier(.16,1,.3,1),
                transform .17s cubic-bezier(.16,1,.3,1),
                font-size .17s, color .17s, font-weight .17s;
    transform-origin: left center;
  }

  .fl-in:focus + .fl-lb,
  .fl-in:not(:placeholder-shown) + .fl-lb,
  .fl-lb.up {
    top: 10px; transform: translateY(0) scale(.7);
    color: var(--ink); font-weight: 600; letter-spacing: .03em;
  }

  .fl-in:focus {
    border-color: var(--indigo);
    box-shadow: 0 0 0 3.5px var(--indigo-ring);
    background: var(--white);
  }
  .fl-in:hover:not(:focus) { border-color: #a1a1aa; }

  .fl-in.ok  { border-color: #86efac; }
  .fl-in.ok:focus { border-color: var(--success); box-shadow: 0 0 0 3.5px rgba(22,163,74,.12); }
  .fl-in.err { border-color: #fca5a5; background: var(--danger-light); }
  .fl-in.err:focus { border-color: var(--danger); box-shadow: 0 0 0 3.5px rgba(220,38,38,.10); }

  select.fl-in { padding-top: 22px; padding-bottom: 6px; cursor: pointer; }
  textarea.fl-in { padding-top: 24px; resize: vertical; min-height: 108px; }
  textarea.fl-in + .fl-lb { top: 16px; transform: translateY(0); }
  textarea.fl-in:focus + .fl-lb,
  textarea.fl-in:not(:placeholder-shown) + .fl-lb {
    top: 8px; transform: translateY(0) scale(.7);
  }

  @keyframes errIn { from{opacity:0;transform:translateY(-3px)} to{opacity:1;transform:translateY(0)} }
  .err-msg {
    animation: errIn .2s ease both;
    display:flex; align-items:center; gap:4px;
    margin-top:5px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 11px; font-weight: 500; color: var(--danger);
  }

  /* ════ DROP ZONE ════ */
  .dz {
    position:relative; overflow:hidden;
    border: 1.5px dashed var(--border);
    border-radius: 10px; padding: 28px 20px;
    text-align: center; background: var(--white); cursor: pointer;
    transition: border-color .18s, background .18s, box-shadow .18s;
  }
  .dz:hover, .dz.drag {
    border-color: var(--indigo);
    background: var(--indigo-light);
    box-shadow: 0 0 0 3.5px var(--indigo-ring);
  }
  .dz input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; }

  /* ════ PROGRESS ════ */
  @keyframes barW { from{width:0%} }
  .bar { animation: barW .7s cubic-bezier(.16,1,.3,1) both; }

  /* ════ BUTTON CTA ════ */
  .btn-cta {
    width:100%; display:inline-flex; align-items:center; justify-content:center; gap:10px;
    padding: 16px 28px;
    background: var(--ink); color: var(--white);
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 14px; font-weight: 600; letter-spacing: .02em;
    border:none; border-radius: 10px; cursor: pointer;
    position:relative; overflow:hidden;
    transition: transform .2s cubic-bezier(.16,1,.3,1), box-shadow .2s, background .15s;
  }
  .btn-cta::before {
    content:''; position:absolute; top:0; left:-65%; width:40%; height:100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
    transform: skewX(-18deg); transition: left 0s;
  }
  .btn-cta:hover::before { left:135%; transition: left .5s cubic-bezier(.22,1,.36,1); }
  .btn-cta:hover  { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,.22); background:#1a1a1a; }
  .btn-cta:active { transform: scale(.985); }
  .btn-cta:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }

  @keyframes spin { to{transform:rotate(360deg)} }
  .spin { animation: spin .75s linear infinite; }

  @media (max-width: 767px) {
    .fl-in {
      font-size: 16px;
      padding: 18px 14px 8px;
    }
    .fl-lb {
      font-size: 13px;
    }
    .btn-cta {
      padding: 14px 20px;
      font-size: 13px;
    }
  }

  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#e4e4e7; border-radius:99px; }
`;

/* ── Field ── */
function Field({ label, name, type='text', value, onChange, error, required, hint, options, rows }) {
  const isSel  = type === 'select';
  const isTxt  = type === 'textarea';
  const hasVal = String(value ?? '').length > 0;
  const cls    = error ? 'err' : hasVal ? 'ok' : '';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      <div className="fl">
        {isSel && (
          <>
            <select name={name} value={value} onChange={onChange} required={required}
              className={`fl-in ${cls}`}>
              <option value="" disabled />
              {options?.map(o => <option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
            </select>
            <label className="fl-lb up">{label}{required && <span style={{color:'var(--danger)',marginLeft:2}}>*</span>}</label>
            <svg style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}
              width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </>
        )}
        {isTxt && (
          <>
            <textarea name={name} value={value} onChange={onChange}
              required={required} rows={rows??4} placeholder=" " className={`fl-in ${cls}`} />
            <label className="fl-lb">{label}{required && <span style={{color:'var(--danger)',marginLeft:2}}>*</span>}</label>
          </>
        )}
        {!isSel && !isTxt && (
          <>
            <input type={type} name={name} value={value} onChange={onChange}
              required={required} placeholder=" " className={`fl-in ${cls}`} />
            <label className="fl-lb">{label}{required && <span style={{color:'var(--danger)',marginLeft:2}}>*</span>}</label>
            {hasVal && (
              <span style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}>
                {error
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                }
              </span>
            )}
          </>
        )}
      </div>
      {error && <p className="err-msg"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</p>}
      {hint && !error && <p style={{marginTop:5,fontSize:11,color:'var(--muted)',fontFamily:"'DM Sans',system-ui",lineHeight:1.5}}>{hint}</p>}
    </div>
  );
}

/* ── FileZone ── */
function FileZone({ file, onChange, error }) {
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <p style={{fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8,fontFamily:"'DM Sans',system-ui"}}>
        CV / Document <span style={{color:'var(--danger)'}}>*</span>
      </p>
      <div className={`dz ${drag?'drag':''}`}
        onDragOver={e=>{e.preventDefault();setDrag(true)}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);onChange(e.dataTransfer.files[0])}}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={e=>onChange(e.target.files[0])} />
        {file ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
            <div style={{width:40,height:40,borderRadius:10,background:'var(--success-light)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>
              </svg>
            </div>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:'#3f3f46',fontFamily:"'DM Sans',system-ui",maxWidth:220,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</p>
              <p style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{(file.size/1024).toFixed(0)} Ko · Cliquer pour changer</p>
            </div>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,pointerEvents:'none'}}>
            <div style={{width:40,height:40,borderRadius:10,background:'var(--indigo-light)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--indigo)" strokeWidth="1.7" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{fontSize:13,fontWeight:500,color:'#52525b',fontFamily:"'DM Sans',system-ui"}}>
              Glisser-déposer ou <span style={{color:'var(--indigo)',fontWeight:600}}>parcourir</span>
            </p>
            <p style={{fontSize:11,color:'var(--muted)'}}>PDF, DOC, DOCX · Max 5 Mo</p>
          </div>
        )}
      </div>
      {error && <p className="err-msg" style={{marginTop:6}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</p>}
    </div>
  );
}

/* ── Section label ── */
function Section({ label }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'4px 0'}}>
      <div style={{width:3,height:14,borderRadius:99,background:'var(--indigo)',flexShrink:0}} />
      <span style={{fontSize:10,fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--indigo)',fontFamily:"'DM Sans',system-ui",flexShrink:0}}>
        {label}
      </span>
      <div style={{flex:1,height:1,background:'var(--indigo-light)'}} />
    </div>
  );
}

/* ── Progress ── */
function Progress({ pct }) {
  const color = pct===100 ? 'var(--success)' : pct>60 ? 'var(--indigo)' : 'var(--ink)';
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <span style={{fontSize:10,fontWeight:600,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--muted)',fontFamily:"'DM Sans',system-ui"}}>Complétion</span>
        <span style={{fontSize:11,fontWeight:700,color,fontFamily:"'DM Sans',system-ui",transition:'color .5s'}}>{pct}%</span>
      </div>
      <div style={{height:3,background:'#F4F4F5',borderRadius:99,overflow:'hidden'}}>
        <div className="bar" style={{height:'100%',width:`${pct}%`,background:color,borderRadius:99,transition:'width .7s ease'}} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function Form() {
  const navigate = useNavigate();
  const {
    sector,
    level,
    setSectorAndModality,
    student1,
    student2,
    setStudent1,
    setStudent2,
    setCvFile,
    setCvValid,
  } = useApplication();

  const [values, setValues] = useState({
    nom: student1?.nom ?? '',
    prenom: student1?.prenom ?? '',
    email: student1?.email ?? '',
    telephone: student1?.telephone ?? '',
    niveau: level ?? '',
    secteur: sector?.name ?? '',
    universite: student1?.universite ?? '',
    filiere: student1?.filiere ?? '',
    nomBinome: student2?.nom ?? '',
    prenomBinome: student2?.prenom ?? '',
    motivation:'',
  });
  const [file, setFile]       = useState(null);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const isBinome = values.niveau === 'Licence';

  const req = ['nom','prenom','email','telephone','niveau','secteur','universite','filiere'];
  if (isBinome) req.push('nomBinome','prenomBinome');
  const filled = req.filter(f => String(values[f]??'').trim().length > 0).length;
  const pct    = Math.round(((filled + (file?1:0)) / (req.length+1)) * 100);

  const handle = e => {
    const {name,value} = e.target;
    setValues(p => ({...p,[name]:value}));
    if (errors[name]) setErrors(p => {const n={...p}; delete n[name]; return n;});
  };

  const validate = () => {
    const e = {};
    if (!values.nom.trim())        e.nom        = 'Le nom est requis.';
    if (!values.prenom.trim())     e.prenom     = 'Le prénom est requis.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'E-mail invalide.';
    if (!/^[\d\s+\-()]{7,}$/.test(values.telephone))      e.telephone = 'Numéro invalide.';
    if (!values.niveau)            e.niveau     = 'Sélectionnez votre niveau.';
    if (!values.secteur)           e.secteur    = 'Sélectionnez un secteur.';
    if (!values.universite.trim()) e.universite = "Université requise.";
    if (!values.filiere.trim())    e.filiere    = 'Filière requise.';
    if (isBinome) {
      if (!values.nomBinome.trim())    e.nomBinome    = 'Nom du binôme requis.';
      if (!values.prenomBinome.trim()) e.prenomBinome = 'Prénom requis.';
    }
    if (!file) e.file = 'Veuillez joindre votre CV.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    if (sector && values.niveau) {
      setSectorAndModality(sector, values.niveau);
    }
    setStudent1({
      nom: values.nom.trim(),
      prenom: values.prenom.trim(),
      email: values.email.trim(),
      telephone: values.telephone.trim(),
      universite: values.universite.trim(),
      filiere: values.filiere.trim(),
      niveau: values.niveau,
    });
    setStudent2(
      isBinome
        ? {
            nom: values.nomBinome.trim(),
            prenom: values.prenomBinome.trim(),
            email: '',
            telephone: '',
            universite: '',
            filiere: '',
            niveau: values.niveau,
          }
        : { nom: '', prenom: '', email: '', telephone: '', universite: '', filiere: '', niveau: '' }
    );
    setCvFile(file);
    setCvValid(Boolean(file));
    setLoading(false);
    navigate('/recapitulatif');
  };

  const NIVEAUX  = ['Licence','Master'];
  const SECTEURS = [
    'Informatique & Développement','Finance & Comptabilité','Santé & Médical',
    'Droit & Juridique','Marketing & Communication','Industrie & BTP',
    'Commerce & Vente','Ressources Humaines',
    ...(sector ? [sector.name] : []),
  ].filter((v,i,a) => a.indexOf(v)===i);

  const errCount = Object.keys(errors).length;

  return (
    <>
      <style>{STYLES}</style>

      {/* ══ Navbar en dehors du form-scope pour ne pas être affectée par le reset CSS ══ */}
      <Navbar />

      <div className="noise form-scope" style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        background:'#F3F3F2', fontFamily:"'DM Sans',system-ui,sans-serif",
      }}>
        <main style={{flex:1, position:'relative', zIndex:10, padding:'clamp(20px, 4vw, 48px) clamp(14px, 4vw, 24px) clamp(48px, 8vw, 72px)'}}>

          <div className="fu" style={{
            maxWidth:680, margin:'0 auto',
            background:'var(--white)',
            borderRadius:24,
            border:'1px solid #E4E4E7',
            boxShadow:'0 8px 48px rgba(0,0,0,0.09), 0 1px 0 rgba(0,0,0,0.03)',
            overflow:'hidden',
          }}>

            <div style={{padding:'clamp(18px, 4vw, 36px) clamp(14px, 5vw, 44px) clamp(24px, 6vw, 48px)', display:'flex', flexDirection:'column', gap:28}}>

              {/* Header interne */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{
                    width:36,height:36,borderRadius:10,
                    background:'var(--ink)',
                    display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{fontSize:10,fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--muted)'}}>Dossier 2026</p>
                    <p style={{fontSize:13,fontWeight:600,color:'var(--ink)',marginTop:1}}>Stage académique</p>
                  </div>
                </div>
                <p style={{fontSize:11,color:'var(--muted)'}}>
                  <span style={{color:'var(--danger)'}}>*</span> Champs requis
                </p>
              </div>

              <Progress pct={pct} />

              <form onSubmit={handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:24}}>

                <Section label="Informations personnelles" />

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:14}}>
                  <Field label="Nom" name="nom" value={values.nom} onChange={handle} error={errors.nom} required />
                  <Field label="Prénom" name="prenom" value={values.prenom} onChange={handle} error={errors.prenom} required />
                </div>

                <Field label="Adresse e-mail" name="email" type="email"
                  value={values.email} onChange={handle} error={errors.email} required
                  hint="Les confirmations seront envoyées à cette adresse." />

                <Field label="Téléphone" name="telephone" type="tel"
                  value={values.telephone} onChange={handle} error={errors.telephone} required
                  hint="Format international accepté (+229…)" />

                <Section label="Parcours académique" />

                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:14}}>
                  <Field label="Niveau" name="niveau" type="select"
                    value={values.niveau} onChange={handle} error={errors.niveau} required options={NIVEAUX} />
                  <Field label="Secteur cible" name="secteur" type="select"
                    value={values.secteur} onChange={handle} error={errors.secteur} required options={SECTEURS} />
                </div>

                <Field label="Université / École" name="universite"
                  value={values.universite} onChange={handle} error={errors.universite} required />

                <Field label="Filière / Spécialité" name="filiere"
                  value={values.filiere} onChange={handle} error={errors.filiere} required />

                {isBinome && (
                  <>
                    <Section label="Informations du binôme" />
                    <div style={{
                      display:'flex',alignItems:'flex-start',gap:10,
                      background:'var(--amber-light)',border:'1px solid #FDE68A',
                      borderRadius:10,padding:'12px 14px',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="var(--amber)" strokeWidth="2.2" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <p style={{fontSize:12,color:'#92400E',lineHeight:1.5}}>
                        La Licence requiert une inscription en binôme. Renseignez les informations de votre partenaire.
                      </p>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:14}}>
                      <Field label="Nom du binôme" name="nomBinome"
                        value={values.nomBinome} onChange={handle} error={errors.nomBinome} required />
                      <Field label="Prénom du binôme" name="prenomBinome"
                        value={values.prenomBinome} onChange={handle} error={errors.prenomBinome} required />
                    </div>
                  </>
                )}

                <Section label="Documents" />

                <FileZone file={file} onChange={setFile} error={errors.file} />

                <Field label="Lettre de motivation (facultatif)" name="motivation" type="textarea"
                  value={values.motivation} onChange={handle}
                  hint="Décrivez brièvement vos motivations pour ce stage." />

                {errCount > 0 && (
                  <div style={{
                    display:'flex',alignItems:'flex-start',gap:10,
                    background:'var(--danger-light)',border:'1px solid #FECACA',
                    borderRadius:10,padding:'12px 14px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0,marginTop:1}}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{fontSize:12,fontWeight:500,color:'#991B1B',lineHeight:1.5}}>
                      {errCount} erreur{errCount>1?'s':''} détectée{errCount>1?'s':''}. Veuillez corriger les champs indiqués avant de continuer.
                    </p>
                  </div>
                )}

                <div style={{height:1,background:'var(--border)',margin:'4px 0'}} />

                <button type="submit" disabled={loading} className="btn-cta">
                  {loading ? (
                    <>
                      <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
                      </svg>
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      Continuer vers le paiement
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>

                <p style={{textAlign:'center',fontSize:11,color:'#D4D4D8',lineHeight:1.6}}>
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
