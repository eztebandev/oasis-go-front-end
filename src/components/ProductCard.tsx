import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img src={product.image} alt={product.name} className="w-full h-36 object-contain rounded" />
      <h2 className="text-xl font-bold mt-2">{product.name}</h2>
      <p className="text-gray-600">${product.price}</p>
      <button
        className="bg-primary text-white px-4 py-2 mt-2 rounded hover:bg-primaryDark"
        onClick={() => addToCart(product)}
      >
        Agregar al carrito
      </button>
    </div>
  );
}


  