// Types pour les options de génération de noms
export type NameLength = 'short' | 'medium' | 'long';
export type NameStyle = 'modern' | 'classic' | 'fantasy' | 'professional';
export type NameTheme = 'technology' | 'nature' | 'adventure' | 'finance' | 'health' | 'education' | 'entertainment';

export interface GenerationOptions {
  description: string;
  length: NameLength;
  style: NameStyle;
  theme: NameTheme;
  count?: number;
}

// Types pour les noms générés
export interface GeneratedName {
  id: string;
  name: string;
  isFavorite: boolean;
  isSelected: boolean;
}

// Types pour la disponibilité
export type AvailabilityStatus = 'available' | 'taken' | 'checking' | 'error' | 'unknown';

export interface DomainAvailability {
  tld: string;
  status: AvailabilityStatus;
  registrar?: string;
  link?: string;
}

export interface TrademarkAvailability {
  country: string;
  office: string;
  status: AvailabilityStatus;
  existingTrademarks?: Array<{
    name: string;
    number: string;
    class: string;
    owner?: string;
  }>;
  searchLink?: string;
}

export interface SocialMediaAvailability {
  platform: string;
  status: AvailabilityStatus;
  url: string;
  username?: string;
}

export interface AppStoreAvailability {
  store: 'ios' | 'android';
  status: AvailabilityStatus;
  existingApp?: {
    name: string;
    developer: string;
    url: string;
  };
}

export interface NameAvailabilityReport {
  name: string;
  domains: DomainAvailability[];
  trademarks: TrademarkAvailability[];
  socialMedia: SocialMediaAvailability[];
  appStores: AppStoreAvailability[];
  overallScore: number; // 0-100, pourcentage de disponibilité
  lastChecked: Date;
}

// Types pour l'état de l'application
export interface AppState {
  currentStep: 'generate' | 'select' | 'verify' | 'report';
  generationOptions: GenerationOptions | null;
  generatedNames: GeneratedName[];
  selectedNames: GeneratedName[];
  availabilityReports: NameAvailabilityReport[];
  isGenerating: boolean;
  isVerifying: boolean;
}

// Types pour les réponses API
export interface GenerateNamesResponse {
  names: string[];
  error?: string;
}

export interface VerifyAvailabilityResponse {
  report: NameAvailabilityReport;
  error?: string;
}
