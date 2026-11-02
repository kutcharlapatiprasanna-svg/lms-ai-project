import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authservice } from "../../services/authServices";

export default function ActivateUser() {
  const location = useLocation();
  const navigate = useNavigate();

  const activationToken = location.state?.activationToken;
  const activationCode = location.state?.activationCode;

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!activationToken) {
      setMessage("Activation details are missing. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setMessage("Enter the 6-digit activation code.");
      return;
    }

    setLoading(true);

    try {
      const result = await authservice.activate({
        activationToken,
        activationCode: code,
      });

      setMessage(result.message || "Account activated successfully.");

      // Navigate only after the API confirms success.
      navigate("/auth/login", {
        replace: true,
        state: { message: result.message || "Account activated successfully." },
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to activate your account."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!activationToken) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>Activation details missing</h1>
          <p>Please register again to receive an activation code.</p>
          <Link to="/auth/register">Go to Register</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <h1>Activate Account</h1>
          <p>Enter the activation code from your registration response.</p>
        </div>

        {activationCode && (
          <p className="demo-code">
            Demo code: <strong>{activationCode}</strong>
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="activation-code">Activation code</label>
            <input
              id="activation-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              required
            />
          </div>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          <button className="auth-button" disabled={loading}>
            {loading ? "Activating..." : "Activate Account"}
          </button>
        </form>
      </section>
    </main>
  );
}