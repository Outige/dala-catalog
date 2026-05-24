window.CATALOG_DATA = {
  brands: [
    {
      id: "dala",
      name: "Dala",
      role: "Main brand",
      intro: "South African artist materials for studios, classrooms, crafters, and retailers. Dala is the center of the catalog.",
      logo: "assets/dala-logo-bw.png",
      color: "#d71920"
    },
    {
      id: "teddy",
      name: "Teddy",
      role: "Kids creative materials",
      intro: "A playful creative materials brand for early learning, home crafts, and bright classroom projects.",
      logo: "assets/game-logo.png",
      color: "#f1b82d"
    }
  ],
  categories: [
    {
      id: "paint",
      name: "Paint",
      brand: "dala",
      description: "Core colour ranges for artists, schools, hobbyists, and craft retailers.",
      image: "assets/brushes-and-oil-paint-messy-spectrum-of-colours_w544xh544.jpg"
    },
    {
      id: "clay-and-modelling",
      name: "Clay & Modelling",
      brand: "dala",
      description: "Hands-on modelling, sculpting, and air-drying materials.",
      image: "assets/modeling-clay-group.avif"
    },
    {
      id: "craft-and-fabric",
      name: "Craft & Fabric",
      brand: "dala",
      description: "Creative finishes for textiles, mixed media, and decorative craft.",
      image: "assets/fabric-paint-example.jpg"
    },
    {
      id: "private-label",
      name: "Private Label",
      brand: "dala",
      description: "Manufacturing support for retailer and partner-branded creative products.",
      image: "assets/Factory1.webp"
    },
    {
      id: "kids-creative",
      name: "Kids Creative",
      brand: "teddy",
      description: "Soft, colourful, easy-to-use materials for young makers.",
      image: "assets/2025-05-homemade-playdough-15.webp"
    }
  ],
  products: [
    {
      id: "acrylic-paint",
      name: "Acrylic Paint",
      brand: "dala",
      category: "paint",
      summary: "A dependable everyday acrylic paint range for artists, students, and crafters.",
      description: "Dala Acrylic Paint is a flexible staple for painting, school projects, craft surfaces, and mixed media work. It is positioned as a high-volume hero range in the Dala catalog.",
      image: "assets/product-acrylic-paint.svg",
      tags: ["Artist", "Craft", "Water-based"],
      packSizes: ["75 ml", "250 ml", "500 ml"]
    },
    {
      id: "oil-paint",
      name: "Oil Paint",
      brand: "dala",
      category: "paint",
      summary: "Traditional oil colour for richer studio painting applications.",
      description: "A more specialist paint range for customers who want slower working time, depth of colour, and classic oil painting behaviour.",
      image: "assets/product-oil-paint.svg",
      tags: ["Artist", "Studio"],
      packSizes: ["50 ml", "75 ml"]
    },
    {
      id: "powder-paint",
      name: "Powder Paint",
      brand: "dala",
      category: "paint",
      summary: "A classroom-friendly dry paint format for schools and group use.",
      description: "Powder Paint is useful for education, bulk craft, and activities where flexible mixing and economical colour use matter.",
      image: "assets/product-powder-paint.svg",
      tags: ["School", "Bulk", "Mixable"],
      packSizes: ["500 g", "1 kg"]
    },
    {
      id: "air-drying-clay",
      name: "Air-Drying Clay",
      brand: "dala",
      category: "clay-and-modelling",
      summary: "A simple modelling clay that dries without kiln firing.",
      description: "Air-Drying Clay is a practical sculpting material for classrooms, workshops, home craft, and decorative objects.",
      image: "assets/Air-drying-clay.jpg",
      tags: ["Modelling", "School", "No kiln"],
      packSizes: ["500 g", "1 kg"]
    },
    {
      id: "modelling-clay",
      name: "Modelling Clay",
      brand: "dala",
      category: "clay-and-modelling",
      summary: "Reusable colour modelling clay for shape play and basic sculpting.",
      description: "A tactile material for building forms, colour exploration, and classroom creativity.",
      image: "assets/product-modeling-clay.svg",
      tags: ["Reusable", "Kids", "Classroom"],
      packSizes: ["Assorted set", "Bulk pack"]
    },
    {
      id: "fabric-paint",
      name: "Fabric Paint",
      brand: "dala",
      category: "craft-and-fabric",
      summary: "Colour for textile craft, apparel decoration, and mixed-media surfaces.",
      description: "Fabric Paint supports the craft side of the Dala range and gives retailers a clear bridge between art materials and creative lifestyle products.",
      image: "assets/product-fabric-paint.svg",
      tags: ["Textile", "Craft", "Decorative"],
      packSizes: ["50 ml", "250 ml"]
    },
    {
      id: "private-label-manufacturing",
      name: "Private Label Manufacturing",
      brand: "dala",
      category: "private-label",
      summary: "OEM and partner manufacturing for creative material ranges.",
      description: "Dala can support private label creative materials, packaging development, batch production, and retailer-specific product programs.",
      image: "assets/product-private-label.svg",
      tags: ["OEM", "Retail", "Manufacturing"],
      packSizes: ["Project based"]
    },
    {
      id: "play-dough",
      name: "Play Dough",
      brand: "teddy",
      category: "kids-creative",
      summary: "Soft, colourful dough for early creative play.",
      description: "Teddy Play Dough is the accessible, cheerful kids product in the catalog. It keeps Teddy present without making it compete with Dala as the lead brand.",
      image: "assets/product-play-dough.svg",
      tags: ["Kids", "Play", "Colour"],
      packSizes: ["Single tub", "Assorted set"]
    }
  ],
  stockists: [
    { name: "PNA", logo: "assets/pna-logo.png" },
    { name: "Takealot", logo: "assets/Takealot_logo.svg.png" },
    { name: "Pick n Pay", logo: "assets/Pick_n_Pay_logo.svg" },
    { name: "Checkers", logo: "assets/checkers-logo.png" },
    { name: "Shoprite", logo: "assets/shoprite-logo.png" }
  ]
};
