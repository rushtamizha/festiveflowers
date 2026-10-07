import { site } from '@/config/site';

const privatePaths = ['/cart', '/checkout', '/account', '/wishlist', '/api/'];

// AI assistants and answer engines are explicitly welcome, so the catalogue can be cited in their answers.
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
];

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: privatePaths },
      { userAgent: aiCrawlers, allow: '/', disallow: privatePaths },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
