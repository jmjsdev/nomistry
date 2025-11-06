import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateAvailabilityScore(
  domainsAvailable: number,
  totalDomains: number,
  trademarksAvailable: number,
  totalTrademarks: number,
  socialMediaAvailable: number,
  totalSocialMedia: number,
  appStoresAvailable: number,
  totalAppStores: number
): number {
  const weights = {
    domains: 0.3,
    trademarks: 0.3,
    socialMedia: 0.25,
    appStores: 0.15,
  };

  const domainScore = totalDomains > 0 ? (domainsAvailable / totalDomains) * 100 : 0;
  const trademarkScore = totalTrademarks > 0 ? (trademarksAvailable / totalTrademarks) * 100 : 0;
  const socialMediaScore = totalSocialMedia > 0 ? (socialMediaAvailable / totalSocialMedia) * 100 : 0;
  const appStoreScore = totalAppStores > 0 ? (appStoresAvailable / totalAppStores) * 100 : 0;

  return Math.round(
    domainScore * weights.domains +
    trademarkScore * weights.trademarks +
    socialMediaScore * weights.socialMedia +
    appStoreScore * weights.appStores
  );
}
