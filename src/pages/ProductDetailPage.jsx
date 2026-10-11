import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "../services/api.js";

const imageOverrides = {
  "Sacred Wound": "Sacred Wound/Sacred Wound1.jpeg",
  "Hushed Fae": "Hushed Fae/Hushed Fae1.jpeg",
  "Wilted Fae": "Wilted Fae/Wilted Fae5.jpeg",
  "Moonflower Reverie": "Moonflower Reverie/Moonflower Reverie1.jpeg",
  "Moonlit Seraph": "Moonlit Seraph/Moonlit Seraph1.jpeg",
  "Moonlit Revenant - prueba": "Moonlit Revenant/Moonlit Revenant1.jpeg",
  "Sacred Offering": "Sacred Offering/Sacred Offering.jpeg",
  Luneth: "Luneth.png",
  "Thorned Mourning": "Thorned Mourning/Thorned Mourning2.jpeg",
};

function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

    const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.rol === "admin";

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });

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

  function startEditing() {
  setEditForm({
    nombre: product.nombre || "",
    descripcion: product.descripcion || "",
    precio: product.precio ?? "",
  });
  setActionError("");
  setIsEditing(true);
}

function handleEditChange(event) {
  const { name, value } = event.target;
  setEditForm((current) => ({ ...current, [name]: value }));
}

async function handleUpdate(event) {
  event.preventDefault();
  setIsSaving(true);
  setActionError("");

  try {
    const mainImage = (product.imagen?.includes("/")
      ? product.imagen
      : imageOverrides[product.nombre] || `${product.nombre}/${product.imagen}`)
      .replace(/\.JPG$/, ".jpeg");

    const galleryImages = Array.isArray(product.imagenesGaleria)
      ? product.imagenesGaleria.map((image) =>
          (image.includes("/") ? image : `${product.nombre}/${image}`).replace(/\.JPG$/, ".jpeg")
        )
      : [];

    const updatedProduct = await updateProduct(id, {
      nombre: editForm.nombre.trim(),
      descripcion: editForm.descripcion.trim(),
      precio: Number(editForm.precio),
      imagen: mainImage,
      imagenesGaleria: galleryImages,
    });

    setProduct(updatedProduct);
    setIsEditing(false);
  } catch (error) {
    setActionError(error.message);
  } finally {
    setIsSaving(false);
  }
}

async function handleAvailabilityChange() {
  const disponible = !product.disponible;
  setIsSaving(true);
  setActionError("");

  try {
    const updatedProduct = await updateProduct(id, {
      disponible,
      estado: disponible ? "disponible" : "vendida",
    });

    setProduct(updatedProduct);
  } catch (error) {
    setActionError(error.message);
  } finally {
    setIsSaving(false);
  }
}

async function handleDelete() {
  const confirmed = window.confirm(
    `¿Seguro que quieres eliminar "${product.nombre}"?`
  );

  if (!confirmed) return;

  setIsSaving(true);
  setActionError("");

  try {
    await deleteProduct(id);
    navigate("/");
  } catch (error) {
    setActionError(error.message);
  } finally {
    setIsSaving(false);
  }
}

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

  const primaryImage = (product.imagen?.includes("/")
    ? product.imagen
    : imageOverrides[product.nombre] || `${product.nombre}/${product.imagen}`)
    .replace(/\.JPG$/, ".jpeg");
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
                  const galleryPath = (image.includes("/")
                    ? image
                    : `${product.nombre}/${image}`)
                    .replace(/\.JPG$/, ".jpeg");
                  const galleryUrl = `/assets/img/${galleryPath}`
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
              {actionError && (
                <p className="notice notice--error" role="alert">
                  {actionError}
                </p>
              )}

              {isAdmin && (
                <section className="product-detail__admin" aria-label="Gestión de la pieza">
                  {isEditing ? (
                    <form className="product-form" onSubmit={handleUpdate}>
                      <label>
                        Nombre
                        <input
                          name="nombre"
                          value={editForm.nombre}
                          onChange={handleEditChange}
                          required
                        />
                      </label>

                      <label>
                        Descripción
                        <textarea
                          name="descripcion"
                          value={editForm.descripcion}
                          onChange={handleEditChange}
                          rows="3"
                          required
                        />
                      </label>

                      <label>
                        Precio (€)
                        <input
                          name="precio"
                          type="number"
                          min="0"
                          step="1"
                          value={editForm.precio}
                          onChange={handleEditChange}
                          required
                        />
                      </label>

                      <div className="product-detail__admin-buttons">
                        <button className="submit-button" type="submit" disabled={isSaving}>
                          {isSaving ? "Guardando…" : "Guardar cambios"}
                        </button>

                        <button
                          className="admin-button"
                          type="button"
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="product-detail__admin-buttons">
                      <button
                        className="admin-button"
                        type="button"
                        onClick={startEditing}
                        disabled={isSaving}
                      >
                        Editar pieza
                      </button>

                      <button
                        className="admin-button"
                        type="button"
                        onClick={handleAvailabilityChange}
                        disabled={isSaving}
                      >
                        {product.disponible ? "Marcar como vendida" : "Marcar como disponible"}
                      </button>

                      <button
                        className="admin-button admin-button--delete"
                        type="button"
                        onClick={handleDelete}
                        disabled={isSaving}
                      >
                        Eliminar pieza
                      </button>
                    </div>
                  )}
                </section>
              )} 
          </div>
        </section>
      </main>
    </>
  );
}

export default ProductDetailPage;
