import { NextRequest, NextResponse } from 'next/server';
import type {
  NameAvailabilityReport,
  DomainAvailability,
  TrademarkAvailability,
  SocialMediaAvailability,
  AppStoreAvailability,
} from '@/types';
import { calculateAvailabilityScore } from '@/lib/utils';

// Simulation de vérification de domaine (dans une vraie app, utiliser une API comme WhoisXML)
async function checkDomainAvailability(name: string): Promise<DomainAvailability[]> {
  const tlds = ['com', 'fr', 'net', 'io', 'app', 'co'];

  // Simulation avec délai
  await new Promise(resolve => setTimeout(resolve, 500));

  return tlds.map((tld) => {
    // Simulation aléatoire pour la démo
    const isAvailable = Math.random() > 0.5;
    return {
      tld: `.${tld}`,
      status: isAvailable ? 'available' : 'taken',
      registrar: isAvailable ? undefined : ['OVH', 'GoDaddy', 'Gandi'][Math.floor(Math.random() * 3)],
      link: isAvailable ? `https://www.ovh.com/fr/domaines/prix/?search=${name}.${tld}` : undefined,
    };
  });
}

// Simulation de vérification de marque
async function checkTrademarkAvailability(name: string): Promise<TrademarkAvailability[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const offices = [
    { country: 'France', office: 'INPI' },
    { country: 'Europe', office: 'EUIPO' },
    { country: 'USA', office: 'USPTO' },
    { country: 'International', office: 'WIPO' },
  ];

  return offices.map((office) => {
    const isAvailable = Math.random() > 0.4;
    return {
      country: office.country,
      office: office.office,
      status: isAvailable ? 'available' : 'taken',
      existingTrademarks: isAvailable ? undefined : [
        {
          name: name,
          number: `${Math.floor(Math.random() * 1000000)}`,
          class: `${Math.floor(Math.random() * 45) + 1}`,
          owner: 'Entreprise XYZ',
        },
      ],
      searchLink: office.office === 'INPI'
        ? `https://data.inpi.fr/recherche_marques?q=${name}`
        : `https://www.${office.office.toLowerCase()}.com/search?q=${name}`,
    };
  });
}

// Simulation de vérification des réseaux sociaux
async function checkSocialMediaAvailability(name: string): Promise<SocialMediaAvailability[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const platforms = [
    { platform: 'Facebook', baseUrl: 'facebook.com' },
    { platform: 'Twitter/X', baseUrl: 'twitter.com' },
    { platform: 'Instagram', baseUrl: 'instagram.com' },
    { platform: 'LinkedIn', baseUrl: 'linkedin.com/company' },
    { platform: 'YouTube', baseUrl: 'youtube.com' },
    { platform: 'TikTok', baseUrl: 'tiktok.com' },
  ];

  return platforms.map((platform) => {
    const isAvailable = Math.random() > 0.5;
    return {
      platform: platform.platform,
      status: isAvailable ? 'available' : 'taken',
      url: `https://${platform.baseUrl}/${name.toLowerCase()}`,
      username: isAvailable ? undefined : name.toLowerCase(),
    };
  });
}

// Simulation de vérification des App Stores
async function checkAppStoreAvailability(name: string): Promise<AppStoreAvailability[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const stores: Array<'ios' | 'android'> = ['ios', 'android'];

  return stores.map((store) => {
    const isAvailable = Math.random() > 0.6;
    return {
      store,
      status: isAvailable ? 'available' : 'taken',
      existingApp: isAvailable ? undefined : {
        name: name,
        developer: 'Developer XYZ',
        url: store === 'ios'
          ? `https://apps.apple.com/app/${name.toLowerCase()}/id123456789`
          : `https://play.google.com/store/apps/details?id=com.example.${name.toLowerCase()}`,
      },
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Effectuer toutes les vérifications en parallèle
    const [domains, trademarks, socialMedia, appStores] = await Promise.all([
      checkDomainAvailability(name),
      checkTrademarkAvailability(name),
      checkSocialMediaAvailability(name),
      checkAppStoreAvailability(name),
    ]);

    // Calculer le score de disponibilité
    const domainsAvailable = domains.filter((d) => d.status === 'available').length;
    const trademarksAvailable = trademarks.filter((t) => t.status === 'available').length;
    const socialMediaAvailable = socialMedia.filter((s) => s.status === 'available').length;
    const appStoresAvailable = appStores.filter((a) => a.status === 'available').length;

    const overallScore = calculateAvailabilityScore(
      domainsAvailable,
      domains.length,
      trademarksAvailable,
      trademarks.length,
      socialMediaAvailable,
      socialMedia.length,
      appStoresAvailable,
      appStores.length
    );

    const report: NameAvailabilityReport = {
      name,
      domains,
      trademarks,
      socialMedia,
      appStores,
      overallScore,
      lastChecked: new Date(),
    };

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error verifying name availability:', error);
    return NextResponse.json(
      { error: 'Failed to verify name availability', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
