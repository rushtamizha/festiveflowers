import Image from 'next/image';
import { img } from '@/config/site';
import { cn } from '@/lib/cn';

// The square brand mark (public/logo.png). The artwork carries its own background colour, so the
// tile only clips it to the kit's rounded square. Decorative: the link around it carries the name.
export default function LogoMark({ size = 36, eager = false, className }) {
  return (
    <span
      className={cn('relative block shrink-0 overflow-hidden rounded-medium ring-1', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={img('/logo.png')}
        alt=""
        width={size}
        height={size}
        loading={eager ? 'eager' : 'lazy'}
        className="size-full scale-[1.3] object-cover"
      />
    </span>
  );
}
