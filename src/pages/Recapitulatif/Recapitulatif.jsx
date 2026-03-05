import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Summary from '../../components/Summary/Summary';

export default function Recapitulatif() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f5] text-zinc-900">
      <Navbar />

      <main className="flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour
          </button>

          <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
            <Summary />
          </div>

          <p className="mt-5 text-center text-xs font-semibold tracking-[0.08em] text-zinc-400">
            Paiement sécurisé · Stage académique 2026
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}



