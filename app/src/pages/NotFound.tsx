import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page not-found">
      <h1>404 - Página não encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <div className="navigation-links">
        <Link to="/" className="nav-link">
          Voltar ao início
        </Link>
        <Link to="/about" className="nav-link">
          Sobre
        </Link>
      </div>
    </div>
  );
}
