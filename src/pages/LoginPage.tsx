import React, { useState } from "react";
import { JSX } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom"; 
import "../pages/LoginPage.css";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginForm(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.email) return "Preencha o e-mail.";
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRe.test(form.email)) return "E-mail inválido.";
    if (!form.password) return "Preencha a senha.";
    return null;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Usuário ou senha inválidos.");
        } else {
          setError("Erro ao conectar com o servidor.");
        }
        return;
      }

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");

    } catch {
      setError("Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <form onSubmit={onSubmit}>
          <label className="login-label">
            E-mail
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              className="login-input"
            />
          </label>

          <label className="login-label">
            Senha
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              className="login-input"
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
