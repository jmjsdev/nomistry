'use client';

import { useAppStore } from '@/store/useAppStore';
import { Heart, CheckCircle, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NamesList() {
  const {
    generatedNames,
    selectedNames,
    isVerifying,
    toggleFavorite,
    toggleSelected,
    selectAllNames,
    deselectAllNames,
    setIsVerifying,
    setCurrentStep,
    clearAvailabilityReports,
    addAvailabilityReport,
  } = useAppStore();

  const handleVerifyAvailability = async () => {
    if (selectedNames.length === 0) {
      alert('Veuillez sélectionner au moins un nom à vérifier.');
      return;
    }

    setIsVerifying(true);
    clearAvailabilityReports();
    setCurrentStep('verify');

    try {
      // Vérifier chaque nom sélectionné
      for (const name of selectedNames) {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name.name }),
        });

        const data = await response.json();

        if (data.error) {
          console.error('Error verifying name:', data.error);
          continue;
        }

        addAvailabilityReport(data.report);
      }

      setCurrentStep('report');
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue lors de la vérification.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (generatedNames.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Noms générés ({generatedNames.length})
          </h2>
          <div className="flex gap-3">
            <button
              onClick={selectAllNames}
              className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Tout sélectionner
            </button>
            <button
              onClick={deselectAllNames}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tout désélectionner
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {generatedNames.map((name) => (
            <div
              key={name.id}
              className={cn(
                'relative p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer group',
                name.isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
              onClick={() => toggleSelected(name.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {name.isSelected ? (
                    <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
                  )}
                  <span className="text-lg font-semibold text-gray-900">
                    {name.name}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(name.id);
                  }}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Heart
                    className={cn(
                      'w-6 h-6 transition-colors',
                      name.isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-300 hover:text-red-400'
                    )}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedNames.length > 0 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {selectedNames.length} nom{selectedNames.length > 1 ? 's' : ''} sélectionné{selectedNames.length > 1 ? 's' : ''}
            </p>
            <button
              onClick={handleVerifyAvailability}
              disabled={isVerifying}
              className={cn(
                'px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200',
                'flex items-center gap-2',
                isVerifying
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
              )}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                <>
                  Vérifier la disponibilité
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
