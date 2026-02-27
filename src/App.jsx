import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApplicationProvider } from './context/ApplicationContext';
import Home from './pages/Home/Home';
import DemandeStage from './pages/DemandeStage/DemandeStage';
import Formulaire from './pages/Formulaire/Formulaire';
import Recapitulatif from './pages/Recapitulatif/Recapitulatif';
import Success from './pages/Success/Success';
import Contact from './pages/Contact/Contact';
import ScrollToTop from './components/ScrollToTop';

/**
 * Point d'entrée de l'application #Find.
 * Routes : Accueil, Demande de stage, Formulaire, Récapitulatif, Success.
 */
function App() {
  return (
    <ApplicationProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demande-stage" element={<DemandeStage />} />
          <Route path="/formulaire" element={<Formulaire />} />
          <Route path="/recapitulatif" element={<Recapitulatif />} />
          <Route path="/success" element={<Success />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </ApplicationProvider>
  );
}

export default App;

