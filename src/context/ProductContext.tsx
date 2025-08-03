import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductService } from '../services/productService';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await ProductService.getProducts();
    if (result.success && result.data) {
      setProducts(result.data);
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    ProductService.updateProduct(updatedProduct.id, updatedProduct).then(result => {
      if (result.success) {
        loadProducts();
      }
    });
  };

  const addProduct = (newProduct: Product) => {
    ProductService.createProduct(newProduct).then(result => {
      if (result.success) {
        loadProducts();
      }
    });
  };

  const deleteProduct = (productId: string) => {
    ProductService.deleteProduct(productId).then(result => {
      if (result.success) {
        loadProducts();
      }
    });
  };

  const refreshProducts = () => {
    loadProducts();
  };

  const value: ProductContextType = {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    refreshProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};