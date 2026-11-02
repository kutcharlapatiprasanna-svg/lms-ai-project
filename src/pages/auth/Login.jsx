
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// import {
//   authService,
//   getUserRole,
// } from "../../services/authService";

import useAuth from "../../hooks/useAuth";
import { authservice, getUserRole } from "../../services/authServices";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(
    location.state?.message || ""
  );

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
    setLoading(true);
 
    try {
      // Send login details to the existing API.
      const response = await authservice.login(formData);

      // Support common API response structures.
      const data = response?.data ?? response;

      const token =
        data?.token ??
        data?.access_token ??
        data?.accessToken ??
        data?.data?.token ??
        data?.data?.access_token ??
        data?.data?.accessToken;

      const user =
        data?.user ??
        data?.data?.user ??
        data?.data?.userData ??
        data?.userData ??
        null;

      if (!token) {
        throw new Error(
          "Login response did not contain an authentication token."
        );
      }

      // Update the shared AuthContext.
      login({ token, user });

      const role = getUserRole(user);

      if (
        role?.toLowerCase() === "admin" ||
        role?.toLowerCase() === "administrator"
      ) {
        navigate("/admin/admin-dashboard", {
          replace: true,
        });
      } else {
        const destination =
          location.state?.from?.pathname || "/";

        navigate(destination, {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <div className="auth-logo">S</div>

          <h1>Welcome Back!</h1>
          <p>Enter your details to log in.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
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
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {message && (
            <p
              className="form-message error"
              role="alert"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/auth/register">Register</Link>
        </p>
      </section>
    </main>
  );
}

