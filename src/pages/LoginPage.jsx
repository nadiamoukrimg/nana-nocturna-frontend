import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api.js";
import SiteHeader from "../components/SiteHeader.jsx";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser(form);

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader activePage="login" />

      <main className="create-page">
        <section className="create-section">
          <div className="section-heading">
            <p className="eyebrow">Acceso de gestión</p>
            <h1>Iniciar sesión</h1>
            <p>Accede para crear y gestionar las piezas de la colección.</p>
          </div>

          {error && (
            <p className="notice notice--error" role="alert">
              No se pudo iniciar sesión: {error}
            </p>
          )}

          <form className="product-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Contraseña
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <button
              className="submit-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Comprobando…" : "Iniciar sesión"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default LoginPage;