# Guide d'implémentation - APIs de vérification de domaines

## 🎯 Vue d'ensemble

Ce guide détaille comment implémenter de vraies APIs pour vérifier la disponibilité des noms de domaine dans Nomistry.

---

## 1. 🔵 Gandi.net API

### Avantages
- ✅ Registrar français reconnu
- ✅ API REST moderne (v5)
- ✅ Documentation complète
- ✅ Sandbox pour tests

### Limitations
- ⚠️ Nécessite un compte Gandi
- ⚠️ Pas de free tier (payant selon usage)
- ⚠️ Authentification par token

### Documentation officielle
- REST API : https://api.gandi.net/docs/domains/
- Sandbox API : https://api.sandbox.gandi.net/docs/domains/

### Configuration

1. **Créer un compte Gandi**
2. **Générer un Personal Access Token** :
   - Aller dans Organization Tab de l'admin Gandi
   - Choisir l'organisation
   - Aller dans l'onglet "Sharing"
   - Cliquer sur "Create a token"

3. **Ajouter le token dans `.env`** :
```env
GANDI_API_KEY=your_personal_access_token_here
```

### Exemple d'implémentation

```typescript
// lib/domain-checkers/gandi.ts
interface GandiAvailabilityResponse {
  products: Array<{
    product_name: string;
    status: 'available' | 'unavailable' | 'pending';
    process: string;
  }>;
}

export async function checkDomainWithGandi(
  domain: string
): Promise<boolean> {
  const apiKey = process.env.GANDI_API_KEY;

  if (!apiKey) {
    throw new Error('GANDI_API_KEY not configured');
  }

  try {
    const response = await fetch(
      `https://api.gandi.net/v5/domain/check?name=${encodeURIComponent(domain)}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Gandi API error: ${response.status}`);
    }

    const data: GandiAvailabilityResponse = await response.json();

    // Vérifier si le domaine est disponible
    const product = data.products?.[0];
    return product?.status === 'available';
  } catch (error) {
    console.error('Gandi API error:', error);
    throw error;
  }
}

// Vérifier plusieurs domaines
export async function checkMultipleDomainsGandi(
  name: string,
  tlds: string[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  // Gandi permet de vérifier plusieurs domaines en parallèle
  await Promise.all(
    tlds.map(async (tld) => {
      const domain = `${name}.${tld}`;
      try {
        const isAvailable = await checkDomainWithGandi(domain);
        results.set(tld, isAvailable);
      } catch (error) {
        console.error(`Error checking ${domain}:`, error);
        results.set(tld, false);
      }
    })
  );

  return results;
}
```

---

## 2. 🟢 WhoAPI (Recommandé pour débuter)

### Avantages
- ✅ **10,000 requêtes gratuites** (one-time)
- ✅ API simple à utiliser
- ✅ JSON et XML
- ✅ Réponse rapide

### Limitations
- ⚠️ Free tier non renouvelable
- ⚠️ Nécessite un email valide

### Documentation
- https://whoapi.com/domain-availability-api/

### Configuration

1. **S'inscrire sur WhoAPI** : https://whoapi.com/
2. **Obtenir la clé API** (10,000 requêtes gratuites)
3. **Ajouter dans `.env`** :
```env
WHOAPI_KEY=your_whoapi_key_here
```

### Exemple d'implémentation

```typescript
// lib/domain-checkers/whoapi.ts
interface WhoAPIResponse {
  status: string; // "0" = available, "1" = taken
  domain_name: string;
  response_time: string;
}

export async function checkDomainWithWhoAPI(
  domain: string
): Promise<boolean> {
  const apiKey = process.env.WHOAPI_KEY;

  if (!apiKey) {
    throw new Error('WHOAPI_KEY not configured');
  }

  try {
    const response = await fetch(
      `https://api.whoapi.com/?domain=${encodeURIComponent(domain)}&r=taken&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`WhoAPI error: ${response.status}`);
    }

    const data: WhoAPIResponse = await response.json();

    // "0" = available, "1" = taken
    return data.status === "0";
  } catch (error) {
    console.error('WhoAPI error:', error);
    throw error;
  }
}

export async function checkMultipleDomainsWhoAPI(
  name: string,
  tlds: string[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  // Vérifier séquentiellement pour respecter rate limits
  for (const tld of tlds) {
    const domain = `${name}.${tld}`;
    try {
      const isAvailable = await checkDomainWithWhoAPI(domain);
      results.set(tld, isAvailable);

      // Petit délai pour éviter rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error checking ${domain}:`, error);
      results.set(tld, false);
    }
  }

  return results;
}
```

---

## 3. 🟡 WhoisXML API

### Avantages
- ✅ 100 requêtes gratuites par mois
- ✅ Très fiable et rapide
- ✅ Données WHOIS complètes
- ✅ Documentation excellente

### Limitations
- ⚠️ Limite mensuelle basse (100)
- ⚠️ Payant après le free tier

### Documentation
- https://domain-availability.whoisxmlapi.com/

### Configuration

```env
WHOISXML_API_KEY=your_whoisxml_api_key_here
```

### Exemple d'implémentation

```typescript
// lib/domain-checkers/whoisxml.ts
interface WhoisXMLResponse {
  DomainInfo: {
    domainAvailability: 'AVAILABLE' | 'UNAVAILABLE';
    domainName: string;
  };
}

export async function checkDomainWithWhoisXML(
  domain: string
): Promise<boolean> {
  const apiKey = process.env.WHOISXML_API_KEY;

  if (!apiKey) {
    throw new Error('WHOISXML_API_KEY not configured');
  }

  try {
    const response = await fetch(
      `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${encodeURIComponent(domain)}`
    );

    if (!response.ok) {
      throw new Error(`WhoisXML API error: ${response.status}`);
    }

    const data: WhoisXMLResponse = await response.json();

    return data.DomainInfo.domainAvailability === 'AVAILABLE';
  } catch (error) {
    console.error('WhoisXML API error:', error);
    throw error;
  }
}
```

---

## 4. 🟣 Namecheap API

### Avantages
- ✅ Registrar populaire
- ✅ API gratuite avec compte
- ✅ Permet aussi l'enregistrement

### Limitations
- ⚠️ Nécessite un compte avec achats
- ⚠️ IP whitelisting requis

### Documentation
- https://www.namecheap.com/support/api/methods/domains/check/

### Configuration

```env
NAMECHEAP_API_USER=your_username
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_CLIENT_IP=your_whitelisted_ip
```

### Exemple d'implémentation

```typescript
// lib/domain-checkers/namecheap.ts
export async function checkDomainWithNamecheap(
  domain: string
): Promise<boolean> {
  const apiUser = process.env.NAMECHEAP_API_USER;
  const apiKey = process.env.NAMECHEAP_API_KEY;
  const clientIp = process.env.NAMECHEAP_CLIENT_IP;

  if (!apiUser || !apiKey || !clientIp) {
    throw new Error('Namecheap API credentials not configured');
  }

  const params = new URLSearchParams({
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: apiUser,
    ClientIp: clientIp,
    Command: 'namecheap.domains.check',
    DomainList: domain,
  });

  try {
    const response = await fetch(
      `https://api.namecheap.com/xml.response?${params.toString()}`
    );

    const xml = await response.text();

    // Parser le XML (utiliser xml2js ou similaire)
    const isAvailable = xml.includes('Available="true"');

    return isAvailable;
  } catch (error) {
    console.error('Namecheap API error:', error);
    throw error;
  }
}
```

---

## 5. 🔴 Domainr API (via RapidAPI)

### Avantages
- ✅ Free tier via RapidAPI
- ✅ Très rapide
- ✅ Suggestions de domaines

### Configuration

```env
RAPIDAPI_KEY=your_rapidapi_key_here
```

### Exemple d'implémentation

```typescript
// lib/domain-checkers/domainr.ts
export async function checkDomainWithDomainr(
  domain: string
): Promise<boolean> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY not configured');
  }

  try {
    const response = await fetch(
      `https://domainr.p.rapidapi.com/v2/status?domain=${encodeURIComponent(domain)}`,
      {
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'domainr.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Domainr API error: ${response.status}`);
    }

    const data = await response.json();

    return data.status?.[0]?.summary === 'inactive';
  } catch (error) {
    console.error('Domainr API error:', error);
    throw error;
  }
}
```

---

## 📊 Comparaison des APIs

| API | Free Tier | Facilité | Fiabilité | Recommandation |
|-----|-----------|----------|-----------|----------------|
| **WhoAPI** | ⭐⭐⭐⭐⭐<br>10,000 (one-time) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Meilleur pour démarrer** |
| **WhoisXML** | ⭐⭐⭐<br>100/mois | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Plus fiable** |
| **Gandi** | ⭐<br>Payant | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Production |
| **Namecheap** | ⭐⭐⭐⭐<br>Gratuit | ⭐⭐⭐ | ⭐⭐⭐⭐ | Si déjà client |
| **Domainr** | ⭐⭐⭐<br>Limited | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Via RapidAPI |

---

## 🚀 Stratégie d'implémentation recommandée

### Phase 1 : Développement (Free Tier)

Utiliser **WhoAPI** pour le développement initial (10,000 requêtes gratuites) :

```typescript
// .env
WHOAPI_KEY=your_key_here
DOMAIN_CHECKER=whoapi
```

### Phase 2 : Tests avancés

Combiner **WhoAPI** + **WhoisXML API** :

```typescript
// .env
WHOAPI_KEY=your_key_here
WHOISXML_API_KEY=your_key_here
DOMAIN_CHECKER=hybrid
```

### Phase 3 : Production

Passer à **Gandi API** ou **service payant** avec fallback :

```typescript
// .env
GANDI_API_KEY=your_key_here
WHOISXML_API_KEY=your_key_here # Fallback
DOMAIN_CHECKER=gandi
```

---

## 💡 Implémentation avec fallback

Créer un système intelligent qui utilise plusieurs APIs :

```typescript
// lib/domain-checkers/index.ts
import { checkDomainWithWhoAPI } from './whoapi';
import { checkDomainWithWhoisXML } from './whoisxml';
import { checkDomainWithGandi } from './gandi';

export async function checkDomainAvailability(
  domain: string
): Promise<boolean> {
  const checker = process.env.DOMAIN_CHECKER || 'whoapi';

  try {
    switch (checker) {
      case 'gandi':
        return await checkDomainWithGandi(domain);

      case 'whoisxml':
        return await checkDomainWithWhoisXML(domain);

      case 'whoapi':
      default:
        return await checkDomainWithWhoAPI(domain);
    }
  } catch (error) {
    console.error(`Primary checker (${checker}) failed, trying fallback...`);

    // Fallback
    try {
      if (checker !== 'whoapi' && process.env.WHOAPI_KEY) {
        return await checkDomainWithWhoAPI(domain);
      }
      if (checker !== 'whoisxml' && process.env.WHOISXML_API_KEY) {
        return await checkDomainWithWhoisXML(domain);
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }

    throw error;
  }
}
```

---

## 📝 Notes importantes

### Rate Limiting
- Implémenter un délai entre les requêtes (100-200ms)
- Utiliser Promise.all avec limite de concurrence
- Mettre en cache les résultats

### Gestion d'erreurs
- Toujours avoir un fallback
- Logger les erreurs pour monitoring
- Afficher des messages clairs à l'utilisateur

### Coûts
- **WhoAPI** : Gratuit (10k) puis ~$0.005/requête
- **WhoisXML** : Gratuit (100/mois) puis ~$0.01-0.03/requête
- **Gandi** : Variable selon volume

### Alternative gratuite
Pour un MVP sans API payante, utiliser **whoiser** (npm) :
```bash
npm install whoiser
```

```typescript
import whoiser from 'whoiser';

async function checkDomainWithWhois(domain: string): Promise<boolean> {
  try {
    const result = await whoiser(domain);
    // Parser le résultat WHOIS
    return !result || Object.keys(result).length === 0;
  } catch {
    return true; // Probablement disponible si pas de données WHOIS
  }
}
```

⚠️ **Attention** : Les requêtes WHOIS directes peuvent être lentes et bloquées par certains serveurs.

---

## 🎯 Prochaines étapes

1. ✅ Choisir une API (recommandé : **WhoAPI** pour démarrer)
2. ✅ Créer un compte et obtenir la clé API
3. ✅ Ajouter la clé dans `.env`
4. ✅ Implémenter le checker correspondant
5. ✅ Tester avec quelques domaines
6. ✅ Déployer et monitorer l'usage
