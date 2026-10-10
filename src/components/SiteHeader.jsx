import { Link, useNavigate } from "react-router-dom";

function SiteHeader({ activePage }) {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
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