import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { User, Mail, Lock, UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Signup: React.FC = () => {
  const [name, setName] = useState("");
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
      const response = await api.post("/auth/signup", { name, email, password });
      login(response.data.user, response.data.token);
      navigate("/");
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
        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>Join BuyPass</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center", marginBottom: "2rem" }}>
          Create your account to start booking movies
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
            <User style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} size={20} />
            <input 
              type="text" 
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={22} />}
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent-primary)", fontWeight: "600" }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
