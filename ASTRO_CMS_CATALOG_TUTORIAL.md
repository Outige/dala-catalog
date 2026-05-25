# Building A Static Catalog Website With Astro And Decap CMS

This tutorial shows how to rebuild the current static catalog prototype as a cleaner Shopify-style catalog without checkout.

The goal:

- Individual product pages.
- Product listing pages.
- Collections made from selected products.
- Landing pages that can include modular sections like collection previews.
- CMS-managed content.
- Strong product search with optional tags, SKUs, and barcodes.
- Local images now, with remote image links supported later.
- A fully static website after build.

Recommended stack:

- Astro for the static site.
- Astro Content Collections for typed content.
- Decap CMS for browser-based editing.
- Git as the content database.

Useful official docs:

- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro routing: https://docs.astro.build/en/basics/astro-pages/
- Decap CMS intro: https://decapcms.org/docs/intro/
- Decap CMS configuration: https://decapcms.org/docs/configuration-options/
- Fuse.js fuzzy search: https://www.fusejs.io/

---

## 1. Create The Astro Project

From the folder where you keep your development projects, run:

```bash
npm create astro@latest dala-catalog-astro
cd dala-catalog-astro
npm install
```

Choose a minimal Astro starter when prompted.

Start the dev server:

```bash
npm run dev
```

Astro will print a local preview URL, usually:

```text
http://localhost:4321/
```

---

## 2. Add The Content Folders

Create these folders:

```text
src/
  content/
    products/
    collections/
    pages/
public/
  admin/
  assets/
    products/
    collections/
    pages/
```

Use `src/content` for structured CMS content.

Use `public/assets` for images uploaded or referenced by the CMS.

Remote image URLs can also be stored directly in content. That is useful if your long-term image source is a DAM, CDN, Shopify file URL, Airtable attachment, Google Cloud Storage bucket, S3 bucket, or another hosted media system.

---

## 3. Define The Content Schemas

Create this file:

```text
src/content/config.ts
```

Add:

```ts
import { defineCollection, z } from "astro:content";

const imageReference = z.string().refine(
  (value) => value.startsWith("/") || /^https?:\/\//.test(value),
  "Use a local public path like /assets/products/item.jpg or a full https:// image URL."
);

const products = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    summary: z.string(),
    description: z.string().optional(),
    images: z.array(imageReference).min(1),
    packSizes: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

const catalogCollections = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    image: imageReference.optional(),
    products: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    seoDescription: z.string().optional(),
    blocks: z.array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("hero"),
          heading: z.string(),
          text: z.string(),
          image: imageReference,
          primaryLinkText: z.string().optional(),
          primaryLinkUrl: z.string().optional(),
        }),
        z.object({
          type: z.literal("collectionPreview"),
          heading: z.string(),
          collection: z.string(),
          limit: z.number().default(4),
        }),
        z.object({
          type: z.literal("textBand"),
          heading: z.string(),
          text: z.string(),
        }),
      ])
    ).default([]),
  }),
});

export const collections = {
  products,
  collections: catalogCollections,
  pages,
};
```

This gives you validation. If the CMS creates broken content, Astro catches it during the build.

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
sku: DALA-ACR-001
barcode: "600000000001"
summary: A dependable everyday acrylic paint range for artists, students, and crafters.
description: Dala Acrylic Paint is a flexible staple for painting, school projects, craft surfaces, and mixed media work.
images:
  - /assets/products/acrylic-paint.jpg
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

Create another product:

```text
src/content/products/air-drying-clay.md
```

Add:

```md
---
title: Air-Drying Clay
brand: Dala
sku: DALA-CLAY-001
barcode: "600000000002"
summary: A simple modelling clay that dries without kiln firing.
description: A practical sculpting material for classrooms, workshops, home craft, and decorative objects.
images:
  - /assets/products/air-drying-clay.jpg
packSizes:
  - 500 g
  - 1 kg
tags:
  - Modelling
  - School
  - No kiln
---
```

Copy matching images into:

```text
public/assets/products/
```

The image filenames should match the paths in the product frontmatter.

If you already have hosted images, use full URLs instead:

```md
images:
  - https://cdn.example.com/dala/products/acrylic-paint.jpg
```

For this tutorial the components use normal `<img>` tags, so local public paths and remote URLs both work.

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

The values under `products` are product slugs. For example:

```text
src/content/products/acrylic-paint.md
```

has this slug:

```text
acrylic-paint
```

---

## 6. Add A CMS-Editable Home Page

Create:

```text
src/content/pages/home.json
```

Add:

```json
{
  "title": "Dala Catalog",
  "seoDescription": "Dala artist materials catalog.",
  "blocks": [
    {
      "type": "hero",
      "heading": "Dala Artist Materials",
      "text": "Colour, texture, and tools for working artists, classrooms, crafters, and retailers.",
      "image": "/assets/pages/home-hero.jpg",
      "primaryLinkText": "Explore Paint",
      "primaryLinkUrl": "/collections/paint/"
    },
    {
      "type": "collectionPreview",
      "heading": "Paint",
      "collection": "paint",
      "limit": 4
    },
    {
      "type": "collectionPreview",
      "heading": "Clay And Modelling",
      "collection": "clay-and-modelling",
      "limit": 4
    }
  ]
}
```

This is the key idea: pages are assembled from CMS-managed blocks.

---

## 7. Create Reusable Components

Create:

```text
src/components/ProductCard.astro
```

Add:

```astro
---
const { product } = Astro.props;
const image = product.data.images[0];
---

<article class="product-card">
  <a href={`/products/${product.slug}/`}>
    <img src={image} alt={product.data.title} />
    <h3>{product.data.title}</h3>
    <p>{product.data.summary}</p>
    {product.data.sku && <small>{product.data.sku}</small>}
  </a>
</article>
```

Create:

```text
src/components/CollectionPreview.astro
```

Add:

```astro
---
import { getCollection } from "astro:content";
import ProductCard from "./ProductCard.astro";

const { heading, collectionSlug, limit = 4 } = Astro.props;

const allCollections = await getCollection("collections");
const allProducts = await getCollection("products");

const collection = allCollections.find((item) => item.slug === collectionSlug);
const productSlugs = collection?.data.products ?? [];
const products = productSlugs
  .map((slug) => allProducts.find((product) => product.slug === slug))
  .filter(Boolean)
  .slice(0, limit);
---

{collection && (
  <section class="section">
    <div class="section-heading">
      <h2>{heading}</h2>
      <a href={`/collections/${collection.slug}/`}>View collection</a>
    </div>
    <div class="product-grid">
      {products.map((product) => <ProductCard product={product} />)}
    </div>
  </section>
)}
```

Create:

```text
src/components/PageBlocks.astro
```

Add:

```astro
---
import CollectionPreview from "./CollectionPreview.astro";

const { blocks } = Astro.props;
---

{blocks.map((block) => {
  if (block.type === "hero") {
    return (
      <section class="hero">
        <div>
          <h1>{block.heading}</h1>
          <p>{block.text}</p>
          {block.primaryLinkUrl && block.primaryLinkText && (
            <a class="button" href={block.primaryLinkUrl}>{block.primaryLinkText}</a>
          )}
        </div>
        <img src={block.image} alt="" />
      </section>
    );
  }

  if (block.type === "collectionPreview") {
    return (
      <CollectionPreview
        heading={block.heading}
        collectionSlug={block.collection}
        limit={block.limit}
      />
    );
  }

  if (block.type === "textBand") {
    return (
      <section class="section">
        <h2>{block.heading}</h2>
        <p>{block.text}</p>
      </section>
    );
  }
})}
```

---

## 8. Create The Home Page

Replace:

```text
src/pages/index.astro
```

with:

```astro
---
import { getEntry } from "astro:content";
import PageBlocks from "../components/PageBlocks.astro";

const page = await getEntry("pages", "home");
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{page.data.title}</title>
    <meta name="description" content={page.data.seoDescription ?? page.data.title} />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <header class="site-header">
      <a href="/">Dala Catalog</a>
      <nav>
        <a href="/products/">Products</a>
        <a href="/collections/">Collections</a>
      </nav>
    </header>
    <main>
      <PageBlocks blocks={page.data.blocks} />
    </main>
  </body>
</html>
```

---

## 9. Create Product Listing And Product Detail Pages

Create:

```text
src/pages/products/index.astro
```

Add:

```astro
---
import { getCollection } from "astro:content";
import ProductCard from "../../components/ProductCard.astro";

const products = await getCollection("products");
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Products</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="section">
      <h1>Products</h1>
      <div class="product-grid">
        {products.map((product) => <ProductCard product={product} />)}
      </div>
    </main>
  </body>
</html>
```

Create:

```text
src/pages/products/[slug].astro
```

Add:

```astro
---
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const products = await getCollection("products");
  return products.map((product) => ({
    params: { slug: product.slug },
    props: { product },
  }));
}

const { product } = Astro.props;
const image = product.data.images[0];
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{product.data.title}</title>
    <meta name="description" content={product.data.summary} />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="product-detail">
      <img src={image} alt={product.data.title} />
      <div>
        <a href="/products/">Back to products</a>
        <h1>{product.data.title}</h1>
        <p>{product.data.summary}</p>
        {product.data.description && <p>{product.data.description}</p>}

        <h2>Pack Sizes</h2>
        <ul>
          {product.data.packSizes.map((size) => <li>{size}</li>)}
        </ul>

        <h2>Tags</h2>
        <ul>
          {product.data.tags.map((tag) => <li>{tag}</li>)}
        </ul>
      </div>
    </main>
  </body>
</html>
```

---

## 10. Create Collection Listing And Collection Detail Pages

Create:

```text
src/pages/collections/index.astro
```

Add:

```astro
---
import { getCollection } from "astro:content";

const collections = await getCollection("collections");
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Collections</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="section">
      <h1>Collections</h1>
      <div class="collection-grid">
        {collections.map((collection) => (
          <a class="collection-card" href={`/collections/${collection.slug}/`}>
            {collection.data.image && <img src={collection.data.image} alt="" />}
            <h2>{collection.data.title}</h2>
            <p>{collection.data.summary}</p>
          </a>
        ))}
      </div>
    </main>
  </body>
</html>
```

Create:

```text
src/pages/collections/[slug].astro
```

Add:

```astro
---
import { getCollection } from "astro:content";
import ProductCard from "../../components/ProductCard.astro";

export async function getStaticPaths() {
  const collections = await getCollection("collections");
  const products = await getCollection("products");

  return collections.map((collection) => {
    const collectionProducts = collection.data.products
      .map((slug) => products.find((product) => product.slug === slug))
      .filter(Boolean);

    return {
      params: { slug: collection.slug },
      props: { collection, products: collectionProducts },
    };
  });
}

const { collection, products } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{collection.data.title}</title>
    <meta name="description" content={collection.data.summary} />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="section">
      <h1>{collection.data.title}</h1>
      <p>{collection.data.summary}</p>
      <div class="product-grid">
        {products.map((product) => <ProductCard product={product} />)}
      </div>
    </main>
  </body>
</html>
```

This collection page shows the first image of every product in that collection.

---

## 11. Add Strong Product Search

For catalog search, use a static search index plus Fuse.js.

This gives you:

- Partial and fuzzy matching.
- Search by product title.
- Search by summary and description.
- Search by tags.
- Search by SKU.
- Search by barcode.
- No backend server.

Install Fuse.js:

```bash
npm install fuse.js
```

Create:

```text
src/pages/search-index.json.ts
```

Add:

```ts
import { getCollection } from "astro:content";

export async function GET() {
  const products = await getCollection("products");

  return new Response(
    JSON.stringify(
      products.map((product) => ({
        title: product.data.title,
        slug: product.slug,
        url: `/products/${product.slug}/`,
        brand: product.data.brand,
        sku: product.data.sku ?? "",
        barcode: product.data.barcode ?? "",
        summary: product.data.summary,
        description: product.data.description ?? "",
        tags: product.data.tags,
        image: product.data.images[0],
      }))
    ),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
```

Create:

```text
src/components/ProductSearch.astro
```

Add:

```astro
<search class="product-search">
  <label>
    <span>Search products</span>
    <input
      id="product-search-input"
      type="search"
      autocomplete="off"
      placeholder="Search by name, SKU, barcode, tag, or description"
    />
  </label>
  <div id="product-search-results" class="product-grid" aria-live="polite"></div>
</search>

<script>
  import Fuse from "fuse.js";

  const input = document.getElementById("product-search-input");
  const results = document.getElementById("product-search-results");

  const response = await fetch("/search-index.json");
  const products = await response.json();

  const fuse = new Fuse(products, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    keys: [
      { name: "title", weight: 0.4 },
      { name: "sku", weight: 0.25 },
      { name: "barcode", weight: 0.25 },
      { name: "tags", weight: 0.2 },
      { name: "summary", weight: 0.15 },
      { name: "description", weight: 0.1 },
      { name: "brand", weight: 0.05 },
    ],
  });

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render(items) {
    results.innerHTML = items
      .map((product) => `
        <article class="product-card">
          <a href="${escapeHtml(product.url)}">
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}">
            <h3>${escapeHtml(product.title)}</h3>
            <p>${escapeHtml(product.summary)}</p>
            ${product.sku ? `<small>${escapeHtml(product.sku)}</small>` : ""}
          </a>
        </article>
      `)
      .join("");
  }

  render(products.slice(0, 8));

  input?.addEventListener("input", () => {
    const query = input.value.trim();
    const matches = query
      ? fuse.search(query).map((match) => match.item)
      : products.slice(0, 8);

    render(matches.slice(0, 24));
  });
</script>
```

Create:

```text
src/pages/search.astro
```

Add:

```astro
---
import ProductSearch from "../components/ProductSearch.astro";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Search Products</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="section">
      <h1>Search Products</h1>
      <ProductSearch />
    </main>
  </body>
</html>
```

Add a search link to the main navigation:

```astro
<a href="/search/">Search</a>
```

For a larger site with many editorial pages, add Pagefind later for whole-site search. For the catalog itself, Fuse.js against a generated product index is the more direct fit because it gives you precise control over product fields like SKU, barcode, and tags.

---

## 12. Add Basic Styles

Create:

```text
public/styles.css
```

Add:

```css
:root {
  color: #191817;
  background: #fbfaf7;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  padding: 20px clamp(20px, 5vw, 72px);
  border-bottom: 1px solid #e7e2da;
  background: #ffffff;
}

.site-header nav {
  display: flex;
  gap: 18px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(280px, 1.1fr);
  gap: clamp(28px, 6vw, 80px);
  align-items: center;
  min-height: 70vh;
  padding: clamp(40px, 7vw, 96px) clamp(20px, 5vw, 72px);
}

.hero h1 {
  max-width: 680px;
  font-size: clamp(42px, 7vw, 84px);
  line-height: 0.95;
  margin: 0 0 24px;
}

.hero p {
  max-width: 560px;
  font-size: 20px;
  line-height: 1.5;
}

.hero img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.button {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 18px;
  background: #d71920;
  color: #ffffff;
  text-decoration: none;
  font-weight: 700;
}

.section {
  padding: clamp(40px, 7vw, 88px) clamp(20px, 5vw, 72px);
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
  margin-bottom: 24px;
}

.product-grid,
.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.product-card,
.collection-card {
  border: 1px solid #e7e2da;
  background: #ffffff;
}

.product-card a,
.collection-card {
  display: grid;
  gap: 12px;
  padding: 14px;
  text-decoration: none;
}

.product-card img,
.collection-card img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #f0ede7;
}

.product-card h3,
.collection-card h2 {
  margin: 0;
}

.product-card p,
.collection-card p {
  margin: 0;
  color: #5f5a52;
  line-height: 1.45;
}

.product-detail {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1fr);
  gap: clamp(28px, 6vw, 72px);
  padding: clamp(40px, 7vw, 88px) clamp(20px, 5vw, 72px);
}

.product-detail > img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #f0ede7;
}

.product-search {
  display: grid;
  gap: 24px;
}

.product-search label {
  display: grid;
  gap: 8px;
  max-width: 720px;
}

.product-search input {
  min-height: 48px;
  border: 1px solid #d6d0c8;
  padding: 0 14px;
  font: inherit;
}

@media (max-width: 760px) {
  .site-header,
  .hero,
  .product-detail {
    grid-template-columns: 1fr;
  }

  .site-header {
    display: grid;
  }
}
```

---

## 13. Add Decap CMS

Create:

```text
public/admin/index.html
```

Add:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Catalog CMS</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

Create:

```text
public/admin/config.yml
```

Add:

```yml
backend:
  name: git-gateway
  branch: main

local_backend: true

media_folder: "public/assets/uploads"
public_folder: "/assets/uploads"

collections:
  - name: "products"
    label: "Products"
    folder: "src/content/products"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "frontmatter"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Brand", name: "brand", widget: "string", default: "Dala" }
      - { label: "SKU", name: "sku", widget: "string", required: false }
      - { label: "Barcode", name: "barcode", widget: "string", required: false }
      - { label: "Summary", name: "summary", widget: "text" }
      - { label: "Description", name: "description", widget: "text", required: false }
      - label: "Images"
        name: "images"
        widget: "list"
        min: 1
        field:
          label: "Image"
          name: "image"
          widget: "string"
          hint: "Use /assets/products/example.jpg or a full https:// image URL."
      - label: "Pack Sizes"
        name: "packSizes"
        widget: "list"
        required: false
        field: { label: "Pack Size", name: "packSize", widget: "string" }
      - label: "Tags"
        name: "tags"
        widget: "list"
        required: false
        field: { label: "Tag", name: "tag", widget: "string" }

  - name: "catalog_collections"
    label: "Collections"
    folder: "src/content/collections"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "frontmatter"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Summary", name: "summary", widget: "text" }
      - { label: "Image", name: "image", widget: "string", required: false, hint: "Use /assets/collections/example.jpg or a full https:// image URL." }
      - label: "Products"
        name: "products"
        widget: "relation"
        collection: "products"
        search_fields: ["title"]
        value_field: "{{slug}}"
        display_fields: ["title"]
        multiple: true

  - name: "pages"
    label: "Pages"
    files:
      - label: "Home Page"
        name: "home"
        file: "src/content/pages/home.json"
        fields:
          - { label: "Title", name: "title", widget: "string" }
          - { label: "SEO Description", name: "seoDescription", widget: "text", required: false }
          - label: "Blocks"
            name: "blocks"
            widget: "list"
            types:
              - label: "Hero"
                name: "hero"
                widget: "object"
                fields:
                  - { label: "Heading", name: "heading", widget: "string" }
                  - { label: "Text", name: "text", widget: "text" }
                  - { label: "Image", name: "image", widget: "string", hint: "Use /assets/pages/example.jpg or a full https:// image URL." }
                  - { label: "Primary Link Text", name: "primaryLinkText", widget: "string", required: false }
                  - { label: "Primary Link URL", name: "primaryLinkUrl", widget: "string", required: false }
              - label: "Collection Preview"
                name: "collectionPreview"
                widget: "object"
                fields:
                  - { label: "Heading", name: "heading", widget: "string" }
                  - label: "Collection"
                    name: "collection"
                    widget: "relation"
                    collection: "catalog_collections"
                    search_fields: ["title"]
                    value_field: "{{slug}}"
                    display_fields: ["title"]
                  - { label: "Limit", name: "limit", widget: "number", default: 4 }
              - label: "Text Band"
                name: "textBand"
                widget: "object"
                fields:
                  - { label: "Heading", name: "heading", widget: "string" }
                  - { label: "Text", name: "text", widget: "text" }
```

---

## 14. Run Decap CMS Locally

Install the Decap local backend helper:

```bash
npm install -D decap-server
```

Add this script to `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "cms": "decap-server"
  }
}
```

Run Astro in one terminal:

```bash
npm run dev
```

Run the CMS backend in another terminal:

```bash
npm run cms
```

Open:

```text
http://localhost:4321/admin/
```

Now you can edit products, collections, and the home page in the browser.

---

## 15. Build The Static Site

Run:

```bash
npm run build
```

Astro outputs the static site to:

```text
dist/
```

That `dist` folder is what gets deployed.

---

## 16. Deploy

Good deployment options:

- Netlify
- Cloudflare Pages
- Vercel

For the simplest Decap CMS setup, Netlify is usually the smoothest because Decap's `git-gateway` backend integrates well with Netlify Identity.

Typical Netlify settings:

```text
Build command: npm run build
Publish directory: dist
```

Then enable:

- Netlify Identity
- Git Gateway

Your CMS will live at:

```text
https://your-site.com/admin/
```

---

## 17. How The Pieces Fit Together

Products are individual catalog entries.

```text
src/content/products/acrylic-paint.md
```

Collections are manually curated groups of products.

```text
src/content/collections/paint.md
```

Pages are modular layouts made from reusable blocks.

```text
src/content/pages/home.json
```

Astro turns all of that into static routes:

```text
/
/products/
/products/acrylic-paint/
/collections/
/collections/paint/
/search/
/search-index.json
```

Decap CMS gives you a browser UI for editing those content files.

---

## 18. Suggested Migration From The Current Prototype

Your current files map cleanly into the new structure:

```text
catalog-data.js brands       -> optional brand field or future brands collection
catalog-data.js categories   -> src/content/collections/
catalog-data.js products     -> src/content/products/
catalog-data.js product tags -> searchable tags field
future SKUs/barcodes         -> optional product fields
app.js renderProduct         -> src/pages/products/[slug].astro
app.js renderCategory        -> src/pages/collections/[slug].astro
app.js hero/renderHome       -> src/content/pages/home.json + PageBlocks.astro
assets/                      -> public/assets/
future image URLs            -> product image fields can use https:// URLs
```

Start by migrating products and collections first. Add CMS-managed pages once the catalog pages are working.

Recommended build order:

1. Create Astro project.
2. Add products.
3. Add product listing and detail pages.
4. Add collections.
5. Add collection listing and detail pages.
6. Add page blocks.
7. Add search.
8. Add Decap CMS.
9. Deploy.

---

## 19. Best Practices

Keep product slugs stable. If a product URL changes, old links break.

Use collection product references instead of automatically filtering by tags. Manual collections give you better merchandising control.

Keep page blocks simple. Start with `hero`, `collectionPreview`, and `textBand`. Add more only when you really need them.

Validate content with Astro schemas. This prevents silent CMS mistakes from becoming broken pages.

Keep images in predictable folders. For example:

```text
public/assets/products/
public/assets/collections/
public/assets/pages/
public/assets/uploads/
```

When using remote image URLs, prefer stable CDN URLs that will not expire. Temporary signed image links are poor catalog data because static pages can outlive the link.

Keep SKUs and barcodes as strings, not numbers. Leading zeroes matter.

Use tags for browsing and filtering, but keep collections manually curated. Tags describe products; collections merchandise products.

Avoid building a custom CMS unless the editing experience is the product. For this catalog, Git-based content is enough.

---

## 20. Final Shape

When finished, the project should feel like this:

```text
dala-catalog-astro/
  public/
    admin/
      index.html
      config.yml
    assets/
  src/
    components/
      CollectionPreview.astro
      PageBlocks.astro
      ProductCard.astro
      ProductSearch.astro
    content/
      config.ts
      products/
      collections/
      pages/
    pages/
      index.astro
      products/
        index.astro
        [slug].astro
      collections/
        index.astro
        [slug].astro
      search.astro
      search-index.json.ts
  package.json
```

That gives you a sleek catalog site that behaves like Shopify browsing, but without cart, checkout, inventory, or ecommerce complexity.
