import Link from 'next/link';
import BlurText from '@/components/reactbits/BlurText';
import { cn } from '@/lib/cn';

/** Kit pattern: bold section title on the left, brand-coloured "See All" on the right. */
export default function SectionHeading({ eyebrow, title, description, action, align = 'left', light = false, as = 'h2', className }) {
  const centered = align === 'center';
  return (
    <div className={cn('flex items-start justify-between gap-4 sm:gap-8', centered && 'flex-col items-center text-center', className)}>
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && <p className={cn('eyebrow mb-2', light && 'text-white/80')}>{eyebrow}</p>}
        <BlurText
          as={as}
          text={title}
          delay={45}
          className={cn('text-[20px] leading-tight sm:text-[24px] lg:text-[28px]', centered && 'justify-center', light ? 'text-white' : 'text-ink')}
        />
        {description && <p className={cn('mt-1 text-[13px] sm:text-sm', light ? 'text-white/80' : 'text-ink-500')}>{description}</p>}
      </div>

      {action && (
        <Link
          href={action.href}
          className={cn(
            'press shrink-0 pt-1 text-[13px] font-semibold whitespace-nowrap',
            light ? 'text-white hover:text-white/80' : 'text-brand-700 hover:text-ink',
          )}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
