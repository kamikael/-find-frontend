import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Summary from '../../components/Summary/Summary';

export default function Recapitulatif() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Retour
          </button>

          {/* Carte unique */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <Summary />
          </div>

          <p className="text-center text-[10px] text-zinc-300 font-medium mt-6">
            Paiement sécurisé · #Find · Stage académique 2026
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}
