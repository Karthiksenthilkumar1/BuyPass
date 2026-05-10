import React from "react";
import { Link } from "react-router-dom";
import { Ticket, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="glass" style={{
      position: "fixed",
      top: "1.5rem",
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      maxWidth: "1200px",
      padding: "1rem 2rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.5rem", fontWeight: "bold" }}>
        <Ticket size={32} color="var(--accent-primary)" />
        <span>Buy<span style={{ color: "var(--accent-primary)" }}>Pass</span></span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link to="/" style={{ color: "var(--text-secondary)" }}>Movies</Link>
        {user?.role === "THEATRE_OWNER" && (
          <Link to="/owner/dashboard" style={{ color: "var(--text-secondary)" }}>My Theatres</Link>
        )}
        {user?.role === "ADMIN" && (
          <Link to="/admin" style={{ color: "var(--text-secondary)" }}>Admin</Link>
        )}
        
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <User size={20} />
              <span>{user.name}</span>
            </div>
            <button onClick={logout} style={{ color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="glass" style={{ padding: "0.5rem 1.5rem", backgroundColor: "var(--accent-primary)", border: "none" }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
