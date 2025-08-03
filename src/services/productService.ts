import { Product } from '../types';

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ProductService {
  private static STORAGE_KEY = 'products';

  static async getProducts(): Promise<ServiceResponse<Product[]>> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const products = stored ? JSON.parse(stored) : [];
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: 'Failed to load products' };
    }
  }

  static async createProduct(product: Product): Promise<ServiceResponse<Product>> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const products = stored ? JSON.parse(stored) : [];
      
      const newProduct = {
        ...product,
        id: Date.now().toString(),
        rating: 4.5,
        reviews: 0
      };
      
      products.push(newProduct);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      
      return { success: true, data: newProduct };
    } catch (error) {
      return { success: false, error: 'Failed to create product' };
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<ServiceResponse<Product>> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const products = stored ? JSON.parse(stored) : [];
      
      const index = products.findIndex((p: Product) => p.id === id);
      if (index === -1) {
        return { success: false, error: 'Product not found' };
      }
      
      products[index] = { ...products[index], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      
      return { success: true, data: products[index] };
    } catch (error) {
      return { success: false, error: 'Failed to update product' };
    }
  }

  static async deleteProduct(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const products = stored ? JSON.parse(stored) : [];
      
      const filteredProducts = products.filter((p: Product) => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProducts));
      
      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete product' };
    }
  }
}