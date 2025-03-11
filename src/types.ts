export interface Product {
    id: number;
    name: string;
    size: string;
    price: number;
    image: string;
    categoryId: number;
    company: string;
    enabled: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}
  