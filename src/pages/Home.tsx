import ProductCard from "../components/ProductCard";
import { Product } from "../types";
import { Category } from "../types";
import { useState } from "react";
import productosData from "../assets/productos_oasis.json";
import FloatingCart from "../components/FloatingCart";
import { useCart } from "../context/CartContext";
import packsData from "../assets/packs_oasis.json";
import PackCard from "../components/PackCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const products: Product[] = productosData.map((producto: Product) => ({
  id: producto.id,
  name: producto.name,
  size: producto.size,
  price: producto.price,
  image: producto.image,
  categoryId: producto.categoryId,
  company: producto.company,
  enabled: producto.enabled,
  visibility: producto.visibility,
  schedule: producto.schedule
}));

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

  const { cart } = useCart();

  const categoryFilteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  const categoryFilteredPacks = selectedCategory
    ? packsData.filter((pack) => pack.categoryId.includes(selectedCategory))
    : packsData;

  const filteredProducts = categoryFilteredProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.visibility === true
  );

  const filteredPacks = categoryFilteredPacks.filter((pack) =>
    pack.name.toLowerCase().includes(searchQuery.toLowerCase()) && pack.visibility === true
  );

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
    
    const total = cart.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: S/. ${total.toFixed(2)}`;
    
    return encodeURIComponent(message);
  };

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
          placeholder="Busca tus productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryLight"
        />
      </div>

      {/* Packs */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Packs</h1>
        
        {/* Carousel para móviles / Grid para desktop */}
        <div className="block sm:hidden"> {/* Móvil */}
          {filteredPacks.length > 0 ? (
            <div className="relative">
              {/* Indicador de swipe */}
              <div className="absolute -top-8 right-0 flex items-center text-gray-500 text-sm">
                <span>Desliza</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1 animate-bounce-x" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </div>

              <Slider
                dots={true}
                infinite={false}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                arrows={false}
                className="pack-slider"
              >
                {filteredPacks.map((pack) => (
                  <div key={pack.id} className="px-2">
                    <PackCard pack={pack} products={products} />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No hay packs que coincidan con tu búsqueda.
            </p>
          )}
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> {/* Desktop */}
          {filteredPacks.length > 0 ? (
            filteredPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} products={products} />
            ))
          ) : (
            <p className="col-span-2 md:col-span-4 text-center text-gray-500">
              No hay packs que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </div>

      {/* Productos Filtrados */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">Selecciona los productos que desees</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="col-span-2 md:col-span-4 text-center text-gray-500">
              No hay productos que coincidan con tu búsqueda.
            </p>
          )}
        </div>
      </div>

      {/* Botón de WhatsApp */}
      <a
        href={`https://wa.me/51918647161?text=${generateWhatsAppMessage()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-2 w-16 h-16 rounded-full shadow-lg 
          hover:bg-green-600 transition-all duration-300 z-50 flex items-center justify-center 
          animate-[pulse_1.5s_ease-in-out_infinite] hover:animate-none transform hover:scale-110 active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-12 h-12 fill-current"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>

      {/* Carrito flotante */}
      <FloatingCart />
    </div>
  );
}


