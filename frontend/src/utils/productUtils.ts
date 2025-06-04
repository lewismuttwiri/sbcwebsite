// Types
export interface ProductImage {
  src: string;
  alt: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
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

// Utility function to fetch from Next.js API routes
async function fetchFromApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
    const response = await fetch(`api/${endpoint}`, {
      // ...options,
      headers: {
        // ...options.headers,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from ${endpoint}: ${response.status} ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
}

// Exported utility functions
export async function getBrands(): Promise<Brand[]> {
  try {
    const data = await fetchFromApi("brands");
    return data as Brand[];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const data = await fetchFromApi("products");
    return data as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getFeaturedProducts(count: number): Promise<Product[]> {
  try {
    const data = await fetchFromApi("products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

      mode: "cors",
      credentials: "include",
    });
    return data.slice(0, count);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function getProductsByBrandId(
  brandId: string,
  searchTerm: string = ""
): Promise<Product[]> {
  try {
    const data = await fetchFromApi("products");
    const filteredProducts = data.filter(
      (product: Product) =>
        product.brandId.toLowerCase() === brandId.toLowerCase()
    );
    console.log("Filtered products:", filteredProducts);
    console.log("Brand ID:", brandId);

    if (searchTerm && searchTerm.trim() !== "") {
      const searchTermLower = searchTerm.toLowerCase();
      return filteredProducts.filter((product: Product) => {
        const nameMatch = product.name.toLowerCase().includes(searchTermLower);
        const descriptionMatch = product.description
          ? product.description.toLowerCase().includes(searchTermLower)
          : false;

        return nameMatch || descriptionMatch;
      });
    }

    return filteredProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await fetchFromApi("products");
    return (
      products.find(
        (product: Product) => product.slug.toLowerCase() === slug.toLowerCase()
      ) || null
    );
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}
