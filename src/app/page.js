import { getCatalogueSummary, getCategories, getCategory, getPriceRanges, getProducts } from '@/lib/api/catalog';
import { faqs, orderSteps, services } from '@/data/content';
import { faqSchema, howToOrderSchema, serviceListSchema } from '@/lib/schema';
import JsonLd from '@/components/ui/JsonLd';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import ProductRail from '@/components/home/ProductRail';
import Services from '@/components/home/Services';
import Marquee from '@/components/home/Marquee';
import WeddingGarlands from '@/components/home/WeddingGarlands';
import CustomOrder from '@/components/home/CustomOrder';
import ShopByPrice from '@/components/home/ShopByPrice';
import PremiumSection from '@/components/home/PremiumSection';
import HowItWorks from '@/components/home/HowItWorks';
import Faq from '@/components/home/Faq';

const categoryTile = (category) => ({
  href: `/category/${category.slug}`,
  name: category.name,
  image: category.image,
  count: category.productCount,
});

// While only one category is live, its styles (subcategories) take the category row's place,
// each shown with the photo of its first design.
async function styleTiles(category) {
  const tiles = await Promise.all(
    category.subcategories.map(async (sub) => {
      const designs = await getProducts({ category: category.slug, subcategory: sub.slug });
      return designs.length
        ? { href: `/category/${category.slug}/${sub.slug}`, name: sub.name, image: designs[0].image, count: designs.length }
        : null;
    }),
  );
  return tiles.filter(Boolean);
}

export default async function HomePage() {
  const [categories, bestSellers, weddingCategory, weddingGarlands, premium, priceRanges, summary] = await Promise.all([
    getCategories(),
    getProducts({ tag: 'bestseller', limit: 8 }),
    getCategory('wedding-garland'),
    getProducts({ category: 'wedding-garland', limit: 8 }),
    getProducts({ tag: 'premium', limit: 8 }),
    getPriceRanges(),
    getCatalogueSummary(),
  ]);

  return (
    <>
      <Hero />
      <Intro />
      {categories.length > 1 ? (
        <CategoryCarousel title="Shop by category" tiles={categories.map(categoryTile)} />
      ) : (
        <CategoryCarousel title="Shop by style" tiles={await styleTiles(categories[0])} />
      )}
      <ProductRail title="Best sellers" description="The designs our customers order most" href="/best-sellers" products={bestSellers} />
      <Services />
      <Marquee />
      <WeddingGarlands category={weddingCategory} products={weddingGarlands} />
      <CustomOrder />
      <ShopByPrice ranges={priceRanges} />
      <PremiumSection products={premium} />
      <HowItWorks summary={summary} />
      <Faq />
      <JsonLd data={[faqSchema(faqs.slice(0, 6)), serviceListSchema(services), howToOrderSchema(orderSteps)]} />
    </>
  );
}
