import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          Publisher Dev
        </Link>
      </div>

      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Início
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/about"
            className={`nav-link ${isActive("/about") ? "active" : ""}`}
          >
            Sobre
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/dashboard"
            className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            Dashboard
          </Link>
        </li>
      </ul>
    </nav>
  );
}
