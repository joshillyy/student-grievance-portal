
import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react";
import { apiRequest } from "./api";
import "./Auth.css";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify(form),
        });

        setMessage("Registration successful! Please log in.");
        setIsRegister(false);
        setForm({ name: "", email: form.email, password: "" });
      } else {
        const data = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        onLogin(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <ShieldCheck size={31} />
          <span>GrievancePortal</span>
        </div>

        <div className="auth-hero">
          <span className="auth-eyebrow">STUDENT SUPPORT CENTER</span>
          <h1>Your voice matters. We're here to listen.</h1>
          <p>
            A secure and transparent platform to raise concerns,
            track progress, and help build a better campus.
          </p>
          <div className="auth-feature">
            <ShieldCheck size={20} />
            <div>
              <strong>Safe and secure</strong>
              <span>Your account and grievances stay protected.</span>
            </div>
          </div>
          <div className="auth-feature">
            <ArrowRight size={20} />
            <div>
              <strong>Transparent tracking</strong>
              <span>Follow your grievance from submission to resolution.</span>
            </div>
          </div>
        </div>

        <p className="auth-copyright">
          © 2026 Student Grievance Redressal Portal
        </p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <ShieldCheck size={27} />
            <strong>GrievancePortal</strong>
          </div>

          <span className="form-eyebrow">
            {isRegister ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}
          </span>

          <h2>
            {isRegister ? "Join the portal" : "Sign in to your account"}
          </h2>

          <p className="auth-subtitle">
            {isRegister
              ? "Create your student account to get started."
              : "Enter your details to access your student dashboard."}
          </p>

          {error && <div className="auth-alert error">{error}</div>}
          {message && <div className="auth-alert success">{message}</div>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <label className="auth-field">
                Full name
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className="auth-field">
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="auth-field">
              Password
              <div className="password-input-wrap">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateField}
                  placeholder="At least 8 characters"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  minLength={isRegister ? 8 : undefined}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button className="auth-submit" disabled={loading} type="submit">
              {loading
                ? "Please wait..."
                : isRegister
                ? "Create account"
                : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New to the portal?"}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setMessage("");
              }}
              type="button"
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>

          <p className="auth-security">
            <ShieldCheck size={15} />
            Secure student authentication
          </p>
        </div>
      </section>
    </main>
  );
}

export default Auth;
