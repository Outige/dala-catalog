# Dala Astro Catalog Tutorial

This tutorial reproduces the current working state of this repository.

The goal is a basic static catalog site built with Astro:

- Product content in Markdown.
- Collection content in Markdown.
- Product listing and product detail pages.
- Collection listing and collection detail pages.
- A small diagnostic checkpoint page.
- Static images in `public/assets`.
- GitHub Pages deployment with GitHub Actions.

This does not include CMS or smart search yet. The project is deliberately shaped so those can be added later.

---

## 1. Project Shape

The repository root is:

```text
dala-catalog/
```

The Astro app lives inside:

```text
dala-catalog/dala-catalog-astro/
```

The GitHub Actions workflow lives at the repository root:

```text
dala-catalog/.github/workflows/deploy.yml
```

Current important structure:

```text
dala-catalog/
  .github/
    workflows/
      deploy.yml
  dala-catalog-astro/
    astro.config.mjs
    package.json
    public/
      styles.css
      assets/
        products/
          acrylic-paint.jpg
          air-drying-clay.jpg
        collections/
          paint.jpg
          clay-and-modelling.jpg
    src/
      content.config.ts
      components/
        CollectionCard.astro
        ProductCard.astro
      layouts/
        BaseLayout.astro
      content/
        products/
          acrylic-paint.md
          air-drying-clay.md
        collections/
          paint.md
          clay-and-modelling.md
      pages/
        index.astro
        catalog-checkpoint.astro
        products/
          index.astro
          [slug].astro
        collections/
          index.astro
          [slug].astro
```

Note: `src/content.config.ts` is the Astro 6 content config file. Do not use `src/content/config.ts` for this project.

---

## 2. Core Commands

Run commands from the Astro app folder:

```bash
cd dala-catalog-astro
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Because this project has `base: "/dala-catalog"` configured for GitHub Pages, the local homepage is:

```text
http://localhost:4321/dala-catalog/
```

Useful local routes:

```text
http://localhost:4321/dala-catalog/
http://localhost:4321/dala-catalog/catalog-checkpoint/
http://localhost:4321/dala-catalog/products/
http://localhost:4321/dala-catalog/products/acrylic-paint/
http://localhost:4321/dala-catalog/collections/
http://localhost:4321/dala-catalog/collections/paint/
```

Build the static site:

```bash
npm run build
```

The generated static site is written to:

```text
dala-catalog-astro/dist/
```

Preview the built static site:

```bash
npm run preview
```

The project requires Node `>=22.12.0`, as defined in `package.json`.

---

## 3. Astro Config

File:

```text
dala-catalog-astro/astro.config.mjs
```

Current content:

```js
// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://outige.github.io",
  base: "/dala-catalog",
});
```

Why this matters:

- `site` tells Astro the production domain.
- `base` tells Astro the site is served from a GitHub Pages project path.

With this config, the deployed site is expected at:

```text
https://outige.github.io/dala-catalog/
```

If the GitHub repository name changes, update `base`.

For example, if the repository is `artist-materials`, use:

```js
base: "/artist-materials",
```

---

## 4. Content Collections

File:

```text
dala-catalog-astro/src/content.config.ts
```

Current content:

```ts
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
```

The project has two content collections:

- `products`
- `collections`

Product IDs come from filenames. For example:

```text
src/content/products/acrylic-paint.md
```

has this product ID:

```text
acrylic-paint
```

Collections reference products by those IDs.

---

## 5. Product Content

Product files live in:

```text
dala-catalog-astro/src/content/products/
```

Example:

```text
src/content/products/acrylic-paint.md
```

```md
---
title: Acrylic Paint
brand: Dala
summary: A dependable everyday acrylic paint range for artists, students, and crafters.
description: Dala Acrylic Paint is a flexible staple for painting, school projects, craft surfaces, and mixed media work.
image: /assets/products/acrylic-paint.jpg
packSizes:
  - 75 ml
  - 250 ml
  - 500 ml
tags:
  - Artist
  - Craft
  - Water-based
---
```

Example:

```text
src/content/products/air-drying-clay.md
```

```md
---
title: Air-Drying Clay
brand: Dala
summary: A simple modelling clay that dries without kiln firing.
description: A practical sculpting material for classrooms, workshops, home craft, and decorative objects.
image: /assets/products/air-drying-clay.jpg
packSizes:
  - 500 g
  - 1 kg
tags:
  - Modelling
  - School
  - No kiln
---
```

Product images live in:

```text
public/assets/products/
```

Current product images:

```text
public/assets/products/acrylic-paint.jpg
public/assets/products/air-drying-clay.jpg
```

---

## 6. Collection Content

Collection files live in:

```text
dala-catalog-astro/src/content/collections/
```

Example:

```text
src/content/collections/paint.md
```

```md
---
title: Paint
summary: Core colour ranges for artists, schools, hobbyists, and craft retailers.
image: /assets/collections/paint.jpg
products:
  - acrylic-paint
---
```

Example:

```text
src/content/collections/clay-and-modelling.md
```

```md
---
title: Clay And Modelling
summary: Hands-on modelling, sculpting, and air-drying materials.
image: /assets/collections/clay-and-modelling.jpg
products:
  - air-drying-clay
---
```

Collection images live in:

```text
public/assets/collections/
```

Current collection images:

```text
public/assets/collections/paint.jpg
public/assets/collections/clay-and-modelling.jpg
```

The `products` list controls which products appear in the collection and in what order.

---

## 7. Base URL Helper

Because this site deploys to GitHub Pages at `/dala-catalog/`, links and image paths must include Astro's base URL.

This helper pattern appears in the layout, cards, and detail pages:

```astro
---
const base = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const path = (value) => `${base}${value.replace(/^\//, "")}`;
---
```

Use it like this:

```astro
<a href={path("products/")}>Products</a>
<img src={path(product.data.image)} alt={product.data.title} />
<link rel="stylesheet" href={path("styles.css")} />
```

This avoids broken URLs like:

```text
/products/
/assets/products/acrylic-paint.jpg
/styles.css
```

Those root-relative paths work locally on a root site, but break on GitHub Pages project sites.

---

## 8. Base Layout

File:

```text
src/layouts/BaseLayout.astro
```

Purpose:

- Provides shared HTML structure.
- Loads `styles.css`.
- Renders the main navigation.
- Makes navigation links GitHub Pages base-aware.

Routes use it like this:

```astro
<BaseLayout title="Products" description="Browse Dala catalog products.">
  <section class="section">
    <h1>Products</h1>
  </section>
</BaseLayout>
```

---

## 9. Reusable Cards

Product cards live in:

```text
src/components/ProductCard.astro
```

They link to:

```text
/dala-catalog/products/product-id/
```

Collection cards live in:

```text
src/components/CollectionCard.astro
```

They link to:

```text
/dala-catalog/collections/collection-id/
```

Both card components use `entry.id`, not `entry.slug`.

That matters for Astro 6 content collections.

---

## 10. Pages And Routes

Homepage:

```text
src/pages/index.astro
```

Route:

```text
/dala-catalog/
```

Product listing:

```text
src/pages/products/index.astro
```

Route:

```text
/dala-catalog/products/
```

Product detail:

```text
src/pages/products/[slug].astro
```

Example route:

```text
/dala-catalog/products/acrylic-paint/
```

Collection listing:

```text
src/pages/collections/index.astro
```

Route:

```text
/dala-catalog/collections/
```

Collection detail:

```text
src/pages/collections/[slug].astro
```

Example route:

```text
/dala-catalog/collections/paint/
```

Diagnostic checkpoint:

```text
src/pages/catalog-checkpoint.astro
```

Route:

```text
/dala-catalog/catalog-checkpoint/
```

The checkpoint page reads the products and collections directly from content collections and prints their titles. It is useful for confirming the content layer works. It can be kept or removed later.

---

## 11. Styles

Styles live in:

```text
public/styles.css
```

Because `public/` files are served from the site root at build time, the layout loads this file using the base-aware helper:

```astro
<link rel="stylesheet" href={path("styles.css")} />
```

On GitHub Pages, this becomes:

```text
/dala-catalog/styles.css
```

---

## 12. Add A New Product

1. Add an image:

```text
public/assets/products/fabric-paint.jpg
```

2. Add a product file:

```text
src/content/products/fabric-paint.md
```

```md
---
title: Fabric Paint
brand: Dala
summary: Colour for textile craft, apparel decoration, and mixed-media surfaces.
description: Fabric Paint supports textile craft, apparel decoration, and mixed-media surfaces.
image: /assets/products/fabric-paint.jpg
packSizes:
  - 50 ml
  - 250 ml
tags:
  - Textile
  - Craft
---
```

3. Add the product ID to a collection:

```md
products:
  - acrylic-paint
  - fabric-paint
```

The product ID is the filename without `.md`.

---

## 13. Add A New Collection

1. Add an image:

```text
public/assets/collections/craft-and-fabric.jpg
```

2. Add a collection file:

```text
src/content/collections/craft-and-fabric.md
```

```md
---
title: Craft And Fabric
summary: Creative finishes for textiles, mixed media, and decorative craft.
image: /assets/collections/craft-and-fabric.jpg
products:
  - fabric-paint
---
```

The new collection page will be generated automatically at:

```text
/dala-catalog/collections/craft-and-fabric/
```

---

## 14. Build And Preview

From the Astro app folder:

```bash
cd dala-catalog-astro
```

Development server:

```bash
npm run dev
```

Build static files:

```bash
npm run build
```

Preview the built site:

```bash
npm run preview
```

The build output goes to:

```text
dala-catalog-astro/dist/
```

The GitHub Action builds this same output and deploys it to GitHub Pages.

---

## 15. GitHub Pages Deployment

The deployment workflow is:

```text
.github/workflows/deploy.yml
```

Current content:

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v6

      - name: Install, build, and upload your site
        uses: withastro/action@v6
        with:
          path: ./dala-catalog-astro
          node-version: 22

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

Important details:

- The workflow runs on pushes to `master`.
- The Astro app is in `./dala-catalog-astro`, so the workflow sets `path: ./dala-catalog-astro`.
- GitHub Actions uses Node 22.
- The Astro config uses `base: "/dala-catalog"`.

On GitHub, the extra UI step is:

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Go to `Pages`.
4. Under `Build and deployment`, set `Source` to `GitHub Actions`.

After that, pushing to `master` should trigger the deploy.

Expected deployed URL:

```text
https://outige.github.io/dala-catalog/
```

Useful deployed routes:

```text
https://outige.github.io/dala-catalog/
https://outige.github.io/dala-catalog/products/
https://outige.github.io/dala-catalog/products/acrylic-paint/
https://outige.github.io/dala-catalog/collections/
https://outige.github.io/dala-catalog/collections/paint/
```

Official Astro guide:

```text
https://docs.astro.build/en/guides/deploy/github/
```

---

## 16. Push To GitHub

From the repository root:

```bash
git status
git add .github dala-catalog-astro ASTRO_BASIC_CATALOG_TUTORIAL.md
git commit -m "Set up Astro catalog and GitHub Pages deploy"
git push origin master
```

After pushing:

1. Open the GitHub repository.
2. Go to `Actions`.
3. Open the latest `Deploy to GitHub Pages` run.
4. Wait for it to complete.
5. Open the Pages URL.

---

## 17. Troubleshooting

If GitHub Pages shows unstyled HTML:

- Check that `astro.config.mjs` has `base: "/dala-catalog"`.
- Check that the layout loads CSS through `path("styles.css")`.

If images are broken:

- Check that image files exist in `public/assets/...`.
- Check that image paths in Markdown start with `/assets/...`.
- Check that components render images through `path(product.data.image)` or `path(collection.data.image)`.

If GitHub Actions does not run:

- Check that the workflow is at `.github/workflows/deploy.yml`.
- Check that the workflow branch matches the branch you push to. This project currently uses `master`.
- Check GitHub repository `Settings -> Pages -> Build and deployment -> Source`.

If Astro says Node is unsupported:

- Use Node `>=22.12.0`.
- GitHub Actions is already configured with `node-version: 22`.

If a collection page shows no products:

- Check the product ID in the collection file.
- The ID must match the product filename without `.md`.

Example:

```text
src/content/products/acrylic-paint.md
```

must be referenced as:

```md
products:
  - acrylic-paint
```

---

## 18. Future Features

CMS:

- A CMS can write Markdown files into `src/content/products` and `src/content/collections`.
- Collection product references already use IDs that can map to CMS relation fields.

Search:

- A future search index can be generated from `getCollection("products")`.
- Product fields are already structured enough for title, summary, description, brand, tags, and pack-size search.

Brands:

- Products already have a `brand` field.
- Later, brands can become their own content collection if Dala and Teddy need separate landing pages.

Filtering:

- Tags are already arrays.
- Later, filters can use tags, brands, pack sizes, or collections.
