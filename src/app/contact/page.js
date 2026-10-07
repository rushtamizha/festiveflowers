import { site, hasAddress, hasWhatsapp, whatsappLink } from '@/config/site';
import PageHeader from '@/components/ui/PageHeader';
import EnquiryForm from '@/components/shop/EnquiryForm';
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/ui/Icons';

const description = `Contact ${site.name} for wedding garland orders, custom designs and bulk flower enquiries.`;

export const metadata = {
  title: 'Contact Us',
  description,
  alternates: { canonical: '/contact' },
  openGraph: { title: `Contact ${site.name}`, description, url: '/contact' },
};

export default function ContactPage() {
  const details = [
    site.phone && { icon: PhoneIcon, label: 'Call us', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    hasWhatsapp && { icon: WhatsAppIcon, label: 'WhatsApp', value: 'Chat with us', href: whatsappLink() },
    site.email && { icon: MailIcon, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    hasAddress && {
      icon: PinIcon,
      label: 'Visit us',
      value: `${site.address.street}, ${site.address.city} ${site.address.postalCode}`,
    },
    site.hours && { icon: ClockIcon, label: 'Hours', value: site.hours },
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: 'Contact', href: '/contact' }]}
        eyebrow="We would love to hear from you"
        title="Contact us"
        text="Planning a wedding or a family function? Tell us the date and what you have in mind."
      />
      <section className="wrap grid gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
        <ul className="space-y-4">
          {details.map(({ icon: Icon, label, value, href }) => (
            <li key={label} className="card flex items-center gap-4 p-5">
              <span className="icon-badge size-12">
                <Icon size={22} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-ink-500">{label}</span>
                {href ? (
                  <a href={href} className="font-medium break-words text-ink hover:text-brand-700">
                    {value}
                  </a>
                ) : (
                  <span className="font-medium text-ink">{value}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <EnquiryForm />
      </section>
    </>
  );
}
