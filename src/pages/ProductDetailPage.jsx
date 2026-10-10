import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import { getProductById } from "../services/api.js";

const imageOverrides = {
  "Sacred Wound": "Sacred Wound/Sacred Wound1.JPG",
  "Hushed Fae": "Hushed Fae/Hushed Fae1.JPG",
  "Sacred Offering": "Sacred Offering/Sacred Offering.jpeg",
  Luneth: "Luneth.png",
  "Thorned Mourning": "Thorned Mourning/Thorned Mourning2.jpeg",
};

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

  const materials = Array.isArray(product.materiales)
    ? product.materiales.join(", ")
    : "—";

  const primaryImage = imageOverrides[product.nombre]
    || `${product.nombre}/${product.imagen}`;
  const imageUrl = `/assets/img/${primaryImage
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
  const galleryImages = Array.isArray(product.imagenesGaleria)
    ? product.imagenesGaleria
    : [];

  return (
    <>
      <SiteHeader activePage="producto" />

      <main className="product-detail-page">
        <Link className="product-detail__back" to="/">← Volver al catálogo</Link>

        <section className="product-detail" aria-labelledby="product-title">
          <div className="product-detail__media">
            <img
              className="product-detail__image"
              src={imageUrl}
              alt={product.nombre}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = "/assets/img/hero.jpeg";
              }}
            />
            {galleryImages.length > 0 && (
              <div className="product-detail__gallery" aria-label="Galería de imágenes">
                {galleryImages.map((image, index) => {
                  const galleryUrl = `/assets/img/${product.nombre}/${image}`
                    .split("/")
                    .map(encodeURIComponent)
                    .join("/");

                  return (
                    <img
                      key={`${image}-${index}`}
                      src={galleryUrl}
                      alt={`${product.nombre}, vista ${index + 2}`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="product-detail__info">
            <p className="eyebrow">{product.categoria} · {product.piezaUnica ? "Pieza única" : "Edición limitada"}</p>
            <h1 id="product-title">{product.nombre}</h1>
            <p className="product-detail__quote">Una pieza artesanal de Nana Nocturna.</p>
            <p className="product-detail__description">{product.descripcion}</p>

            <dl className="product-detail__facts">
              <div><dt>Materiales</dt><dd>{materials}</dd></div>
              <div><dt>Medidas</dt><dd>{product.medidas || "—"}</dd></div>
              <div><dt>Colección</dt><dd>{product.coleccion || "—"}</dd></div>
              <div><dt>Estado</dt><dd>{product.disponible ? "Disponible" : (product.estado || "Vendida")}</dd></div>
              <div><dt>Personalizable</dt><dd>{product.personalizable ? "Sí" : "No"}</dd></div>
              <div><dt>Creada por</dt><dd>{product.creadoPor || "Nana Nocturna"}</dd></div>
              <div><dt>Fecha de creación</dt><dd>{product.fechaCreacion || "—"}</dd></div>
            </dl>

            <div className="product-detail__purchase">
              <p className="product-detail__price">{product.precio} €</p>
              <p className="product-detail__availability">
                {product.disponible ? "Disponible en la colección" : "Esta pieza ya ha sido vendida"}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ProductDetailPage;
