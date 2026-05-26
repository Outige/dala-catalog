import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const imagePath = z.string().refine(
  (value) => value.startsWith("/") || /^https?:\/\//.test(value),
  "Use a public path like /assets/products/item.jpg or a full https:// image URL."
);

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    brand: z.string().default("Dala"),
    summary: z.string(),
    description: z.string().optional(),
    image: imagePath,
    packSizes: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const catalogCollections = defineCollection({
  loader: glob({ base: "./src/content/collections", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: imagePath.optional(),
    products: z.array(z.string()).default([]),
  }),
});

export const collections = {
  products,
  collections: catalogCollections,
};
