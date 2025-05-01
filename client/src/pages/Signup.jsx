import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.92)",
          borderRadius: 22,
          boxShadow: "0 10px 40px 0 rgba(80, 102, 144, 0.18)",
          backdropFilter: "blur(8px)",
          padding: "3rem 2.2rem 2.2rem 2.2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            fontWeight: 900,
            marginBottom: "2rem",
            fontSize: "2.2rem",
            textAlign: "center",
            background: "linear-gradient(90deg, #7f53ac, #647dee 80%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
          }}
        >
          Create Your Account
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1.3rem",
          }}
        >
          <div>
            <label
              style={{
                fontWeight: 700,
                color: "#5a5a89",
                marginBottom: "0.4rem",
                display: "block",
                fontSize: "1rem",
              }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.85rem 1.1rem",
                borderRadius: 10,
                border: "1.7px solid #d1c4e9",
                fontSize: "1.05rem",
                background: "rgba(255,255,255,0.85)",
                transition: "border-color 0.2s",
                outline: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontWeight: 700,
                color: "#5a5a89",
                marginBottom: "0.4rem",
                display: "block",
                fontSize: "1rem",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.85rem 1.1rem",
                borderRadius: 10,
                border: "1.7px solid #d1c4e9",
                fontSize: "1.05rem",
                background: "rgba(255,255,255,0.85)",
                transition: "border-color 0.2s",
                outline: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontWeight: 700,
                color: "#5a5a89",
                marginBottom: "0.4rem",
                display: "block",
                fontSize: "1rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.85rem 1.1rem",
                borderRadius: 10,
                border: "1.7px solid #d1c4e9",
                fontSize: "1.05rem",
                background: "rgba(255,255,255,0.85)",
                transition: "border-color 0.2s",
                outline: "none",
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontWeight: 700,
                color: "#5a5a89",
                marginBottom: "0.4rem",
                display: "block",
                fontSize: "1rem",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.85rem 1.1rem",
                borderRadius: 10,
                border: "1.7px solid #d1c4e9",
                fontSize: "1.05rem",
                background: "rgba(255,255,255,0.85)",
                transition: "border-color 0.2s",
                outline: "none",
              }}
            />
          </div>
          {error && (
            <div
              style={{
                color: "#d7263d",
                background: "#ffe3e3",
                padding: "0.85rem 1.1rem",
                borderRadius: 8,
                marginTop: "0.2rem",
                fontSize: "1rem",
                fontWeight: 600,
                border: "1px solid #f8bbd0",
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
              marginTop: "1.2rem",
              padding: "1rem 0",
              background: "linear-gradient(90deg, #7f53ac 0%, #647dee 100%)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.15rem",
              border: "none",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s, transform 0.2s, opacity 0.2s",
              boxShadow: "0 4px 18px rgba(100, 125, 222, 0.13)",
              opacity: loading ? 0.7 : 1,
              transform: loading ? "scale(0.98)" : "scale(1)",
              letterSpacing: "0.5px",
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div
          style={{
            marginTop: "1.7rem",
            color: "#6a6a8e",
            fontSize: "1.02rem",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#7f53ac",
              fontWeight: 700,
              textDecoration: "underline",
              marginLeft: "0.25rem",
              transition: "color 0.2s",
            }}
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
