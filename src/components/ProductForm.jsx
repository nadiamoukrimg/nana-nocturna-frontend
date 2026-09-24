import { useState } from "react";

const initialForm = {
  nombre: "",
  descripcion: "",
  categoria: "",
  precio: "",
  estado: "disponible",
  disponible: true,
  imagen: "",
  imagenesGaleria: "",
  materiales: "",
  medidas: "",
  coleccion: "",
  creadoPor: "Nadia",
  piezaUnica: false,
  personalizable: false,
};

function splitList(value) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ProductForm({ onCreate, isSubmitting }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const newProduct = {
      ...form,
      precio: Number(form.precio),
      imagenesGaleria: splitList(form.imagenesGaleria),
      materiales: splitList(form.materiales),
    };

    const created = await onCreate(newProduct);
    if (created) setForm(initialForm);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input name="nombre" value={form.nombre} onChange={handleChange} required />
      </label>
      <label>
        Descripción
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required rows="3" />
      </label>
      <div className="form-row">
        <label>
          Categoría
          <input name="categoria" value={form.categoria} onChange={handleChange} required />
        </label>
        <label>
          Precio (€)
          <input name="precio" type="number" min="0" step="1" value={form.precio} onChange={handleChange} required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Estado
          <input name="estado" value={form.estado} onChange={handleChange} required />
        </label>
        <label>
          Colección
          <input name="coleccion" value={form.coleccion} onChange={handleChange} required />
        </label>
      </div>
      <label>
        Nombre de la imagen principal
        <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="Ej.: pieza1.jpeg" required />
      </label>
      <label>
        Imágenes de galería (separadas por comas)
        <textarea name="imagenesGaleria" value={form.imagenesGaleria} onChange={handleChange} rows="2" required />
      </label>
      <label>
        Materiales (separados por comas)
        <textarea name="materiales" value={form.materiales} onChange={handleChange} rows="2" required />
      </label>
      <label>
        Medidas
        <input name="medidas" value={form.medidas} onChange={handleChange} required />
      </label>
      <label>
        Creado por
        <input name="creadoPor" value={form.creadoPor} onChange={handleChange} required />
      </label>
      <div className="form-options">
        <label><input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} /> Disponible</label>
        <label><input type="checkbox" name="piezaUnica" checked={form.piezaUnica} onChange={handleChange} /> Pieza única</label>
        <label><input type="checkbox" name="personalizable" checked={form.personalizable} onChange={handleChange} /> Personalizable</label>
      </div>
      <button className="submit-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando…" : "Crear pieza"}
      </button>
    </form>
  );
}

export default ProductForm;
