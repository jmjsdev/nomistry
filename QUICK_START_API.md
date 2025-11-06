# 🚀 Quick Start - Intégrer les APIs réelles

Ce guide vous permet de passer rapidement de la simulation aux vraies APIs de vérification de domaines.

## ⚡ Installation rapide (5 minutes)

### Option 1 : WhoAPI (Recommandé pour débuter)

**Avantages :** 10,000 requêtes gratuites, simple à configurer

1. **S'inscrire sur WhoAPI**
   ```
   👉 https://whoapi.com/
   ```

2. **Obtenir votre clé API**
   - Après inscription, vous recevez automatiquement 10,000 crédits gratuits
   - Copiez votre API Key depuis votre dashboard

3. **Configurer Nomistry**
   ```bash
   # Créer le fichier .env
   cp .env.example .env

   # Éditer .env et ajouter votre clé
   WHOAPI_KEY=votre_clé_whoapi_ici
   DOMAIN_CHECKER=whoapi
   ```

4. **Activer la nouvelle API**
   ```bash
   # Renommer le fichier avec les vraies APIs
   cd src/app/api/verify
   mv route.ts route-simulation.ts.backup
   mv route-with-real-apis.ts route.ts
   ```

5. **Redémarrer l'application**
   ```bash
   npm run dev
   ```

✅ **C'est fait !** L'application utilise maintenant WhoAPI pour vérifier les domaines.

---

### Option 2 : WhoisXML API (Alternative)

**Avantages :** 100 requêtes gratuites par mois (renouvelables)

1. **S'inscrire sur WhoisXML API**
   ```
   👉 https://whoisxmlapi.com/
   ```

2. **Obtenir votre clé API**
   - Après inscription, accédez à votre dashboard
   - Copiez votre API Key

3. **Configurer Nomistry**
   ```bash
   # Éditer .env
   WHOISXML_API_KEY=votre_clé_whoisxml_ici
   DOMAIN_CHECKER=whoisxml
   ```

4. **Même étape 4 et 5 que pour WhoAPI**

---

## 🔧 Configuration avancée

### Utiliser plusieurs APIs avec fallback

Pour une meilleure fiabilité, configurez plusieurs APIs :

```env
# .env
WHOAPI_KEY=votre_clé_whoapi
WHOISXML_API_KEY=votre_clé_whoisxml
DOMAIN_CHECKER=whoapi  # API principale
```

Si l'API principale échoue, le système basculera automatiquement sur l'API de secours.

### Vérifier la configuration

Ajoutez ce code temporairement dans votre application pour voir quelle API est utilisée :

```typescript
// Ajouter dans src/app/page.tsx (temporairement)
import { getDomainCheckerInfo } from '@/lib/domain-checkers';

// Dans le composant
useEffect(() => {
  const info = getDomainCheckerInfo();
  console.log('🔍 Domain Checker Info:', info);
}, []);
```

Vous verrez dans la console :
```
🔍 Domain Checker Info: {
  provider: 'whoapi',
  simulation: false,
  hasWhoAPI: true,
  hasWhoisXML: false
}
```

---

## 📊 Limites et coûts

### WhoAPI
- **Free Tier :** 10,000 requêtes (one-time)
- **Après :** ~$0.005 par requête
- **Usage estimé :** Avec 10 TLDs par nom, vous pouvez vérifier ~1,000 noms

### WhoisXML API
- **Free Tier :** 100 requêtes/mois (renouvelable)
- **Après :** ~$0.01-0.03 par requête
- **Usage estimé :** ~10 noms par mois (gratuit)

### Calcul d'usage pour Nomistry

Pour chaque nom vérifié, l'application fait :
- **6 requêtes de domaines** (.com, .fr, .net, .io, .app, .co)
- Les marques, réseaux sociaux et app stores sont encore en simulation

**Exemple avec WhoAPI (10,000 free) :**
- 10,000 crédits ÷ 6 requêtes = **~1,666 noms vérifiables**

---

## 🧪 Tester l'intégration

1. **Test simple**
   ```bash
   # Dans la console du navigateur (F12)
   fetch('/api/verify', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ name: 'testdomainxyz' })
   })
   .then(r => r.json())
   .then(console.log)
   ```

2. **Vérifier les logs**
   ```bash
   # Dans votre terminal où tourne npm run dev
   # Vous devriez voir :
   ✓ Using whoapi for domain availability checks
   ```

3. **Vérifier le résultat**
   - Les résultats doivent être cohérents (pas aléatoires)
   - Si vous testez le même nom plusieurs fois, le résultat doit être identique

---

## ❓ Troubleshooting

### Erreur : "WHOAPI_KEY not configured"

**Solution :** Vérifiez que votre `.env` contient la clé et redémarrez le serveur.

```bash
# Vérifier que .env existe et contient la clé
cat .env | grep WHOAPI_KEY

# Redémarrer
npm run dev
```

### L'application utilise toujours la simulation

**Solution :** Vérifiez que vous avez bien renommé les fichiers :

```bash
cd src/app/api/verify
ls -la

# Vous devriez voir :
# route.ts (le nouveau avec vraies APIs)
# route-simulation.ts.backup (l'ancien)
```

### Erreur 401 ou 403 de l'API

**Solutions :**
1. Vérifiez que votre clé API est correcte
2. Vérifiez que votre compte est actif
3. Vérifiez que vous n'avez pas dépassé les limites

### Les vérifications sont lentes

**Normal !** Les vraies APIs prennent 1-3 secondes par nom (vs instantané pour la simulation).

Pour améliorer :
```typescript
// Dans src/lib/domain-checkers/whoapi.ts
// Réduire le délai entre requêtes (ligne ~59)
await new Promise(resolve => setTimeout(resolve, 50)); // Au lieu de 100
```

⚠️ **Attention :** Trop rapide peut causer des rate limits !

---

## 📈 Prochaines étapes

Une fois les APIs de domaines intégrées, vous pouvez :

1. ✅ Intégrer les APIs de marques déposées (INPI, USPTO, etc.)
2. ✅ Intégrer les APIs des réseaux sociaux
3. ✅ Intégrer les APIs des App Stores
4. ✅ Ajouter un cache pour éviter les requêtes répétées
5. ✅ Implémenter un système de crédits/quotas pour les utilisateurs

Consultez `DOMAIN_API_GUIDE.md` pour des instructions détaillées sur chaque API.

---

## 🆘 Besoin d'aide ?

1. Consultez `DOMAIN_API_GUIDE.md` pour plus de détails
2. Lisez `TODO.md` pour voir toutes les fonctionnalités
3. Vérifiez les logs de la console et du terminal
4. Testez avec différentes APIs pour comparer

**Mode débogage :**
```env
# .env
NODE_ENV=development
DEBUG=true
```

Cela affichera plus d'informations dans les logs.

---

## 🎉 Félicitations !

Vous utilisez maintenant de vraies APIs pour vérifier la disponibilité des domaines !

**Statistiques de vos crédits :**
- WhoAPI : Check dashboard à https://whoapi.com/dashboard
- WhoisXML : Check à https://whoisxmlapi.com/dashboard

**Pro tip :** Commencez avec WhoAPI (10,000 free) pour développer, puis basculez vers un plan payant ou WhoisXML pour la production.
