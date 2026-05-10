import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/signin", { email, password });
      const { user, token } = response.data;
      login(user, token);
      
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "THEATRE_OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ width: "100%", maxWidth: "450px", padding: "3rem" }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>Welcome Back</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "2rem" }}>
          Sign in to your BuyPass account
        </p>

        {error && (
          <div className="glass" style={{ 
            backgroundColor: "rgba(239, 68, 68, 0.1)", 
            borderColor: "var(--danger)",
            color: "var(--danger)",
            padding: "1rem",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ position: "relative" }}>
            <Mail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={20} />
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass"
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3.5rem",
                fontSize: "1rem",
                color: "var(--text-primary)",
                outline: "none"
              }}
              required
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={20} />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass"
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3.5rem",
                fontSize: "1rem",
                color: "var(--text-primary)",
                outline: "none"
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass" 
            style={{ 
              backgroundColor: "var(--accent-primary)", 
              padding: "1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginTop: "1rem",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={22} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Don't have an account? <Link to="/signup" style={{ color: "var(--accent-primary)", fontWeight: "600" }}>Sign Up</Link>
          </p>
          <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--glass-border)" }}>
            <Link to="/partner/login" style={{ color: "var(--text-secondary)", fontSize: "0.85rem", opacity: 0.7 }}>
              Are you a Theatre Partner? <span style={{ textDecoration: "underline" }}>Access Partner Portal</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
