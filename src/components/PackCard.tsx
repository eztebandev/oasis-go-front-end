import { Pack, Product } from "../types";
import { useCart } from "../context/CartContext";

interface PackCardProps {
  pack: Pack;
  products: Product[];
}

export default function PackCard({ pack, products }: PackCardProps) {
  const { cart, addToCart, removeFromCart } = useCart();
  const packUniqueId = pack.id + 10000;
  const isInCart = cart.some(item => item.id === packUniqueId);

  const packProducts = pack.products.map(packProduct => {
    const product = products.find(p => p.id === packProduct.productId);
    if (!product) return null;
    return {
      productId: packProduct.productId,
      quantity: packProduct.quantity,
      product
    };
  }).filter((item): item is { productId: number; quantity: number; product: Product } => item !== null);

  const totalPrice = packProducts.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const isProductAvailable = (product: Product) => {
    if (!product.schedule) return true;
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentMinutes = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = product.schedule.start.split(':').map(Number);
    const [endHour, endMinute] = product.schedule.end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  const isPackAvailable = packProducts.every(item => isProductAvailable(item.product));

  return (
    <div 
      className={`border rounded-lg p-4 shadow-md transition-colors duration-200
        ${!isPackAvailable 
          ? "opacity-50 cursor-not-allowed" 
          : isInCart 
            ? "bg-white border-primary cursor-pointer" 
            : "bg-transparent cursor-pointer"
        }`}
      onClick={() => {
        if (!isPackAvailable) return;
        
        if (!isInCart) {
          addToCart({
            ...pack,
            id: packUniqueId,
            price: totalPrice,
            categoryId: 0,
            size: `Pack de ${packProducts.length} productos`,
            company: "Oasis",
            products: pack.products
          });
        } else {
          removeFromCart(packUniqueId);
        }
      }}
    >
      <img 
        src={pack.image} 
        alt={pack.name} 
        className="w-full h-36 object-contain rounded" 
      />
      <h2 className={`text-xl font-bold mt-2 transition-colors duration-200
        ${isInCart ? 'text-gray-800' : 'text-white'}`}>
        {pack.name}
      </h2>
      <p className={`text-sm transition-colors duration-200
        ${isInCart ? 'text-gray-600' : 'text-white/90'}`}>
        {pack.description}
      </p>
      <div className="mt-2 space-y-1">
        {packProducts.map((item, index) => (
          <p key={index} className={`text-sm transition-colors duration-200
            ${isInCart ? 'text-gray-600' : 'text-white/90'}`}>
            • {item.quantity}x {item.product.name} (S/. {item.product.price.toFixed(2)} c/u)
          </p>
        ))}
      </div>
      <p className={`mt-2 font-bold transition-colors duration-200
        ${isInCart ? 'text-primary' : 'text-white'}`}>
        S/. {totalPrice.toFixed(2)}
      </p>
    </div>
  );
} 