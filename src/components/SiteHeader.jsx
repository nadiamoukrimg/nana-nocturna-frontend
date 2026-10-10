import { Link, useNavigate } from "react-router-dom";

function SiteHeader({ activePage }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
const isAdmin = user?.rol === "admin";
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="site-header">
      <Link className="site-logo" to="/">
        Nana Nocturna
      </Link>

      <nav aria-label="Navegación principal">
        <Link
          to="/"
          aria-current={activePage === "catalogo" ? "page" : undefined}
        >
          Catálogo
        </Link>

        {isLoggedIn ? (
          <>
          {isAdmin && (
            <Link
              to="/crear"
              target={activePage === "catalogo" ? "_blank" : undefined}
              rel={
                activePage === "catalogo"
                  ? "noopener noreferrer"
                  : undefined
              }
              aria-current={activePage === "crear" ? "page" : undefined}
            >
              Crear pieza
            </Link>
          )}
            <button type="button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            aria-current={activePage === "login" ? "page" : undefined}
          >
            Iniciar sesión
          </Link>
        )}
      </nav>
    </header>
  );
}

export default SiteHeader;