export interface Schedule {
  start: string;  // formato "HH:mm"
  end: string;    // formato "HH:mm"
}

export interface Product {
    id: number;
    name: string;
    size: string;
    price: number;
    image: string;
    categoryId: number;
    company: string;
    enabled: boolean;
    visibility: boolean;
    schedule?: Schedule;
}

export interface PackProduct {
    productId: number;
    quantity: number;
}

export interface Pack {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    products: PackProduct[];
    enabled: boolean;
    visibility: boolean;
}

export interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
}
  