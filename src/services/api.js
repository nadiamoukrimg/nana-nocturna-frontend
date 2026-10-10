const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  if (!API_URL) {
    throw new Error("Falta configurar VITE_API_URL en el archivo .env.local.");
  }

  const response = await fetch(`${API_URL.replace(/\/$/, "")}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.error?.message || result.message || "No se pudo completar la petición.",
    );
  }

  return result.data;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function loginUser(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getProducts() {
  return request("/products");
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function createProduct(product) {
  return request("/products", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return request(`/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}