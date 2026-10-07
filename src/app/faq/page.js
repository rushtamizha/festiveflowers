import { faqs } from '@/data/content';
import { faqSchema } from '@/lib/schema';
import PageHeader from '@/components/ui/PageHeader';
import JsonLd from '@/components/ui/JsonLd';
import FaqList from '@/components/ui/FaqList';
import CustomOrder from '@/components/home/CustomOrder';

const description = 'Answers to common questions about ordering wedding garlands: lead time, freshness, customisation, pricing and delivery.';

export const metadata = {
  title: 'Wedding Garland FAQs',
  description,
  alternates: { canonical: '/faq' },
  openGraph: { title: 'Wedding Garland FAQs', description, url: '/faq' },
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'FAQs', href: '/faq' }]}
        eyebrow="Good to know"
        title="Frequently asked questions"
        text={description}
      />
      <section className="wrap py-10 sm:py-14">
        <FaqList faqs={faqs} heading="h2" className="mx-auto max-w-3xl" />
      </section>
      <CustomOrder />
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
