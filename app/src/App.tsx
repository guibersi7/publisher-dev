import "./App.css";
import Navigation from "./components/Navigation";
import AppRoutes from "./routes";
import "./styles/app.css";
import "./styles/navigation.css";
import "./styles/pages.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <Navigation />
      </header>

      <main className="app-main">
        <AppRoutes />
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Publisher Dev. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
