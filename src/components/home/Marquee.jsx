import ScrollVelocity from '@/components/reactbits/ScrollVelocity';

const rows = [
  // Only wedding garlands are live for now. When more categories return, use the full line:
  // 'Rose Petal Garlands • Jasmine Garlands • Lotus Garlands • Orchid Garlands • Bridal Flowers • Floral Jewellery • Car Decoration • Hand Bouquets •',
  'Rose Petal Garlands • Jasmine Garlands • Lotus Garlands • Orchid Garlands • Bride & Groom Pairs • Made Fresh to Order •',
];

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-brand-600 py-4 lg:py-5">
      <ScrollVelocity texts={rows} velocity={36} numCopies={4} className="text-[22px] leading-[1.45] font-bold tracking-[-0.03em] text-white sm:text-[34px]" />
    </div>
  );
}
