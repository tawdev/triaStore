import { Metadata } from 'next';
import { api } from '@/app/lib/api';
import HomeClient from '@/app/HomeClient';

export const metadata: Metadata = {
  title: 'Tria Lampe – Luminaires & Design d\'Exception au Maroc',
  description: 'Découvrez Tria Lampe, la maison de luminaires haut de gamme au Maroc. Lustres en cristal, suspensions design et éclairages d\'exception pour vos espaces de prestige. Livraison dans tout le Maroc.',
  openGraph: {
    title: 'Tria Lampe – L\'Art de la Lumière',
    description: 'Lustres en cristal, suspensions design et luminaires d\'exception. Chaque pièce Tria Lampe est une œuvre d\'art pour magnifier vos espaces.',
    images: ['/tria-crystal/hero.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tria Lampe – Luminaires & Design d\'Exception',
    description: 'Lustres en cristal, suspensions design et luminaires d\'exception pour vos espaces de prestige.',
    images: ['/tria-crystal/hero.png'],
  },
};

export default async function HomePage() {
  // Fetch all initial data on the server
  try {
    const [categoriesRes, popularProductsRes, newProductsRes, brandsRes, blogsRes, faqsRes, testimonialsRes] = await Promise.all([
      api.getCategories(true),
      api.getProducts({ page: 1, limit: 6, active: true, sort: 'popularity' }),
      api.getProducts({ page: 1, limit: 6, active: true, sort: 'createdAt' }),
      api.getBrands(),
      api.getPosts(1, 3),
      api.getFaqs(),
      api.getActiveTestimonials()
    ]);

    const categories = categoriesRes.filter(c => 
      c.isActive && 
      c.parentId === null && 
      ((c.products && c.products.length > 0) || (c.children && c.children.some(child => child.products && child.products.length > 0)))
    );
    const brands = brandsRes.filter(b => b.isActive);

    return (
      <HomeClient 
        initialCategories={categories}
        initialPopularProducts={popularProductsRes.data}
        initialNewProducts={newProductsRes.data}
        initialBrands={brands}
        initialBlogs={blogsRes.data}
        initialFaqs={faqsRes}
        initialTestimonials={testimonialsRes}
      />
    );
  } catch (error) {
    console.error('Error loading homepage data:', error);
    // Fallback to empty states if API fails
    return (
      <HomeClient 
        initialCategories={[]}
        initialPopularProducts={[]}
        initialNewProducts={[]}
        initialBrands={[]}
        initialBlogs={[]}
        initialFaqs={[]}
        initialTestimonials={[]}
      />
    );
  }
}
