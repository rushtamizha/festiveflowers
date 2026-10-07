// schema.org JSON-LD builders. These feed search engines, answer engines and AI assistants
// with unambiguous facts about the business, its products and its FAQs.

import { site, hasAddress, absoluteUrl } from '@/config/site';

const isPlaceholder = (value) => !value || /0{5}|example\.com/.test(value);

export function organizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    image: absoluteUrl('/og.jpg'),
    logo: absoluteUrl('/icon-512.png'),
    priceRange: '₹₹',
    currenciesAccepted: site.currency,
    areaServed: site.areaServed,
    knowsAbout: site.seo.keywords,
  };

  if (!isPlaceholder(site.phone)) data.telephone = site.phone;
  if (!isPlaceholder(site.email)) data.email = site.email;
  if (hasAddress) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    };
  }
  const sameAs = Object.values(site.social).filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;

  return data;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.locale,
    publisher: { '@id': `${site.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/shop?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

export function productSchema(product) {
  const url = absoluteUrl(`/product/${product.slug}`);
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.description.join(' '),
    sku: product.sku,
    category: product.categoryName,
    material: product.flowers.join(', '),
    image: product.images.map((src) => absoluteUrl(src)),
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      url,
      price: product.price,
      priceCurrency: site.currency,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${site.url}/#organization` },
    },
  };

  if (site.seo.includeRatingSchema && product.reviews > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews,
      bestRating: 5,
    };
  }

  return data;
}

export function collectionSchema({ name, description, path, products }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: { '@id': `${site.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: p.name,
        url: absoluteUrl(`/product/${p.slug}`),
      })),
    },
  };
}

export function serviceListSchema(services) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.name} services`,
    itemListElement: services.map((s, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.text,
        provider: { '@id': `${site.url}/#organization` },
        areaServed: site.areaServed,
      },
    })),
  };
}

export function howToOrderSchema(steps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to order from ${site.name}`,
    step: steps.map((s, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: s.title,
      text: s.text,
    })),
  };
}
