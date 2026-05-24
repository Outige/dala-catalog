(function () {
  const storageKey = "dalaCatalogDraft";
  let data = JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(window.CATALOG_DATA));
  let activeTab = "products";
  const form = document.getElementById("cms-form");

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function slug(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function field(label, value, path, type) {
    const isTextarea = type === "textarea";
    const input = isTextarea
      ? `<textarea data-path="${path}">${value || ""}</textarea>`
      : `<input data-path="${path}" value="${value || ""}">`;
    return `<label class="${isTextarea ? "wide" : ""}">${label}${input}</label>`;
  }

  function select(label, value, path, options) {
    return `
      <label>${label}
        <select data-path="${path}">
          ${options.map((option) => `<option value="${option.id}" ${option.id === value ? "selected" : ""}>${option.name}</option>`).join("")}
        </select>
      </label>
    `;
  }

  function renderProducts() {
    return `
      ${data.products.map((product, index) => `
        <article class="editor-card">
          <div class="field-grid">
            ${field("Name", product.name, `products.${index}.name`)}
            ${field("ID", product.id, `products.${index}.id`)}
            ${select("Brand", product.brand, `products.${index}.brand`, data.brands)}
            ${select("Category", product.category, `products.${index}.category`, data.categories)}
            ${field("Image", product.image, `products.${index}.image`)}
            ${field("Summary", product.summary, `products.${index}.summary`, "textarea")}
            ${field("Description", product.description, `products.${index}.description`, "textarea")}
            ${field("Tags, comma separated", product.tags.join(", "), `products.${index}.tags`)}
            ${field("Pack sizes, comma separated", product.packSizes.join(", "), `products.${index}.packSizes`)}
          </div>
          <div class="card-actions">
            <button data-delete="products.${index}" type="button">Delete</button>
          </div>
        </article>
      `).join("")}
      <div class="add-row"><button id="add-item" type="button">Add Product</button></div>
    `;
  }

  function renderCategories() {
    return `
      ${data.categories.map((category, index) => `
        <article class="editor-card">
          <div class="field-grid">
            ${field("Name", category.name, `categories.${index}.name`)}
            ${field("ID", category.id, `categories.${index}.id`)}
            ${select("Brand", category.brand, `categories.${index}.brand`, data.brands)}
            ${field("Image", category.image, `categories.${index}.image`)}
            ${field("Description", category.description, `categories.${index}.description`, "textarea")}
          </div>
          <div class="card-actions">
            <button data-delete="categories.${index}" type="button">Delete</button>
          </div>
        </article>
      `).join("")}
      <div class="add-row"><button id="add-item" type="button">Add Category</button></div>
    `;
  }

  function renderBrands() {
    return `
      ${data.brands.map((brand, index) => `
        <article class="editor-card">
          <div class="field-grid">
            ${field("Name", brand.name, `brands.${index}.name`)}
            ${field("ID", brand.id, `brands.${index}.id`)}
            ${field("Role", brand.role, `brands.${index}.role`)}
            ${field("Logo", brand.logo, `brands.${index}.logo`)}
            ${field("Color", brand.color, `brands.${index}.color`)}
            ${field("Intro", brand.intro, `brands.${index}.intro`, "textarea")}
          </div>
          <div class="card-actions">
            <button data-delete="brands.${index}" type="button">Delete</button>
          </div>
        </article>
      `).join("")}
      <div class="add-row"><button id="add-item" type="button">Add Brand</button></div>
    `;
  }

  function render() {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === activeTab);
    });

    if (activeTab === "products") form.innerHTML = renderProducts();
    if (activeTab === "categories") form.innerHTML = renderCategories();
    if (activeTab === "brands") form.innerHTML = renderBrands();
  }

  function setPath(path, value) {
    const parts = path.split(".");
    const fieldName = parts.pop();
    const item = parts.reduce((target, key) => target[key], data);
    if (fieldName === "tags" || fieldName === "packSizes") {
      item[fieldName] = value.split(",").map((entry) => entry.trim()).filter(Boolean);
    } else {
      item[fieldName] = value;
    }
    save();
  }

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab;
      render();
    });
  });

  form.addEventListener("input", (event) => {
    if (event.target.dataset.path) {
      setPath(event.target.dataset.path, event.target.value);
    }
  });

  form.addEventListener("click", (event) => {
    if (event.target.dataset.delete) {
      const [collection, index] = event.target.dataset.delete.split(".");
      data[collection].splice(Number(index), 1);
      save();
      render();
    }

    if (event.target.id === "add-item") {
      if (activeTab === "products") {
        data.products.push({
          id: `new-product-${data.products.length + 1}`,
          name: "New Product",
          brand: data.brands[0].id,
          category: data.categories[0].id,
          summary: "Short product summary.",
          description: "Longer product description.",
          image: "assets/product-acrylic-paint.svg",
          tags: ["New"],
          packSizes: ["TBC"]
        });
      }

      if (activeTab === "categories") {
        data.categories.push({
          id: `new-category-${data.categories.length + 1}`,
          name: "New Category",
          brand: data.brands[0].id,
          description: "Category description.",
          image: "assets/brushes-and-oil-paint-messy-spectrum-of-colours_w544xh544.jpg"
        });
      }

      if (activeTab === "brands") {
        const id = slug(`New Brand ${data.brands.length + 1}`);
        data.brands.push({
          id,
          name: "New Brand",
          role: "Brand role",
          intro: "Brand introduction.",
          logo: "assets/dala-logo-placeholder.svg",
          color: "#d71920"
        });
      }

      save();
      render();
    }
  });

  document.getElementById("export-data").addEventListener("click", () => {
    const output = `window.CATALOG_DATA = ${JSON.stringify(data, null, 2)};\n`;
    navigator.clipboard.writeText(output);
    alert("Catalog data copied. Replace catalog-data.js with the copied content when you are ready to publish.");
  });

  document.getElementById("reset-data").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    data = JSON.parse(JSON.stringify(window.CATALOG_DATA));
    render();
  });

  render();
})();
