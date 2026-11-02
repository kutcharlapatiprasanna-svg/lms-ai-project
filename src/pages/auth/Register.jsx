
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authservice } from "../../services/authServices";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (formData.password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await authservice.register(formData);

      // Support the API's snake_case fields and camelCase alternatives.
      const activationToken =
        response?.activation_token ??
        response?.activationToken ??
        response?.data?.activation_token ??
        response?.data?.activationToken;

      const activationCode =
        response?.activation_code ??
        response?.activationCode ??
        response?.data?.activation_code ??
        response?.data?.activationCode;

      if (!activationToken || !activationCode) {
        setMessage(
          response?.message ||
            "Registration response is missing activation details."
        );
        return;
      }

      navigate("/auth/activate", {
        state: {
          activationToken,
          activationCode,
        },
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <h1>Create Account</h1>
          <p>Register to get started.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {message && (
            <p className="form-message error" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/auth/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
