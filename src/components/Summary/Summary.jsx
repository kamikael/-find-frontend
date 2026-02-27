import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import mtnLogo from '../../assets/images/MTN.jpg';
import moovLogo from '../../assets/images/MOOV.png';
import celtisLogo from '../../assets/images/celtiis.jpg';

const METHODS = [
  { id: 'mtn',    label: 'MTN Money',   logo: mtnLogo },
  { id: 'moov',   label: 'Moov Money',  logo: moovLogo },
  { id: 'celtis', label: 'Celtis Cash', logo: celtisLogo },
];

const AMOUNT = '5 000';

export default function Summary() {
  const navigate = useNavigate();
  const { sector, level, isPair, student1, student2 } = useApplication();

  const [method,   setMethod]   = useState('mtn');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  if (!sector) {
    navigate('/demande-stage', { replace: true });
    return null;
  }

  const fullName = (s) => `${s?.prenom ?? ''} ${s?.nom ?? ''}`.trim();
  const names = isPair
    ? `${fullName(student1)} & ${fullName(student2)}`.trim()
    : fullName(student1);

  const handlePay = async () => {
    setError(null);
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const ok = Math.random() > 0.3;
    setLoading(false);
    if (ok) navigate('/success');
    else {
      setError('Le paiement a échoué. Veuillez réessayer ou choisir un autre moyen.');
      setShakeKey(k => k + 1);
    }
  };

  const rows = [
    { label: 'Secteur',     value: `${sector.icon ?? ''} ${sector.name}` },
    { label: 'Type',        value: isPair ? 'Binôme (Licence)' : 'Individuel (Master)' },
    { label: 'Étudiant(s)', value: names },
    { label: 'Niveau',      value: level },
    { label: 'Montant',     value: `${AMOUNT} FCFA`, bold: true },
  ];

  return (
    <div>

      {/* ── Récap ── */}
      <div className="px-4 sm:px-7 py-6">

        <p className="text-base font-extrabold uppercase tracking-wide text-zinc-900 mb-4">
          Récapitulatif
        </p>

        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 ${
              i < rows.length - 1 ? 'border-b border-zinc-50' : ''
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {row.label}
            </span>
            <span className={`text-sm text-right max-w-[65%] break-words ${
              row.bold ? 'font-bold text-zinc-950' : 'font-medium text-zinc-600'
            }`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="h-px mx-4 sm:mx-7 bg-zinc-100" />

      {/* ── Paiement ── */}
      <div className="px-4 sm:px-7 py-6 flex flex-col gap-5">

        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Moyen de paiement
        </p>

        {/* Méthodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {METHODS.map(m => {
            const active = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`rounded-xl border-2 px-3 py-4 text-center transition-all duration-150 ${
                  active
                    ? 'border-zinc-950 bg-zinc-950'
                    : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                {/* Emplacement image — remplacer le <div> par <img> quand prêt */}
                <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                  active ? 'bg-white' : 'bg-zinc-100'
                }`}>
                  <img src={m.logo} alt={m.label} className="w-9 h-9 object-contain scale-110 drop-shadow-sm" />
                </div>

                <p className={`text-[11px] font-bold ${active ? 'text-white' : 'text-zinc-700'}`}>
                  {m.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Erreur */}
        {error && (
          <div key={shakeKey} className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          </div>
        )}

        {/* Progress bar */}
        {loading && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Traitement en cours…
            </p>
            <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-950 rounded-full transition-all duration-[2000ms] w-full" />
            </div>
          </div>
        )}

        {/* Bouton */}
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white
                     text-sm font-bold py-4 rounded-xl transition-all duration-200
                     hover:-translate-y-0.5 hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
              </svg>
              Paiement en cours…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              Payer {AMOUNT} FCFA
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </>
          )}
        </button>

        {/* Sécurité */}
        <div className="flex items-center justify-center gap-1.5 text-zinc-300">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-widest">
            Paiement 100% sécurisé
          </span>
        </div>

      </div>
    </div>
  );
}
