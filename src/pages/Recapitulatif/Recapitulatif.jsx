import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Summary from '../../components/Summary/Summary';

export default function Recapitulatif() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-xl mx-auto">

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
