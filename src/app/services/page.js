import { services, orderSteps } from '@/data/content';
import { site } from '@/config/site';
import { howToOrderSchema, serviceListSchema } from '@/lib/schema';
import PageHeader from '@/components/ui/PageHeader';
import JsonLd from '@/components/ui/JsonLd';
import Services from '@/components/home/Services';
import HowItWorks from '@/components/home/HowItWorks';
import { getCatalogueSummary } from '@/lib/api/catalog';
import CustomOrder from '@/components/home/CustomOrder';

const description =
  'Wedding garland making, bridal flower styling, wedding car decoration, ceremony and pooja flowers, bouquets and custom or bulk flower orders.';

export const metadata = {
  title: 'Our Flower Services',
  description,
  alternates: { canonical: '/services' },
  openGraph: { title: `${site.name} services`, description, url: '/services' },
};

export default async function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Services', href: '/services' }]}
        eyebrow="What we do"
        title="Our flower services"
        text={description}
      />
      <Services heading={false} />
      <HowItWorks summary={await getCatalogueSummary()} />
      <CustomOrder />
      <JsonLd data={[serviceListSchema(services), howToOrderSchema(orderSteps)]} />
    </>
  );
}
