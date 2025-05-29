export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  brand: string;
  brandId: string;
  brandDescription: string;
  name: string;
  images: ProductImage[];
  quantity: string;
  price: number;
  description: string;
  slug: string;
}

const products: Product[] = [
  // 7UP Products
  {
    id: "7up-2l",
    brand: "7UP",
    brandId: "7up",
    brandDescription: "Refreshing lemon-lime flavored carbonated soft drink",
    name: "7UP 2L",
    images: [
      { src: "/images/brands/7up_2ltr.png", alt: "7UP 2L Bottle" },
      { src: "/images/brands/7up_500ml.png", alt: "7UP 500ml Bottle" },
    ],
    quantity: "6",
    price: 920,
    description: "Big 2L bottle of refreshing 7UP, perfect for sharing.",
    slug: "7up-2l",
  },
  // 7UP 330ml
  {
    id: "7up-330ml",
    brand: "7UP",
    brandId: "7up",
    brandDescription: "Refreshing lemon-lime flavored carbonated soft drink",
    name: "7UP 330ml",
    images: [
      { src: "/images/brands/7up_330ml.png", alt: "7UP 330ml Can" },
      { src: "/images/brands/7up_500ml.png", alt: "7UP 500ml Bottle" },
    ],
    quantity: "12",
    price: 470,
    description: "Compact 330ml can of 7UP, perfect for on-the-go.",
    slug: "7up-330ml",
  },

  // Pepsi Products
  {
    id: "pepsi-2l",
    brand: "Pepsi",
    brandId: "pepsi",
    brandDescription: "Classic cola with a refreshing taste",
    name: "Pepsi 2L",
    images: [
      { src: "/images/brands/pepsi_2ltr.png", alt: "Pepsi 2L Bottle" },
      { src: "/images/brands/pepsi_500ml.png", alt: "Pepsi 500ml Bottle" },
    ],
    quantity: "6",
    price: 920,
    description: "Large 2L bottle of Pepsi, perfect for gatherings.",
    slug: "pepsi-2l",
  },
  {
    id: "pepsi-500ml",
    brand: "Pepsi",
    brandId: "pepsi",
    brandDescription: "Classic cola with a refreshing taste",
    name: "Pepsi 500ml",
    images: [
      { src: "/images/brands/pepsi_500ml.png", alt: "Pepsi 500ml Bottle" },
      { src: "/images/brands/pepsi_2ltr.png", alt: "Pepsi 2L Bottle" },
    ],
    quantity: "12",
    price: 590,
    description: "Standard 500ml bottle of Pepsi, great with any meal.",
    slug: "pepsi-500ml",
  },
  {
    id: "pepsi-330ml",
    brand: "Pepsi",
    brandId: "pepsi",
    brandDescription: "Classic cola with a refreshing taste",
    name: "Pepsi 330ml",
    images: [
      { src: "/images/brands/pepsi_330ml.png", alt: "Pepsi 330ml Can" },
      { src: "/images/brands/pepsi_500ml.png", alt: "Pepsi 500ml Bottle" },
    ],
    quantity: "12",
    price: 470,
    description: "Classic 330ml can of Pepsi, perfect for a quick refreshment.",
    slug: "pepsi-330ml",
  },

  // Tonic Water Products
  {
    id: "tonic-water-500ml",
    brand: "Tonic Water",
    brandId: "tonic",
    brandDescription: "Classic tonic water with a distinctive bitter flavor",
    name: "Tonic Water 500ml",
    images: [
      {
        src: "/images/brands/Tonic_300ml.jpg",
        alt: "Tonic Water 300ml Bottle",
      },
    ],
    quantity: "12",
    price: 590,
    description:
      "500ml bottle of classic tonic water, perfect for mixing with spirits.",
    slug: "tonic-water-500ml",
  },
  {
    id: "tonic-water-300ml",
    brand: "Tonic Water",
    brandId: "tonic",
    brandDescription: "Classic tonic water with a distinctive bitter flavor",
    name: "Tonic Water 300ml",
    images: [
      {
        src: "/images/brands/Tonic_300ml.jpg",
        alt: "Tonic Water 300ml Bottle",
      },
      {
        src: "/images/brands/Tonic_500ml.png",
        alt: "Tonic Water 500ml Bottle",
      },
    ],
    quantity: "24",
    price: 350,
    description:
      "300ml bottle of classic tonic water, perfect for mixing with spirits.",
    slug: "tonic-water-300ml",
  },

  // Energy Drinks
  {
    id: "sting-gold",
    brand: "Energy Drinks",
    brandId: "energy_drinks",
    brandDescription: "Premium Energy drinks",
    name: "Sting Gold",
    images: [
      { src: "/images/brands/gold.png", alt: "Premium Gold Mixer" },
      { src: "/images/brands/red.png", alt: "Premium Red Mixer" },
    ],
    quantity: "24",
    price: 250,
    description: "Premium gold mixer for high-end cocktails and spirits.",
    slug: "sting-gold",
  },
  {
    id: "sting-red",
    brand: "Energy Drinks",
    brandId: "energy_drinks",
    brandDescription: "Premium Energy drinks",
    name: "Sting Red",
    images: [
      { src: "/images/brands/red.png", alt: "Premium Red Mixer" },
      { src: "/images/brands/gold.png", alt: "Premium Gold Mixer" },
    ],
    quantity: "24",
    price: 250,
    description: "Premium red mixer for sophisticated mixed drinks.",
    slug: "sting-red",
  },
];

// Helper function to get all unique brands with their details
export const getBrands = () => {
  const brandMap = new Map();

  products.forEach((product) => {
    if (!brandMap.has(product.brandId)) {
      brandMap.set(product.brandId, {
        id: product.brandId,
        name: product.brand,
        description: product.brandDescription,
        image: product.images[0]?.src || "",
      });
    }
  });

  return Array.from(brandMap.values());
};

// Helper function to get products by brand ID
export const getProductsByBrandId = (brandId: string) => {
  return products.filter((product) => product.brandId === brandId);
};

// Helper function to get a single product by slug

export default products;
