import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import { getProductById } from "../services/api.js";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getProductById(id)
      .then((data) => {
        if (isMounted) setProduct(data);
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
  }, [id]);

  if (isLoading) {
    return <p className="notice">Cargando pieza…</p>;
  }

  if (error) {
    return <p className="notice notice--error">No se pudo cargar la pieza: {error}</p>;
  }

  if (!product) {
    return <p className="notice">No se encontró la pieza.</p>;
  }

  const gallery = Array.isArray(product.imagenesGaleria)
    ? product.imagenesGaleria.join(", ")
    : "—";

  const materials = Array.isArray(product.materiales)
    ? product.materiales.join(", ")
    : "—";

  return (
    <>
      <SiteHeader activePage="producto" />

      <main className="create-page">
        <section className="create-section">
          <Link to="/">← Volver al catálogo</Link>

          <div className="section-heading">
            <p className="eyebrow">{product.categoria}</p>
            <h1>{product.nombre}</h1>
            <p>{product.descripcion}</p>
          </div>

          <dl>
            <dt>Precio</dt>
            <dd>{product.precio} €</dd>

            <dt>Estado</dt>
            <dd>{product.estado}</dd>

            <dt>Disponible</dt>
            <dd>{product.disponible ? "Sí" : "No"}</dd>

            <dt>Medidas</dt>
            <dd>{product.medidas}</dd>

            <dt>Materiales</dt>
            <dd>{materials}</dd>

            <dt>Colección</dt>
            <dd>{product.coleccion}</dd>

            <dt>Imagen principal</dt>
            <dd>{product.imagen}</dd>

            <dt>Imágenes de galería</dt>
            <dd>{gallery}</dd>

            <dt>Pieza única</dt>
            <dd>{product.piezaUnica ? "Sí" : "No"}</dd>

            <dt>Personalizable</dt>
            <dd>{product.personalizable ? "Sí" : "No"}</dd>

            <dt>Creada por</dt>
            <dd>{product.creadoPor}</dd>

            <dt>Fecha de creación</dt>
            <dd>{product.fechaCreacion}</dd>
          </dl>
        </section>
      </main>
    </>
  );
}

export default ProductDetailPage;