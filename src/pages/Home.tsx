import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { Category } from "../types";
import { useState } from "react";

const products: Product[] = [
  { 
    id: 1, 
    name: "Flor de Caña",
    size: "750ml", 
    price: 42.50, 
    image: "https://oasis-go-bucket.s3.us-east-1.amazonaws.com/products/01.png", 
    categoryId: 1,
    company: "Flor",
    enabled: true
  },
  { 
    id: 2, 
    name: "Vino Queirolo", 
    size: "750ml",
    price: 20, 
    image: "https://oasis-go-bucket.s3.us-east-1.amazonaws.com/products/02.png", 
    categoryId: 1, 
    company: "Flor",
    enabled: true 
  },
  { 
    id: 3, 
    name: "",
    size: "",
    price: 20, 
    image: "https://oasis-go-bucket.s3.us-east-1.amazonaws.com/products/.png", 
    categoryId: 1, 
    company: "",
    enabled: false 
  },
  { 
    id: 2, 
    name: "",
    size: "",
    price: 20, 
    image: "https://oasis-go-bucket.s3.us-east-1.amazonaws.com/products/.png", 
    categoryId: 1, 
    company: "",
    enabled: false 
  }
];

const categories: Category[] = [
  {
    id: 1,
    name: "Licores, bebidas y snacks",
    description: "Últimos gadgets y dispositivos electrónicos.",
    image: "https://oasis-go-bucket.s3.us-east-1.amazonaws.com/categories/bebidas-snack-licores.png",
  },
  {
    id: 2,
    name: "Comidas",
    description: "Las últimas tendencias en ropa y accesorios.",
    image: "https://oasis-go-bucket.s3.us-east-1.amazonaws.com/categories/comidas.png",
  },
];

export default function Home() {

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categoryFilteredProducts = selectedCategory
  ? products.filter((p) => p.categoryId === selectedCategory)
  : products;

  const filteredProducts = categoryFilteredProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col justify-start">
      {/* Categorías */}
      <div className="w-full container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transition transform hover:scale-105 ${
              selectedCategory === category.id ? "border-2 border-primaryLight" : ""
            }`}
            onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
          >
            <div className="w-1/2 p-6">
              <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
            </div>
            <div className="w-1/2">
              <img src={category.image} alt={category.name} className="w-full h-36 object-contain" />
            </div>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div className="container mx-auto px-6 mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight"
        />
      </div>

      {/* Productos Filtrados */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="col-span-2 md:col-span-3 text-center text-gray-500">
              No hay productos que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


