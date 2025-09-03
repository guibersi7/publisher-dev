import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page">
      <h1>Sobre</h1>
      <p>Esta é a página sobre o projeto Publisher Dev.</p>
      <p>Um sistema moderno para gerenciamento de conteúdo e publicação.</p>
      <div className="navigation-links">
        <Link to="/" className="nav-link">
          Voltar ao início
        </Link>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
