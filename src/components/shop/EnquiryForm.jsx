'use client';

import { site, hasWhatsapp, whatsappLink } from '@/config/site';
import { WhatsAppIcon, MailIcon } from '@/components/ui/Icons';

// No backend: the enquiry is handed to WhatsApp (or the visitor's email app) to send.
export default function EnquiryForm() {
  const compose = (form) => {
    const d = Object.fromEntries(new FormData(form));
    return [
      `Hello ${site.name},`,
      d.message,
      '',
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      d.eventDate ? `Function date: ${d.eventDate}` : null,
    ]
      .filter((line) => line !== null)
      .join('\n');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const text = compose(e.currentTarget);
    const via = e.nativeEvent.submitter?.value;
    const url =
      via === 'email'
        ? `mailto:${site.email}?subject=${encodeURIComponent('Flower enquiry')}&body=${encodeURIComponent(text)}`
        : whatsappLink(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-9">
      <h2 className="text-xl font-bold text-ink sm:text-2xl">Send an enquiry</h2>
      <p className="mt-1 text-sm text-ink-500">Tell us about your function and we will reply with options and prices.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-sm font-medium text-ink">Your name</span>
          <input name="name" className="field" autoComplete="name" required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium text-ink">Phone number</span>
          <input name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" required />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">Function date (optional)</span>
          <input name="eventDate" type="date" className="field" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium text-ink">What do you need?</span>
          <textarea name="message" rows={4} className="field" required placeholder="e.g. Two rose petal wedding garlands and a poo jadai" />
        </label>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        {hasWhatsapp && (
          <button type="submit" name="via" value="whatsapp" className="btn btn-primary">
            <WhatsAppIcon size={18} />
            Send on WhatsApp
          </button>
        )}
        {site.email && (
          <button type="submit" name="via" value="email" className={`btn ${hasWhatsapp ? 'btn-outline' : 'btn-primary'}`}>
            <MailIcon size={18} />
            Send by email
          </button>
        )}
      </div>
    </form>
  );
}
