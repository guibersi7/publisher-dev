import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <h1>Página Inicial</h1>
      <p>Bem-vindo ao Publisher Dev!</p>
      <div className="navigation-links">
        <Link to="/about" className="nav-link">
          Sobre nós
        </Link>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
