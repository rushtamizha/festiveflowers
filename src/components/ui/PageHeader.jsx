import Breadcrumbs from './Breadcrumbs';
import Rupees from './Rupees';

// Every inner page opens on the dark dotted surface, so the site never reads as plain white.
export default function PageHeader({ breadcrumbs, eyebrow, title, text, children }) {
  return (
    <section className="surface-dark">
      <div className="wrap py-8 lg:py-12">
        <Breadcrumbs items={breadcrumbs} light className="mb-4" />
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow mb-2 text-brand-300">{eyebrow}</p>}
          <h1 className="text-[26px] leading-tight text-white sm:text-[32px] lg:text-[38px]">
            <Rupees>{title}</Rupees>
          </h1>
          {text && (
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">
              <Rupees>{text}</Rupees>
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
