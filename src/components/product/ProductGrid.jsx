import Reveal from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import ProductCard from './ProductCard';

// `eager`: how many leading cards load their image immediately (use for above-the-fold grids).
export default function ProductGrid({ products, className, eager = 0, heading = 'h3' }) {
  return (
    <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4', className)}>
      {products.map((product, index) => (
        <Reveal as="li" key={product.id} delay={(index % 4) * 0.06}>
          <ProductCard product={product} eager={index < eager} heading={heading} />
        </Reveal>
      ))}
    </ul>
  );
}
