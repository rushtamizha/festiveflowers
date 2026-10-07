import { faqs } from '@/data/content';
import SectionHeading from '@/components/ui/SectionHeading';
import FaqList from '@/components/ui/FaqList';

export default function Faq() {
  return (
    <section className="defer-render after-paint wrap py-8 lg:py-12">
      <SectionHeading title="Questions, answered" description="What couples ask us most" action={{ label: 'See All', href: '/faq' }} />
      <FaqList faqs={faqs.slice(0, 6)} className="mt-5" />
    </section>
  );
}
