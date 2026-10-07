// Renders one or more schema.org objects as JSON-LD.
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return items.map((item, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
    />
  ));
}
