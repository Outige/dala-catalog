(function () {
  const storedData = localStorage.getItem("dalaCatalogDraft");
  const data = storedData ? JSON.parse(storedData) : window.CATALOG_DATA;
  const app = document.getElementById("app");
  const params = new URLSearchParams(window.location.search);

  function byId(collection, id) {
    return collection.find((item) => item.id === id);
  }

  function brandName(id) {
    const brand = byId(data.brands, id);
    return brand ? brand.name : id;
  }

  function categoryName(id) {
    const category = byId(data.categories, id);
    return category ? category.name : id;
  }

  function productCard(product) {
    return `
      <article class="product-card">
        <a class="product-media" href="?product=${product.id}" aria-label="View ${product.name}">
          <img src="${product.image}" alt="${product.name}">
        </a>
        <div class="product-copy">
          <div class="eyebrow">${brandName(product.brand)} / ${categoryName(product.category)}</div>
          <h3><a href="?product=${product.id}">${product.name}</a></h3>
          <p>${product.summary}</p>
          <div class="tag-row">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </div>
      </article>
    `;
  }

  function categoryCard(category) {
    const count = data.products.filter((product) => product.category === category.id).length;
    return `
      <a class="category-card" href="?category=${category.id}">
        <img src="${category.image}" alt="${category.name}">
        <span class="eyebrow">${brandName(category.brand)}</span>
        <strong>${category.name}</strong>
        <small>${count} products</small>
      </a>
    `;
  }

  function hero() {
    return `
      <section class="hero-section">
        <div class="hero-copy">
          <span class="hero-kicker">Dala Artist Materials</span>
          <img class="hero-logo" src="assets/dala-logo-bw.png" alt="Dala">
          <h1>Colour, texture, and tools for working artists.</h1>
          <p>Dala leads with paint, clay, craft, and manufacturing capability. Teddy sits alongside as a focused kids creative range.</p>
          <div class="hero-actions">
            <a class="button primary" href="?brand=dala">Explore Dala</a>
            <a class="button" href="?brand=teddy">View Teddy</a>
          </div>
        </div>
        <div class="hero-image">
          <img src="assets/brushes-and-oil-paint-messy-spectrum-of-colours_w544xh544.jpg" alt="Paint brushes and colour">
          <div class="swatch-strip" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </section>
    `;
  }

  function renderHome() {
    app.innerHTML = `
      ${hero()}
      <section class="content-section">
        <div class="section-heading">
          <span class="eyebrow">Catalog</span>
          <h2>Categories</h2>
        </div>
        <div class="category-grid">${data.categories.map(categoryCard).join("")}</div>
      </section>
      <section class="content-section surface-band">
        <div class="section-heading">
          <span class="eyebrow">Featured Dala products</span>
          <h2>Main Range</h2>
        </div>
        <div class="product-grid">${data.products.filter((product) => product.brand === "dala").slice(0, 6).map(productCard).join("")}</div>
      </section>
    `;
  }

  function renderBrand(id) {
    const brand = byId(data.brands, id);
    if (!brand) return renderNotFound();
    const categories = data.categories.filter((category) => category.brand === id);
    const products = data.products.filter((product) => product.brand === id);

    app.innerHTML = `
      <section class="brand-header" style="--brand-color:${brand.color}">
        <div>
          <span class="eyebrow">${brand.role}</span>
          <h1>${brand.name}</h1>
          <p>${brand.intro}</p>
        </div>
        <img src="${brand.logo}" alt="${brand.name}">
      </section>
      <section class="content-section">
        <div class="section-heading">
          <span class="eyebrow">${brand.name}</span>
          <h2>Categories</h2>
        </div>
        <div class="category-grid">${categories.map(categoryCard).join("")}</div>
      </section>
      <section class="content-section">
        <div class="section-heading">
          <span class="eyebrow">${products.length} products</span>
          <h2>Product Listing</h2>
        </div>
        <div class="product-grid">${products.map(productCard).join("")}</div>
      </section>
    `;
  }

  function renderCategory(id) {
    const category = byId(data.categories, id);
    if (!category) return renderNotFound();
    const products = data.products.filter((product) => product.category === id);

    app.innerHTML = `
      <section class="listing-header">
        <img src="${category.image}" alt="${category.name}">
        <div>
          <span class="eyebrow">${brandName(category.brand)}</span>
          <h1>${category.name}</h1>
          <p>${category.description}</p>
        </div>
      </section>
      <section class="content-section">
        <div class="section-heading">
          <span class="eyebrow">${products.length} products</span>
          <h2>Products</h2>
        </div>
        <div class="product-grid">${products.map(productCard).join("")}</div>
      </section>
    `;
  }

  function renderProduct(id) {
    const product = byId(data.products, id);
    if (!product) return renderNotFound();

    app.innerHTML = `
      <section class="product-detail">
        <div class="detail-media">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-copy">
          <a class="back-link" href="?category=${product.category}">Back to ${categoryName(product.category)}</a>
          <span class="eyebrow">${brandName(product.brand)} / ${categoryName(product.category)}</span>
          <h1>${product.name}</h1>
          <p class="lead">${product.summary}</p>
          <p>${product.description}</p>
          <div class="detail-block">
            <h2>Pack sizes</h2>
            <div class="tag-row">${product.packSizes.map((size) => `<span>${size}</span>`).join("")}</div>
          </div>
          <div class="detail-block">
            <h2>Tags</h2>
            <div class="tag-row">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
          </div>
        </div>
      </section>
    `;
  }

  function renderStockists() {
    app.innerHTML = `
      <section class="content-section stockist-section">
        <div class="section-heading">
          <span class="eyebrow">Retail</span>
          <h1>Stockists</h1>
          <p>Use this section for retailers, distributors, or regional buying links as the catalog grows.</p>
        </div>
        <div class="stockist-grid">
          ${data.stockists.map((stockist) => `
            <article class="stockist-card">
              <img src="${stockist.logo}" alt="${stockist.name}">
              <strong>${stockist.name}</strong>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderNotFound() {
    app.innerHTML = `
      <section class="content-section">
        <div class="empty-state">
          <h1>Page not found</h1>
          <p>This catalog item does not exist yet.</p>
          <a class="button primary" href="./">Return to catalog</a>
        </div>
      </section>
    `;
  }

  if (params.get("product")) {
    renderProduct(params.get("product"));
  } else if (params.get("category")) {
    renderCategory(params.get("category"));
  } else if (params.get("brand")) {
    renderBrand(params.get("brand"));
  } else if (params.get("section") === "stockists") {
    renderStockists();
  } else {
    renderHome();
  }
})();
