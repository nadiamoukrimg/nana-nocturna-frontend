function SiteHeader({ activePage }) {
  return (
    <header className="site-header">
      <a className="site-logo" href="/index.html">Nana Nocturna</a>
      <nav aria-label="Navegación principal">
        <a href="/index.html" aria-current={activePage === "catalogo" ? "page" : undefined}>
          Catálogo
        </a>
        <a
          href="/crear.html"
          target={activePage === "catalogo" ? "_blank" : undefined}
          rel={activePage === "catalogo" ? "noreferrer" : undefined}
          aria-current={activePage === "crear" ? "page" : undefined}
        >
          Crear pieza
        </a>
      </nav>
    </header>
  );
}

export default SiteHeader;
