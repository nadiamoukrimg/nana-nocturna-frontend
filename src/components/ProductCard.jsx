const imageOverrides = {
  "Sacred Wound": "Sacred Wound/Sacred Wound1.JPG",
  "Hushed Fae": "Hushed Fae/Hushed Fae1.JPG",
  "Sacred Offering": "Sacred Offering/Sacred Offering.jpeg",
  Luneth: "Luneth.png",
  "Thorned Mourning": "Thorned Mourning/Thorned Mourning2.jpeg",
};

function ProductCard({ product }) {
  const imagePath = imageOverrides[product.nombre] || `${product.nombre}/${product.imagen}`;
  const imageUrl = `/assets/img/${imagePath.split("/").map(encodeURIComponent).join("/")}`;
  const status = product.estado || (product.disponible ? "disponible" : "no disponible");

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          className="product-card__image"
          src={imageUrl}
          alt={product.nombre}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/assets/img/hero.jpeg";
          }}
        />
        <span className="product-card__status">{status}</span>
      </div>
      <div className="product-card__content">
        <p className="product-card__category">{product.categoria}</p>
        <h2>{product.nombre}</h2>
        <p className="product-card__description">{product.descripcion}</p>
        <p className="product-card__price">{product.precio} €</p>
      </div>
    </article>
  );
}

export default ProductCard;
