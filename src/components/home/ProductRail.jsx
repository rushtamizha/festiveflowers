import SectionHeading from '@/components/ui/SectionHeading';
import Carousel from '@/components/ui/Carousel';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/cn';

// A section title with "See All" and a swipeable row of product cards.
export default function ProductRail({ title, description, href, linkLabel = 'See All', products, className }) {
  return (
    <section className={cn('defer-render after-paint wrap py-8 lg:py-12', className)}>
      <SectionHeading title={title} description={description} action={href ? { label: linkLabel, href } : undefined} />
      <Carousel label={title} className="mt-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Carousel>
    </section>
  );
}
