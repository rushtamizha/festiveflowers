import GradientText from '@/components/reactbits/GradientText';
import RotatingText from '@/components/reactbits/RotatingText';
import { LeafIcon, HandIcon, PaletteIcon, TruckIcon } from '@/components/ui/Icons';

const promises = [
  { icon: LeafIcon, title: 'Fresh every morning', text: 'Flowers bought on the day' },
  { icon: HandIcon, title: 'Strung by hand', text: 'Made to order, never pre-made' },
  { icon: PaletteIcon, title: 'Customised for you', text: 'Flowers, colours and length' },
  { icon: TruckIcon, title: 'Delivered to your venue', text: 'On time for the ceremony' },
];

const occasions = ['the muhurtham', 'your reception', 'engagements', 'pooja & ceremonies'];

export default function Intro() {
  return (
    <section className="wrap pt-2 pb-2 lg:pt-4">
      <div className="max-w-3xl">
        <p className="eyebrow">Fresh · Handcrafted · Made to order</p>
        <h1 className="mt-2 text-[26px] leading-[1.12] sm:text-[36px] lg:text-[44px]">
          Handcrafted <GradientText>Wedding Garlands</GradientText> &amp; Bridal Flowers
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500 sm:text-base">
          Premium rose, jasmine, lotus and orchid garlands, bridal flowers, bouquets and floral jewellery, made fresh to
          order and delivered to your venue.
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-semibold text-ink">
          <span>Perfect for</span>
          <RotatingText
            texts={occasions}
            mainClassName="overflow-hidden rounded-full bg-brand-600 px-3.5 py-1 text-white"
            splitLevelClassName="overflow-hidden"
          />
        </p>
      </div>

      <ul className="card mt-6 grid grid-cols-2 lg:grid-cols-4">
        {promises.map(({ icon: Icon, title, text }, index) => (
          <li
            key={title}
            className={`flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:gap-3 sm:p-4 ${index % 2 ? 'border-l' : ''} ${index > 1 ? 'border-t lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''} border-ink-200`}
          >
            <span className="icon-badge size-10">
              <Icon size={20} />
            </span>
            <span className="min-w-0">
              <strong className="block text-[13px] leading-tight font-bold text-ink sm:text-sm">{title}</strong>
              <span className="mt-0.5 block text-xs leading-snug text-ink-500">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
