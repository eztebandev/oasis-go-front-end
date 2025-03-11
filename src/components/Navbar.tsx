import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-primary p-4 text-white">
      <div className="w-full flex justify-between px-6 items-center">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={()=> navigate("/")}>Oasis</h1>
        <div className="invisible">
          <Link to="/cart" className="bg-white text-primary px-4 py-2 rounded">
            🛒 Carrito
          </Link>
        </div>
        <div>
          Horario de atención: 6:00 pm a 12:00 am
        </div>
      </div>
    </nav>
  );
}
