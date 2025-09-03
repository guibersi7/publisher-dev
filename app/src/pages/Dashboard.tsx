import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Área administrativa do Publisher Dev</p>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Estatísticas</h3>
          <p>Conteúdo publicado: 42</p>
          <p>Usuários ativos: 15</p>
        </div>
        <div className="dashboard-card">
          <h3>Ações rápidas</h3>
          <button className="btn">Novo conteúdo</button>
          <button className="btn">Gerenciar usuários</button>
        </div>
      </div>
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
