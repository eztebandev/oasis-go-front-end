import { Product } from "../types";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, removeFromCart } = useCart();
  const isInCart = cart.some(item => item.id === product.id);

  // Función para verificar si el producto está disponible según el horario
  const isAvailableNow = () => {
    console.log('[Debug Schedule]', {
      productName: product.name,
      hasSchedule: Boolean(product.schedule),
      scheduleValue: product.schedule,
      productKeys: Object.keys(product)
    });

    // Si no hay schedule, el producto está siempre disponible
    if (!product.schedule) {
      console.log('[Schedule no encontrado para]', product.name);
      return true;
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentMinutes = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = product.schedule.start.split(':').map(Number);
    const [endHour, endMinute] = product.schedule.end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    console.log('[Horario]', {
      producto: product.name,
      horaActual: `${currentHour}:${currentMinute}`,
      minutosActuales: currentMinutes,
      horaInicio: product.schedule.start,
      minutosInicio: startMinutes,
      horaFin: product.schedule.end,
      minutosFin: endMinutes,
      disponible: currentMinutes >= startMinutes && currentMinutes <= endMinutes
    });

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  };

  console.log('[DISPONIBLE]', isAvailableNow());

  const isEnabled = isAvailableNow();

  return (
    <div 
      className={`border rounded-lg p-4 shadow-md cursor-pointer transition-all duration-200
        ${isInCart ? "bg-white border-primary" : "bg-transparent"}
        ${!isEnabled ? "opacity-50 cursor-not-allowed border-none" : "hover:scale-105"}`}
      onClick={() => {
        if (!isEnabled) return;
        
        if (isInCart) {
          removeFromCart(product.id);
        } else {
          addToCart(product);
        }
      }}
    >
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-36 object-contain rounded" 
      />
      <h2 className={`text-xl font-bold mt-2 ${isEnabled ? 'text-white' : 'text-gray-500'}`}>
        {product.name}
      </h2>
      <p className={`text-sm ${isEnabled ? 'text-white' : 'text-gray-400'}`}>
        {product.size}
      </p>
      <p className={`mt-2 font-bold ${isEnabled ? 'text-white' : 'text-gray-500'}`}>
        S/. {product.price.toFixed(2)}
      </p>
      {!isEnabled && product.schedule && (
        <p className="text-xs text-gray-500 mt-2">
          Disponible de {product.schedule.start} a {product.schedule.end}
        </p>
      )}
    </div>
  );
}


  