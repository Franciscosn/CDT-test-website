import { defineCollection, z } from 'astro:content';

// Lab log entries: one Markdown file per entry in src/content/lablog/.
// Edited in the browser at /admin/ (Sveltia CMS, Decap-compatible config in public/admin/config.yml).
const lablog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    link: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { lablog };
