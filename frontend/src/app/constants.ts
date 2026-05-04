import { Testimonial, BlogPost } from './lib/api';

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initial: 'MA',
    name: 'Mohammed Alami',
    role: 'Décorateur d\'intérieur — Casablanca',
    content: "La qualité des luminaires est irréprochable. Mes clients sont ravis de l'ambiance créée par les suspensions Tria Lampe. Un design premium enfin disponible au Maroc avec une livraison rapide.",
    isActive: true,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 2,
    initial: 'KB',
    name: 'Karim Bensaid',
    role: "Architecte — Rabat",
    content: "Un service client exceptionnel et des produits magnifiques. Les finitions des lampes de table sont parfaites pour mes projets résidentiels de luxe. Je recommande vivement.",
    isActive: true,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 3,
    initial: 'FZ',
    name: 'Fatine Zahra',
    role: 'Propriétaire — Marrakech',
    content: "J'ai trouvé la lampe parfaite pour mon salon. Les conseils de l'équipe m'ont aidé à choisir l'intensité idéale pour mon espace. C'est rare de trouver un tel choix et une telle expertise.",
    isActive: true,
    createdAt: '',
    updatedAt: ''
  }
];

export const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: 999,
    title: "Comment choisir l'intensité lumineuse pour son salon ?",
    slug: "choisir-intensite-lumineuse-salon",
    excerpt: "Découvrez nos conseils pour créer l'ambiance parfaite dans votre pièce de vie principale.",
    author: "Sarah Alami (Designer)",
    category: "CONSEIL DÉCO",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=1000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Published',
    content: "<h2>L'importance du Kelvin</h2><p>Pour un salon chaleureux, privilégiez une température de couleur entre 2700K et 3000K...</p>"
  },
  {
    id: 998,
    title: "Les tendances luminaires de 2024 : Le retour du laiton",
    slug: "tendances-luminaires-2024",
    excerpt: "Le laiton et les formes organiques dominent la scène du design cette année. Voici nos coups de cœur.",
    author: "Yassine Drissi (Expert)",
    category: "TENDANCES",
    imageUrl: "https://images.unsplash.com/photo-1553095066-5014bd030620?auto=format&fit=crop&q=80&w=1000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Published',
    content: "<h2>Le laiton brossé : élégance intemporelle</h2><p>Cette année, le laiton revient en force avec des finitions plus mates et brossées...</p>"
  },
  {
    id: 997,
    title: "3 astuces pour éclairer un petit espace sombre",
    slug: "astuces-eclairer-petit-espace",
    excerpt: "Ne laissez pas le manque de fenêtres gâcher votre déco. Apprenez à tricher avec la lumière.",
    author: "Mehdi Fassi (Architecte)",
    category: "SOLUTIONS",
    imageUrl: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=1000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Published',
    content: "<h2>Multiplier les points lumineux</h2><p>Au lieu d'un seul plafonnier fort, utilisez plusieurs sources de lumière douce...</p>"
  }
];
