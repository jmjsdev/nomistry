'use client';

import { useAppStore } from '@/store/useAppStore';
import GenerationForm from '@/components/GenerationForm';
import NamesList from '@/components/NamesList';
import AvailabilityReport from '@/components/AvailabilityReport';

export default function Home() {
  const { currentStep } = useAppStore();

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Afficher le formulaire si on est à l'étape generate */}
        {currentStep === 'generate' && <GenerationForm />}

        {/* Afficher la liste des noms générés si on est à l'étape select ou après */}
        {(currentStep === 'select' || currentStep === 'verify' || currentStep === 'report') && <NamesList />}

        {/* Afficher le rapport si on est à l'étape report */}
        {currentStep === 'report' && <AvailabilityReport />}

        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm mt-12">
          <p>
            Nomistry - Générateur de noms avec vérification de disponibilité
          </p>
          <p className="mt-1">
            Propulsé par Claude AI
          </p>
        </footer>
      </div>
    </main>
  );
}
