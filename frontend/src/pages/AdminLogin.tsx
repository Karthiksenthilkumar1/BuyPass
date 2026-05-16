import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Lock, Mail, Loader2, Landmark } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        setError("This portal is for Theatre Partners and Admins only.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
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
      backgroundColor: "#0a0a0b", // Deep charcoal
      backgroundImage: "radial-gradient(circle at 50% 50%, #1a1a1c 0%, #0a0a0b 100%)"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ 
          width: "450px", 
          padding: "3.5rem", 
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ 
            display: "inline-flex", 
            padding: "1rem", 
            borderRadius: "20px", 
            backgroundColor: "rgba(59, 130, 246, 0.1)", // Blue tint for business
            marginBottom: "1.5rem" 
          }}>
            <Shield size={48} color="#3b82f6" />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", letterSpacing: "-0.02em" }}>Partner Portal</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Secure access for theatre administrators.</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: "rgba(239, 68, 68, 0.1)", 
            color: "#ef4444", 
            padding: "1rem", 
            borderRadius: "12px", 
            marginBottom: "2rem",
            fontSize: "0.9rem",
            textAlign: "center",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ position: "relative" }}>
            <Mail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={20} />
            <input
              type="email"
              placeholder="Partner Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "white",
                fontSize: "1rem"
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <Lock style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={20} />
            <input
              type="password"
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem 1rem 1rem 3.5rem",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                color: "white",
                fontSize: "1rem"
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="glass" 
            style={{ 
              backgroundColor: "#3b82f6", 
              color: "white", 
              padding: "1.2rem", 
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "1.1rem",
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Shield size={20} />}
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Don't have a partner account? <Link to="/partner/signup" style={{ color: "#3b82f6", fontWeight: "600" }}>Register your theatre</Link>
          </p>
          <Link to="/login" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Landmark size={16} /> Return to Movie Portal
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
