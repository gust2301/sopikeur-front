# Plan d’action SEO priorisé — Sopi Kër (SPA Angular, Sénégal)

## 1) Optimisation On-Page (priorité immédiate: semaine 1)

### Page Accueil (`/`)
- **Title proposé**: `Revêtement de sol SPC au Sénégal | Sopi Kër Dakar`
- **Meta description proposée**: `Sopi Kër vous propose des revêtements de sol SPC et panneaux muraux acoustiques au Sénégal. Commande en ligne, livraison et pose à Dakar et partout au pays.`
- **Intent cible**: requêtes transactionnelles brand + génériques (`revêtement de sol Sénégal`, `SPC Dakar`, `sol PVC clipsable Dakar`).

### Page SPC (`/spc`)
- **Title proposé**: `Sol SPC clipsable Dakar | Prix, livraison et pose au Sénégal`
- **Meta description proposée**: `Découvrez notre sol SPC clipsable: résistant à l’eau, durable et élégant. Devis rapide, livraison et pose professionnelle à Dakar et dans tout le Sénégal.`
- **Intent cible**: comparaison et achat (`sol SPC Dakar`, `prix sol SPC Sénégal`, `revêtement sol étanche Dakar`).

### Page Panneaux acoustiques (`/panneaux`)
- **Title proposé**: `Panneaux muraux acoustiques Dakar | Design & isolation sonore`
- **Meta description proposée**: `Améliorez l’acoustique de votre intérieur avec nos panneaux muraux décoratifs. Livraison et pose à Dakar et partout au Sénégal. Conseils experts Sopi Kër.`
- **Intent cible**: recherche de solution (`panneau acoustique Dakar`, `habillage mural Sénégal`, `isolation phonique mur Dakar`).

---

## 2) Stratégie de contenu éditorial (priorité haute: semaines 2 à 6)

### 5 contenus à publier en premier
1. **"SPC vs carrelage au Sénégal: quel revêtement choisir selon votre budget et votre quartier à Dakar?"**
   - Angle local: chaleur, humidité, poussière, entretien.
2. **"Quel est le prix d’un sol SPC au Sénégal en 2026? (matériaux, pose, livraison)"**
   - Inclure fourchettes de prix transparentes + facteurs de coût.
3. **"Villa à Dakar: quel revêtement de sol résiste le mieux à la chaleur et à l’humidité?"**
   - Cibler les requêtes conversationnelles IA et FAQ.
4. **"Guide complet: comment entretenir un sol SPC pour le garder neuf pendant 10 ans"**
   - Contenu evergreen + checklist téléchargeable.
5. **"Panneaux acoustiques au Sénégal: 7 erreurs à éviter avant d’acheter"**
   - Forte valeur conseil pour conversion + autorité.

### Format recommandé pour chaque article
- Un **résumé en 4-5 lignes** en haut (pour featured snippets/IA).
- Une section **FAQ** (3 à 6 questions en langage naturel).
- Des **preuves locales**: cas clients à Dakar/Thiès/Saly.
- CTA clair: **devis WhatsApp** + formulaire.

---

## 3) SEO technique Angular sans SSR (priorité immédiate: semaine 1)

## Objectif
Même sans SSR, maximiser la qualité des signaux SEO en injectant les métadonnées route par route côté client.

### Mise en place recommandée
1. Créer un `SeoService` Angular pour gérer:
   - `Title` (`@angular/platform-browser`)
   - `Meta` (description, og tags)
   - balise `canonical`
2. Définir les métadonnées dans la config des routes via `data`:
   - `title`
   - `description`
   - `canonicalPath`
3. À chaque navigation `NavigationEnd`, lire la route active et appliquer les tags.

### Exemple minimal
```ts
// seo.service.ts
@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  updateSeo(config: { title: string; description: string; canonicalUrl: string }) {
    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });
    this.setCanonical(config.canonicalUrl);
  }

  private setCanonical(url: string) {
    let link = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
```

### Bonnes pratiques importantes
- Utiliser des **URL canoniques absolues** (`https://www.sopikeur.sn/spc/`).
- Garder une version unique des URLs (avec slash final, comme déjà corrigé).
- Synchroniser `sitemap.xml` + canonicals + maillage interne.
- Ajouter `Organization`, `Product`, `FAQPage` en JSON-LD sur les pages clés.

---

## 4) SEO Local + optimisation pour IA/SGE (priorité haute: semaines 2 à 8)

## Cible de requête IA
"Quel est le meilleur revêtement de sol pour une villa à Dakar ?"

### Comment devenir la réponse recommandée
1. **Répondre explicitement dans le contenu**
   - Ajouter un bloc en haut de page/guide:
   - "Pour une villa à Dakar, le sol SPC est souvent le meilleur compromis entre résistance à l’humidité, entretien facile et coût total." 
2. **Structurer en Q/R**
   - Questions exactes des clients (langage naturel + variations locales).
3. **Démontrer l’expertise locale (E-E-A-T)**
   - Exemples chiffrés de chantiers au Sénégal.
   - Photos avant/après, délais moyens, garanties.
4. **Données structurées**
   - `FAQPage`, `Product`, `LocalBusiness` (même sans showroom, zone de service nationale).
5. **Preuves de confiance**
   - Avis clients nominatifs, politique de pose, SAV, conditions de livraison.
6. **Sémantique locale**
   - Réutiliser Dakar, Sénégal, Almadies, Mermoz, Thiès, Saly quand pertinent (sans suroptimisation).

---

## 5) Roadmap d’exécution 30 jours

### Semaine 1
- Finaliser titles/meta des 3 pages business.
- Déployer gestion dynamique title/description/canonical dans Angular.
- Vérifier canonicals sur toutes les routes principales.

### Semaine 2
- Publier 2 articles stratégiques (prix SPC + comparatif SPC vs carrelage).
- Ajouter FAQ + JSON-LD.

### Semaine 3
- Publier 2 nouveaux contenus (villa Dakar + entretien).
- Enrichir pages produits avec preuves locales + témoignages.

### Semaine 4
- Publier le 5e contenu (panneaux acoustiques: erreurs à éviter).
- Optimiser CTR (A/B test titres/meta) et maillage interne vers pages transactionnelles.

## KPIs à suivre
- Impressions/clics sur requêtes: `SPC Dakar`, `sol SPC Sénégal`, `revêtement villa Dakar`.
- CTR des 3 pages principales.
- Leads: clics WhatsApp, formulaires devis, appels.
- Position moyenne des articles guides.
