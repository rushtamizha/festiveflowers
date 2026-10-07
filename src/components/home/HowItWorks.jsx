import { orderSteps } from '@/data/content';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import CountUp from '@/components/reactbits/CountUp';

export default function HowItWorks({ summary }) {
  const stats = [
    { value: summary.productCount, label: 'handcrafted designs' },
    { value: summary.categoryCount, label: summary.categoryCount === 1 ? 'collection' : 'collections' },
    { value: summary.minPrice, prefix: '₹', label: 'starting price' },
  ];

  return (
    <section className="defer-render after-paint wrap py-8 lg:py-12">
      <SectionHeading title="How ordering works" description="Four steps from choosing a design to wearing it" />

      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {orderSteps.map((step, index) => (
          <Reveal as="li" key={step.title} delay={index * 0.06} className="card p-4 sm:p-5">
            <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-small ring-4 ring-brand-100" aria-hidden="true">
              {index + 1}
            </span>
            <h3 className="mt-3 text-base">{step.title}</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-500">{step.text}</p>
          </Reveal>
        ))}
      </ol>

      <dl className="mt-3 grid grid-cols-3 divide-x divide-ink-200 rounded-large bg-ink-50 py-5 text-center lg:mt-4 lg:py-7">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-1 px-2">
            <dt className="text-[11px] text-ink-500 sm:text-[13px]">{stat.label}</dt>
            <dd className="text-[28px] leading-none font-bold tracking-[-0.03em] text-ink sm:text-[40px]">
              {stat.prefix && <span className="rupee">{stat.prefix}</span>}
              <CountUp to={stat.value} duration={1.6} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
