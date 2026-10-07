import { PlusIcon } from './Icons';
import Rupees from './Rupees';

// Native <details> accordion: accessible, crawlable and needs no JavaScript.
// `heading`: level of each question (h2 when the list follows the page's h1 directly).
export default function FaqList({ faqs, className = '', heading: Heading = 'h3' }) {
  return (
    <div className={`card divide-y divide-ink-200 px-4 sm:px-6 ${className}`}>
      {faqs.map((faq) => (
        <details key={faq.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left">
            <Heading className="text-sm leading-snug tracking-[-0.01em] sm:text-base">{faq.q}</Heading>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink-50 text-ink ring-1 ring-ink-200 transition-transform duration-500 ease-fluid group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
              <PlusIcon size={16} />
            </span>
          </summary>
          <p className="pr-10 pb-4 text-sm leading-relaxed text-ink-500">
            <Rupees>{faq.a}</Rupees>
          </p>
        </details>
      ))}
    </div>
  );
}
