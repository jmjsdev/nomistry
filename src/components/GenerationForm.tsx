'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { GenerationOptions, NameLength, NameStyle, NameTheme } from '@/types';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GenerationForm() {
  const { setGenerationOptions, setGeneratedNames, setIsGenerating, isGenerating } = useAppStore();

  const [description, setDescription] = useState('');
  const [length, setLength] = useState<NameLength>('medium');
  const [style, setStyle] = useState<NameStyle>('modern');
  const [theme, setTheme] = useState<NameTheme>('technology');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const options: GenerationOptions = {
      description,
      length,
      style,
      theme,
      count: 10,
    };

    setGenerationOptions(options);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      const data = await response.json();

      if (data.error) {
        alert('Erreur: ' + data.error);
        return;
      }

      setGeneratedNames(data.names);
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue lors de la génération des noms.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
          <Sparkles className="w-10 h-10 text-primary-500" />
          Nomistry
        </h1>
        <p className="text-lg text-gray-600">
          Générateur de noms avec vérification de disponibilité
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description de votre projet
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="Décrivez votre projet, ses valeurs, son activité... Plus votre description est détaillée, meilleurs seront les noms générés."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Longueur */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Longueur du nom
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'short', label: 'Court (5-8)', desc: '5-8 caractères' },
              { value: 'medium', label: 'Moyen (9-12)', desc: '9-12 caractères' },
              { value: 'long', label: 'Long (13+)', desc: '13+ caractères' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLength(option.value as NameLength)}
                className={cn(
                  'px-4 py-3 rounded-lg border-2 transition-all duration-200',
                  length === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Style du nom
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'modern', label: 'Moderne' },
              { value: 'classic', label: 'Classique' },
              { value: 'fantasy', label: 'Fantaisie' },
              { value: 'professional', label: 'Professionnel' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStyle(option.value as NameStyle)}
                className={cn(
                  'px-4 py-3 rounded-lg border-2 transition-all duration-200',
                  style === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Thème */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Thème
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 'technology', label: 'Technologie' },
              { value: 'nature', label: 'Nature' },
              { value: 'adventure', label: 'Aventure' },
              { value: 'finance', label: 'Finance' },
              { value: 'health', label: 'Santé' },
              { value: 'education', label: 'Éducation' },
              { value: 'entertainment', label: 'Divertissement' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value as NameTheme)}
                className={cn(
                  'px-4 py-3 rounded-lg border-2 transition-all duration-200',
                  theme === option.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || !description}
          className={cn(
            'w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200',
            'flex items-center justify-center gap-2',
            isGenerating || !description
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Générer des noms
            </>
          )}
        </button>
      </form>
    </div>
  );
}
