import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const galleryCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      category: z.string(),
      items: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          image: image(), // Validates AVIF paths relative to JSON file location
          alt: z.string(),
        })
      ),
    }),
});

export const collections = {
  gallery: galleryCollection,
};