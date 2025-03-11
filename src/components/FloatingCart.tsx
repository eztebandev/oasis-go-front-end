import { useCart } from "../context/CartContext";
import { useState } from "react";
import productosData from "../assets/productos_oasis.json";

export default function FloatingCart() {
  const { cart, updateQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const generateWhatsAppMessage = () => {
    let message = "Hola, quiero realizar una compra de:\n\n";
    
    cart.forEach(item => {
      // Verificar si es un pack (ID > 10000)
      if (item.id >= 10000 && item.products) {
        // Es un pack, desglosamos los productos
        message += `📦 ${item.name}:\n`;
        item.products.forEach(packProduct => {
          const product = productosData.find(p => p.id === packProduct.productId);
          if (product) {
            message += `   • ${packProduct.quantity}x ${product.name}\n`;
          }
        });
      } else {
        // Es un producto individual
        message += `• ${item.quantity}x ${item.name} ${item.size}\n`;
      }
    });
    
    message += `\nTotal: S/. ${total.toFixed(2)}`;
    
    return encodeURIComponent(message);
  };

  if (cart.length === 0) return null;

  return (
    <>
      {/* Botón del carrito */}
      <div className="fixed bottom-28 right-6 flex flex-col items-center">
        {/* Badge con el total */}
        <div className="bg-white px-2 py-1 rounded-full shadow-md border border-primary mb-1">
          <p className="text-primary text-sm font-bold">
            S/. {total.toFixed(2)}
          </p>
        </div>
        
        {/* Botón circular */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white p-2 w-16 h-16 rounded-full shadow-lg 
            hover:bg-primaryDark transition-all duration-300 flex items-center justify-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Modal del carrito */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Carrito</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Lista de productos */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                    <div>
                      <p className="font-semibold text-primary">{item.name}</p>
                      <p className="text-gray-600">S/. {item.price.toFixed(2)} c/u</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-primary"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-primary">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-primary"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total y Botón de WhatsApp */}
            <div className="mt-6 border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Total:</p>
                <p className="text-xl font-bold text-primary">S/. {total.toFixed(2)}</p>
              </div>
              
              <a
                href={`https://wa.me/51918647161?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 
                  hover:bg-green-600 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-6 h-6 fill-current"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span>Comprar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 