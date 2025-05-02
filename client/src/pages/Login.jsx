import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div
      className="login-container"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          backdropFilter: "blur(7px)",
          padding: "3rem 2rem",
          transition: "transform 0.2s",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "2rem",
            background: "linear-gradient(90deg, #1a237e, #0d47a1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{
                width: "100%",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                border: "2px solid #e0e0e0",
                fontSize: "1rem",
                transition: "all 0.3s",
                outline: "none",
                "&:focus": {
                  borderColor: "#1976d2",
                },
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                width: "100%",
                padding: "1rem 1.5rem",
                borderRadius: "12px",
                border: "2px solid #e0e0e0",
                fontSize: "1rem",
                transition: "all 0.3s",
                outline: "none",
                "&:focus": {
                  borderColor: "#1976d2",
                },
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#d32f2f",
                background: "#ffebee",
                padding: "1rem",
                borderRadius: "10px",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem",
              background: "linear-gradient(90deg, #1a237e 0%, #0d47a1 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s, opacity 0.2s",
              opacity: loading ? 0.7 : 1,
              transform: loading ? "scale(0.98)" : "scale(1)",
              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.2)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            color: "#666",
            fontSize: "0.95rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#1a237e",
              fontWeight: "600",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
