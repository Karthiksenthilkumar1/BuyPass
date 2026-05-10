import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { Shield, Lock, Mail, User, Loader2, Landmark } from "lucide-react";
import { motion } from "framer-motion";

const AdminSignup: React.FC = () => {
  const [name, setName] = useState("");
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
      // Create account as THEATRE_OWNER
      const response = await api.post("/auth/signup", { 
        name, 
        email, 
        password, 
        role: "THEATRE_OWNER" 
      });
      
      // Auto-login
      login(response.data.user, response.data.token);
      navigate("/owner/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#0a0a0b",
      backgroundImage: "radial-gradient(circle at 50% 50%, #1a1a1c 0%, #0a0a0b 100%)",
      padding: "2rem"
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ 
          width: "100%",
          maxWidth: "500px", 
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
            backgroundColor: "rgba(59, 130, 246, 0.1)", 
            marginBottom: "1.5rem" 
          }}>
            <Shield size={48} color="#3b82f6" />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Register Partner</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Create your theatre administrator account.</p>
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
            <User style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={20} />
            <input
              type="text"
              placeholder="Full Name / Representative"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Mail style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={20} />
            <input
              type="email"
              placeholder="Business Email"
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
              placeholder="Access Password"
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
            {loading ? "Creating Account..." : "Register Theatre"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Already have a partner account? <Link to="/partner/login" style={{ color: "#3b82f6", fontWeight: "600" }}>Login here</Link>
          </p>
          <Link to="/login" style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Landmark size={16} /> Return to Movie Portal
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSignup;
