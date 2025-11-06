import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { GenerationOptions } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const options: GenerationOptions = await request.json();

    if (!options.description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey,
    });

    // Construire le prompt en fonction des options
    const lengthDescription = {
      short: '5-8 caractères',
      medium: '9-12 caractères',
      long: '13+ caractères',
    };

    const styleDescription = {
      modern: 'moderne, innovant et accrocheur',
      classic: 'classique, traditionnel et sobre',
      fantasy: 'fantaisiste, imaginatif et créatif',
      professional: 'professionnel, sérieux et crédible',
    };

    const themeDescription = {
      technology: 'technologie, innovation, digital',
      nature: 'nature, écologie, environnement',
      adventure: 'aventure, exploration, voyage',
      finance: 'finance, économie, business',
      health: 'santé, bien-être, médical',
      education: 'éducation, apprentissage, formation',
      entertainment: 'divertissement, loisirs, culture',
    };

    const prompt = `Tu es un expert en naming et branding. Ta mission est de générer ${options.count || 10} noms créatifs et originaux pour un projet ou une marque.

Description du projet : ${options.description}

Contraintes :
- Longueur : ${lengthDescription[options.length]} (environ)
- Style : ${styleDescription[options.style]}
- Thème : ${themeDescription[options.theme]}

Instructions :
1. Crée des noms mémorables, faciles à prononcer et à retenir
2. Assure-toi que les noms sont uniques et distinctifs
3. Les noms doivent refléter le style ${options.style} et le thème ${options.theme}
4. Évite les noms trop génériques ou déjà très utilisés
5. Les noms peuvent être des mots-valises, des néologismes, ou des combinaisons créatives
6. Privilégie des noms qui fonctionnent bien en français et à l'international

Réponds UNIQUEMENT avec une liste de noms, un par ligne, sans numérotation, sans explication, sans ponctuation supplémentaire.

Exemple de format attendu :
NomExemple1
NomExemple2
NomExemple3

Maintenant, génère les ${options.count || 10} noms :`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extraire les noms de la réponse
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const names = content.text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.match(/^[0-9]+[\.\)]/))
      .slice(0, options.count || 10);

    return NextResponse.json({ names });
  } catch (error) {
    console.error('Error generating names:', error);
    return NextResponse.json(
      { error: 'Failed to generate names', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
