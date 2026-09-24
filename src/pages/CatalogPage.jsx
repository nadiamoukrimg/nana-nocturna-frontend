import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../services/api.js";

function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <SiteHeader activePage="catalogo" />

      <main id="inicio">
        <section className="hero">
          <p className="eyebrow">Handmade ritual objects</p>
          <h1>The Collection</h1>
          <p>Objetos artesanales creados en el atelier de Nana Nocturna.</p>
        </section>

        <section className="catalog-section" id="catalogo">
          <div className="section-heading">
            <p className="eyebrow">Piezas de la colección</p>
            <h2>Catálogo</h2>
          </div>
          {isLoading && <p className="notice" role="status">Cargando piezas…</p>}
          {!isLoading && error && <p className="notice notice--error" role="alert">No se pudieron cargar las piezas: {error}</p>}
          {!isLoading && !error && products.length === 0 && <p className="notice">Todavía no hay piezas en el catálogo.</p>}
          {!isLoading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          )}
        </section>

      </main>

      <footer className="site-footer">Nana Nocturna · Piezas artesanales</footer>
    </>
  );
}

export default CatalogPage;
