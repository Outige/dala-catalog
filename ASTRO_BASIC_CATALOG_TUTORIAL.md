# Building A Basic Static Catalog Website With Astro

This tutorial builds the first useful version of a static product catalog:

- Product listing pages.
- Individual product pages.
- Collection listing pages.
- Individual collection pages.
- Content stored as Markdown files.
- Images served from the public assets folder.
- A clean structure that can later support a CMS, search, filters, brands, and richer landing pages.

This version intentionally does not include CMS setup or smart search. Those can be added later without changing the basic content model.

Recommended stack:

- Astro for the static site.
- Astro Content Collections for typed product and collection content.
- Markdown frontmatter as the catalog database.
- Public assets for local images.

Useful official docs:

- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro pages and routing: https://docs.astro.build/en/basics/astro-pages/
- Astro dynamic routes: https://docs.astro.build/en/guides/routing/

---

## 1. Create The Astro Project

From the folder where you keep your development projects, run:

```bash
npm create astro@latest dala-catalog-astro
cd dala-catalog-astro
npm install
```

Choose the minimal starter when Astro asks.

Start the local dev server:

```bash
npm run dev
```

Astro will print a local preview URL, usually:

```text
http://localhost:4321/
```

---

## 2. Create The Folder Structure

Create these folders:

```text
src/
  components/
  content.config.ts
  content/
    products/
    collections/
  layouts/
  pages/
    products/
    collections/
public/
  assets/
    products/
    collections/
```

Use `src/content` for structured catalog data.

Use `public/assets` for images that should be available directly in the built static site.

For example:

```text
public/assets/products/acrylic-paint.jpg
public/assets/collections/paint.jpg
```

Those files will be available at:

```text
/assets/products/acrylic-paint.jpg
/assets/collections/paint.jpg
```

Keep `src/pages/`. That folder is Astro's routing folder. Files inside it become website pages.

Keep `src/content/`. That folder stores catalog content. Files inside it do not automatically become pages; your page routes will read from this content later.

---

## 3. Define The Content Schemas

Create:

```text
src/content.config.ts
```

Add:

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

This gives you a basic typed catalog.

The `products` field inside a collection stores product IDs. For Markdown files loaded from `src/content/products`, the ID is the filename without `.md`. That is the important future-friendly choice. It means collections are manually curated instead of being guessed from tags.

Later, a CMS can write these same Markdown files. Later, search can index these same fields.

Checkpoint:

Run the dev server:

```bash
npm run dev
```

At this point the visible website may still look like the Astro starter. That is expected. You have created the catalog data model, but you have not created pages that display catalog data yet.

If Astro reports an error about a legacy content config file, check that the file is exactly here:

```text
src/content.config.ts
```

and not here:

```text
src/content/config.ts
```

---

## 4. Add Example Products

Create:

```text
src/content/products/acrylic-paint.md
```

Add:

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

Create:

```text
src/content/products/air-drying-clay.md
```

Add:

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

Copy matching image files into:

```text
public/assets/products/
```

If you do not have final product photography yet, use temporary placeholder images with the final filenames. The content paths can stay stable while the images improve.

---

## 5. Add Example Collections

Create:

```text
src/content/collections/paint.md
```

Add:

```md
---
title: Paint
summary: Core colour ranges for artists, schools, hobbyists, and craft retailers.
image: /assets/collections/paint.jpg
products:
  - acrylic-paint
---
```

Create:

```text
src/content/collections/clay-and-modelling.md
```

Add:

```md
---
title: Clay And Modelling
summary: Hands-on modelling, sculpting, and air-drying materials.
image: /assets/collections/clay-and-modelling.jpg
products:
  - air-drying-clay
---
```

The values under `products` are product IDs.

For example:

```text
src/content/products/acrylic-paint.md
```

has this ID:

```text
acrylic-paint
```

Checkpoint:

Create this temporary page:

```text
src/pages/catalog-checkpoint.astro
```

Add:

```astro
---
import { getCollection } from "astro:content";

const products = await getCollection("products");
const collections = await getCollection("collections");
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Catalog Checkpoint</title>
  </head>
  <body>
    <h1>Catalog Checkpoint</h1>

    <h2>Products</h2>
    <ul>
      {products.map((product) => <li>{product.data.title}</li>)}
    </ul>

    <h2>Collections</h2>
    <ul>
      {collections.map((collection) => <li>{collection.data.title}</li>)}
    </ul>
  </body>
</html>
```

Start or restart the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:4321/catalog-checkpoint/
```

You should see:

- Acrylic Paint
- Air-Drying Clay
- Paint
- Clay And Modelling

This page is only a checkpoint. You can delete `src/pages/catalog-checkpoint.astro` after the real catalog pages are working.

---

## 6. Create A Base Layout

Create:

```text
src/layouts/BaseLayout.astro
```

Add:

```astro
---
const {
  title = "Dala Catalog",
  description = "Dala artist materials catalog.",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a class="site-logo" href="/">Dala Catalog</a>
      <nav aria-label="Main navigation">
        <a href="/products/">Products</a>
        <a href="/collections/">Collections</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </body>
</html>
```

Using a layout now keeps later pages simple. If you add CMS pages, search, brand pages, or navigation changes later, this layout is where most shared structure will live.

---

## 7. Create Reusable Catalog Components

Create:

```text
src/components/ProductCard.astro
```

Add:

```astro
---
const { product } = Astro.props;
---

<article class="product-card">
  <a href={`/products/${product.id}/`}>
    <img src={product.data.image} alt={product.data.title} />
    <span>{product.data.brand}</span>
    <h2>{product.data.title}</h2>
    <p>{product.data.summary}</p>
  </a>
</article>
```

Create:

```text
src/components/CollectionCard.astro
```

Add:

```astro
---
const { collection } = Astro.props;
---

<article class="collection-card">
  <a href={`/collections/${collection.id}/`}>
    {collection.data.image && <img src={collection.data.image} alt="" />}
    <h2>{collection.data.title}</h2>
    <p>{collection.data.summary}</p>
  </a>
</article>
```

These components are intentionally small. That makes them easy to reuse later in search results, CMS-managed page blocks, featured product sections, or brand pages.

---

## 8. Create The Home Page

Replace:

```text
src/pages/index.astro
```

with:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import ProductCard from "../components/ProductCard.astro";
import CollectionCard from "../components/CollectionCard.astro";

const products = await getCollection("products");
const collections = await getCollection("collections");
const featuredProducts = products.slice(0, 4);
---

<BaseLayout
  title="Dala Catalog"
  description="Dala artist materials catalog."
>
  <section class="hero">
    <div>
      <p class="eyebrow">Dala Artist Materials</p>
      <h1>Colour, texture, and tools for working artists.</h1>
      <p>
        A static catalog for products, collections, and future trade-friendly
        product information.
      </p>
      <a class="button" href="/products/">View Products</a>
    </div>
    <img src="/assets/collections/paint.jpg" alt="" />
  </section>

  <section class="section">
    <div class="section-heading">
      <h2>Collections</h2>
      <a href="/collections/">View all</a>
    </div>
    <div class="collection-grid">
      {collections.map((collection) => <CollectionCard collection={collection} />)}
    </div>
  </section>

  <section class="section">
    <div class="section-heading">
      <h2>Featured Products</h2>
      <a href="/products/">View all</a>
    </div>
    <div class="product-grid">
      {featuredProducts.map((product) => <ProductCard product={product} />)}
    </div>
  </section>
</BaseLayout>
```

The homepage is hard-coded for now. That is deliberate. Get the catalog working first. Turn the homepage into CMS-managed blocks later if you need that editing power.

Checkpoint:

With the dev server running, open:

```text
http://localhost:4321/
```

You should now see a Dala Catalog homepage with a hero, collection cards, and featured product cards.

---

## 9. Create The Product Listing Page

Create:

```text
src/pages/products/index.astro
```

Add:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import ProductCard from "../../components/ProductCard.astro";

const products = await getCollection("products");
---

<BaseLayout title="Products" description="Browse Dala catalog products.">
  <section class="section">
    <h1>Products</h1>
    <div class="product-grid">
      {products.map((product) => <ProductCard product={product} />)}
    </div>
  </section>
</BaseLayout>
```

Checkpoint:

Open:

```text
http://localhost:4321/products/
```

You should see both example products listed.

---

## 10. Create Individual Product Pages

Create:

```text
src/pages/products/[slug].astro
```

Add:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const products = await getCollection("products");

  return products.map((product) => ({
    params: { slug: product.id },
    props: { product },
  }));
}

const { product } = Astro.props;
---

<BaseLayout title={product.data.title} description={product.data.summary}>
  <section class="product-detail">
    <img src={product.data.image} alt={product.data.title} />

    <div>
      <a class="back-link" href="/products/">Back to products</a>
      <p class="eyebrow">{product.data.brand}</p>
      <h1>{product.data.title}</h1>
      <p class="lead">{product.data.summary}</p>
      {product.data.description && <p>{product.data.description}</p>}

      {product.data.packSizes.length > 0 && (
        <div class="detail-block">
          <h2>Pack Sizes</h2>
          <ul>
            {product.data.packSizes.map((size) => <li>{size}</li>)}
          </ul>
        </div>
      )}

      {product.data.tags.length > 0 && (
        <div class="detail-block">
          <h2>Tags</h2>
          <ul>
            {product.data.tags.map((tag) => <li>{tag}</li>)}
          </ul>
        </div>
      )}
    </div>
  </section>
</BaseLayout>
```

Astro will generate one static page for every Markdown file in `src/content/products`.

Checkpoint:

Open:

```text
http://localhost:4321/products/acrylic-paint/
```

You should see the Acrylic Paint product detail page.

---

## 11. Create The Collection Listing Page

Create:

```text
src/pages/collections/index.astro
```

Add:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import CollectionCard from "../../components/CollectionCard.astro";

const collections = await getCollection("collections");
---

<BaseLayout title="Collections" description="Browse Dala product collections.">
  <section class="section">
    <h1>Collections</h1>
    <div class="collection-grid">
      {collections.map((collection) => <CollectionCard collection={collection} />)}
    </div>
  </section>
</BaseLayout>
```

Checkpoint:

Open:

```text
http://localhost:4321/collections/
```

You should see the Paint and Clay And Modelling collections.

---

## 12. Create Individual Collection Pages

Create:

```text
src/pages/collections/[slug].astro
```

Add:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import ProductCard from "../../components/ProductCard.astro";

export async function getStaticPaths() {
  const collections = await getCollection("collections");
  const products = await getCollection("products");

  return collections.map((collection) => {
    const collectionProducts = collection.data.products
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);

    return {
      params: { slug: collection.id },
      props: { collection, products: collectionProducts },
    };
  });
}

const { collection, products } = Astro.props;
---

<BaseLayout title={collection.data.title} description={collection.data.summary}>
  <section class="collection-hero">
    {collection.data.image && <img src={collection.data.image} alt="" />}
    <div>
      <p class="eyebrow">Collection</p>
      <h1>{collection.data.title}</h1>
      <p>{collection.data.summary}</p>
    </div>
  </section>

  <section class="section">
    <div class="product-grid">
      {products.map((product) => <ProductCard product={product} />)}
    </div>
  </section>
</BaseLayout>
```

This page uses the manually ordered product ID list from the collection file. That gives you merchandising control: the order in the Markdown file is the order on the page.

Checkpoint:

Open:

```text
http://localhost:4321/collections/paint/
```

You should see the Paint collection page with Acrylic Paint listed inside it.

---

## 13. Add Basic Styles

Create:

```text
public/styles.css
```

Add:

```css
:root {
  --ink: #111111;
  --muted: #5f5f5f;
  --paper: #f7f4ef;
  --panel: #ffffff;
  --line: #ded8cd;
  --accent: #d71920;
  color: var(--ink);
  background: var(--paper);
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

a {
  color: inherit;
}

img {
  display: block;
  max-width: 100%;
}

.site-header {
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid var(--line);
  display: flex;
  gap: 24px;
  justify-content: space-between;
  padding: 18px clamp(20px, 5vw, 72px);
}

.site-logo {
  font-weight: 900;
  text-decoration: none;
  text-transform: uppercase;
}

.site-header nav {
  display: flex;
  gap: 18px;
}

.site-header nav a {
  font-weight: 700;
  text-decoration: none;
}

.hero,
.section,
.product-detail,
.collection-hero {
  padding: clamp(40px, 7vw, 92px) clamp(20px, 5vw, 72px);
}

.hero,
.product-detail,
.collection-hero {
  align-items: center;
  display: grid;
  gap: clamp(28px, 6vw, 80px);
  grid-template-columns: minmax(0, 1fr) minmax(280px, 1fr);
}

.hero {
  min-height: 70vh;
}

.hero h1,
.section h1,
.product-detail h1,
.collection-hero h1 {
  font-size: clamp(42px, 7vw, 86px);
  letter-spacing: 0;
  line-height: 0.95;
  margin: 0 0 22px;
  text-transform: uppercase;
}

.section h2,
.product-card h2,
.collection-card h2 {
  margin: 0;
}

p {
  color: var(--muted);
  line-height: 1.55;
}

.eyebrow {
  color: var(--accent);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}

.lead {
  color: var(--ink);
  font-size: 20px;
}

.button {
  background: var(--accent);
  color: #ffffff;
  display: inline-flex;
  font-weight: 800;
  min-height: 44px;
  align-items: center;
  padding: 0 18px;
  text-decoration: none;
}

.hero img,
.collection-hero img,
.product-detail > img {
  aspect-ratio: 1 / 1;
  background: #ede8df;
  object-fit: cover;
  width: 100%;
}

.section-heading {
  align-items: end;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 24px;
}

.product-grid,
.collection-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.product-card,
.collection-card {
  background: var(--panel);
  border: 1px solid var(--line);
}

.product-card a,
.collection-card a {
  display: grid;
  gap: 12px;
  padding: 14px;
  text-decoration: none;
}

.product-card img,
.collection-card img {
  aspect-ratio: 1 / 1;
  background: #ede8df;
  object-fit: cover;
  width: 100%;
}

.product-card span {
  color: var(--accent);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.detail-block {
  border-top: 1px solid var(--line);
  margin-top: 24px;
  padding-top: 18px;
}

.back-link {
  color: var(--muted);
  display: inline-block;
  font-weight: 800;
  margin-bottom: 18px;
  text-decoration: none;
}

@media (max-width: 760px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero,
  .product-detail,
  .collection-hero {
    grid-template-columns: 1fr;
  }
}
```

This styling is intentionally modest. It gives you a clean catalog, not a final brand system. Once the content structure is correct, you can push the visual direction much further.

---

## 14. Build The Static Site

Run:

```bash
npm run build
```

Astro outputs the static site to:

```text
dist/
```

That `dist` folder is what gets deployed to a static host.

To preview the built site locally:

```bash
npm run preview
```

---

## 15. Recommended Final Shape

The project should now feel like this:

```text
dala-catalog-astro/
  public/
    assets/
      products/
      collections/
    styles.css
  src/
    content.config.ts
    components/
      CollectionCard.astro
      ProductCard.astro
    content/
      products/
        acrylic-paint.md
        air-drying-clay.md
      collections/
        paint.md
        clay-and-modelling.md
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      products/
        index.astro
        [slug].astro
      collections/
        index.astro
        [slug].astro
  package.json
```

---

## 16. How To Add More Products

To add a product:

1. Add an image to `public/assets/products/`.
2. Add a Markdown file to `src/content/products/`.
3. Add that product ID to one or more collection files.

Example:

```text
src/content/products/fabric-paint.md
```

```md
---
title: Fabric Paint
brand: Dala
summary: Colour for textile craft, apparel decoration, and mixed-media surfaces.
image: /assets/products/fabric-paint.jpg
packSizes:
  - 50 ml
  - 250 ml
tags:
  - Textile
  - Craft
---
```

Then add the ID to a collection:

```md
products:
  - acrylic-paint
  - fabric-paint
```

---

## 17. Future-Friendly Choices

This basic build leaves clear places for later features.

CMS:

- A CMS can write to `src/content/products` and `src/content/collections`.
- The schema already validates required product fields.
- Collection product references already use product IDs, which map nicely to CMS relation fields.

Smart search:

- Product title, brand, summary, description, tags, and pack sizes are already structured.
- A future search index can be generated from `getCollection("products")`.
- You can add `sku` and `barcode` fields later without changing the page structure.

Brands:

- Products already have a `brand` field.
- Later, `brand` can become a full content collection if you need brand pages, logos, brand colours, or Teddy-specific landing pages.

Filtering:

- Tags are already arrays.
- Later, filters can use tags, brands, pack sizes, or collections.

Landing pages:

- The homepage is simple now.
- Later, you can add a `pages` content collection with reusable blocks like hero, text band, collection preview, and featured products.

The important rule is: products and collections stay as the core data model. CMS, search, filters, and landing pages should sit on top of that model, not replace it.

---

## 18. Deploy To GitHub Pages

Astro can deploy a static site to GitHub Pages with GitHub Actions.

The official Astro docs recommend using Astro's GitHub Action, which builds the site and deploys the generated static output to GitHub Pages.

Official docs:

- Astro GitHub Pages guide: https://docs.astro.build/en/guides/deploy/github/
- GitHub Pages: https://pages.github.com/

### Choose The GitHub Pages URL

For your GitHub username, `Outige`, there are two common options.

Option A: project site

```text
https://outige.github.io/dala-catalog-astro/
```

Use this if the GitHub repository is named:

```text
dala-catalog-astro
```

Option B: user site

```text
https://outige.github.io/
```

Use this only if the GitHub repository is named:

```text
Outige.github.io
```

Most projects use option A.

### Configure Astro

For a project site, update:

```text
astro.config.mjs
```

to:

```js
// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://outige.github.io",
  base: "/dala-catalog-astro",
});
```

If your repository has a different name, change `base` to match the repository name:

```js
base: "/your-repo-name",
```

If you are using the special `Outige.github.io` repository, do not set `base`:

```js
// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://outige.github.io",
});
```

### Important Base Path Note

When `base` is set, GitHub Pages serves the site from a subfolder like:

```text
/dala-catalog-astro/
```

That means absolute links like these can break after deployment:

```astro
<a href="/products/">Products</a>
<img src="/assets/products/acrylic-paint.jpg" alt="Acrylic Paint" />
<link rel="stylesheet" href="/styles.css" />
```

For a GitHub Pages project site, prefix internal links and public assets with Astro's base URL.

Example:

```astro
---
const base = import.meta.env.BASE_URL;
---

<a href={`${base}products/`}>Products</a>
<img src={`${base}assets/products/acrylic-paint.jpg`} alt="Acrylic Paint" />
<link rel="stylesheet" href={`${base}styles.css`} />
```

For content image paths stored as `/assets/...`, create a tiny helper when you are ready to deploy:

```astro
---
const base = import.meta.env.BASE_URL;
const assetPath = (path) => `${base}${path.replace(/^\//, "")}`;
---

<img src={assetPath(product.data.image)} alt={product.data.title} />
```

This keeps local development working while making GitHub Pages project URLs work too.

### Add The GitHub Actions Workflow

Create:

```text
.github/workflows/deploy.yml
```

Add:

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
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

If your Astro project is inside a subfolder of the repository, configure the Astro action with `path`.

For example, if the repository root contains `dala-catalog-astro/`:

```yml
      - name: Install, build, and upload your site
        uses: withastro/action@v6
        with:
          path: ./dala-catalog-astro
```

### Configure GitHub Pages

On GitHub:

1. Open the repository.
2. Go to `Settings`.
3. Go to `Pages`.
4. Under `Build and deployment`, set `Source` to `GitHub Actions`.
5. Commit and push the workflow file.

After the action finishes, the site should be live at:

```text
https://outige.github.io/dala-catalog-astro/
```

### GitHub Pages Checkpoint

After deployment, check:

```text
https://outige.github.io/dala-catalog-astro/
https://outige.github.io/dala-catalog-astro/products/
https://outige.github.io/dala-catalog-astro/collections/
```

If the HTML loads but styles or images are missing, the problem is almost always the `base` path or absolute `/assets/...` paths.
