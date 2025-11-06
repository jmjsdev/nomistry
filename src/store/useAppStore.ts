import { create } from 'zustand';
import type {
  AppState,
  GenerationOptions,
  GeneratedName,
  NameAvailabilityReport,
} from '@/types';

interface AppStore extends AppState {
  // Actions pour la génération
  setGenerationOptions: (options: GenerationOptions) => void;
  setGeneratedNames: (names: string[]) => void;
  toggleFavorite: (id: string) => void;
  toggleSelected: (id: string) => void;
  selectAllNames: () => void;
  deselectAllNames: () => void;

  // Actions pour la navigation
  setCurrentStep: (step: AppState['currentStep']) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Actions pour la vérification
  setIsGenerating: (isGenerating: boolean) => void;
  setIsVerifying: (isVerifying: boolean) => void;
  addAvailabilityReport: (report: NameAvailabilityReport) => void;
  clearAvailabilityReports: () => void;

  // Actions pour réinitialiser
  reset: () => void;
}

const initialState: AppState = {
  currentStep: 'generate',
  generationOptions: null,
  generatedNames: [],
  selectedNames: [],
  availabilityReports: [],
  isGenerating: false,
  isVerifying: false,
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  setGenerationOptions: (options) => set({ generationOptions: options }),

  setGeneratedNames: (names) => {
    const generatedNames: GeneratedName[] = names.map((name, index) => ({
      id: `name-${Date.now()}-${index}`,
      name,
      isFavorite: false,
      isSelected: false,
    }));
    set({ generatedNames, currentStep: 'select' });
  },

  toggleFavorite: (id) => {
    set((state) => ({
      generatedNames: state.generatedNames.map((name) =>
        name.id === id ? { ...name, isFavorite: !name.isFavorite } : name
      ),
    }));
  },

  toggleSelected: (id) => {
    set((state) => {
      const generatedNames = state.generatedNames.map((name) =>
        name.id === id ? { ...name, isSelected: !name.isSelected } : name
      );
      const selectedNames = generatedNames.filter((name) => name.isSelected);
      return { generatedNames, selectedNames };
    });
  },

  selectAllNames: () => {
    set((state) => {
      const generatedNames = state.generatedNames.map((name) => ({
        ...name,
        isSelected: true,
      }));
      return { generatedNames, selectedNames: generatedNames };
    });
  },

  deselectAllNames: () => {
    set((state) => ({
      generatedNames: state.generatedNames.map((name) => ({
        ...name,
        isSelected: false,
      })),
      selectedNames: [],
    }));
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  goToNextStep: () => {
    const { currentStep } = get();
    const steps: AppState['currentStep'][] = ['generate', 'select', 'verify', 'report'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      set({ currentStep: steps[currentIndex + 1] });
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    const steps: AppState['currentStep'][] = ['generate', 'select', 'verify', 'report'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      set({ currentStep: steps[currentIndex - 1] });
    }
  },

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setIsVerifying: (isVerifying) => set({ isVerifying }),

  addAvailabilityReport: (report) => {
    set((state) => ({
      availabilityReports: [...state.availabilityReports, report],
    }));
  },

  clearAvailabilityReports: () => set({ availabilityReports: [] }),

  reset: () => set(initialState),
}));
