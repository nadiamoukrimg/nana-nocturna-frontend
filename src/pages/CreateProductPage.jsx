import { useState } from "react";
import ProductForm from "../components/ProductForm.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import { createProduct } from "../services/api.js";

function CreateProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleCreate(product) {
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await createProduct(product);
      setSuccess(true);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader activePage="crear" />
      <main className="create-page">
        <section className="create-section" aria-labelledby="create-title">
          <div className="section-heading">
            <p className="eyebrow">Añadir a la colección</p>
            <h1 id="create-title">Crear pieza</h1>
            <p>Completa los datos para guardar una nueva pieza en el catálogo.</p>
          </div>
          {error && <p className="notice notice--error" role="alert">No se pudo crear la pieza: {error}</p>}
          {success && (
            <p className="notice notice--success" role="status">
              La pieza se ha creado. <a href="/index.html">Volver al catálogo para verla</a>.
            </p>
          )}
          <ProductForm onCreate={handleCreate} isSubmitting={isSubmitting} />
        </section>
      </main>
      <footer className="site-footer">Nana Nocturna · Piezas artesanales</footer>
    </>
  );
}

export default CreateProductPage;
