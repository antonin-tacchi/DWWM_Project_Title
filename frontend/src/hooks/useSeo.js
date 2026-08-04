import { useEffect } from 'react';

const DEFAULT_SEO = {
  title: 'Clap! - Films, séries et communauté cinéphile',
  description: 'Clap! permet de découvrir, noter et commenter des films et séries, de gérer ses favoris et de suivre une communauté cinéphile.',
  image: '/og-image.png',
  robots: 'index, follow',
  type: 'website',
};

const upsertMeta = (attribute, value, content) => {
  if (!content) return;

  let tag = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
};

export default function useSeo(config = DEFAULT_SEO) {
  const enabled = config?.enabled !== false;
  const title = config?.title ?? DEFAULT_SEO.title;
  const description = config?.description ?? DEFAULT_SEO.description;
  const image = config?.image ?? DEFAULT_SEO.image;
  const robots = config?.robots ?? DEFAULT_SEO.robots;
  const type = config?.type ?? DEFAULT_SEO.type;

  useEffect(() => {
    if (!enabled) return;

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', image);
  }, [description, enabled, image, robots, title, type]);
}
