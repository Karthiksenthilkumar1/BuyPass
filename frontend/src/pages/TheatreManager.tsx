import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { ArrowLeft, Monitor, Loader2, Plus, LayoutGrid } from "lucide-react";
import ScreenLayoutBuilder from "../components/ScreenLayoutBuilder";

interface Screen {
  id: string;
  name: string;
  format: string;
  totalCapacity: number;
  _count: { seats: number; shows: number };
}

const TheatreManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const fetchScreens = async () => {
    try {
      const response = await api.get(`/theatres/${id}/screens`);
      setScreens(response.data);
    } catch (error) {
      console.error("Failed to fetch screens", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchScreens();
  }, [id]);

  return (
    <div style={{ paddingTop: "8rem", paddingBottom: "5rem", maxWidth: "1200px", margin: "0 auto", padding: "8rem 2rem 5rem" }}>
      <Link to="/owner/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "2rem", textDecoration: "none" }}>
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Manage Screens</h1>
          <p style={{ color: "var(--text-secondary)" }}>Configure screens and seating layouts for this theatre.</p>
        </div>
        <button 
          onClick={() => setIsBuilderOpen(true)}
          className="glass" 
          style={{ backgroundColor: "var(--accent-primary)", padding: "0.8rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}
        >
          <Plus size={20} /> Add Screen Layout
        </button>
      </header>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <Loader2 className="animate-spin" size={32} color="var(--accent-primary)" />
        </div>
      ) : screens.length === 0 ? (
        <div className="glass-card" style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>
          <LayoutGrid size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
          <h3 style={{ fontSize: "1.2rem", color: "white", marginBottom: "0.5rem" }}>No screens found</h3>
          <p>Add a screen to start scheduling shows.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {screens.map(screen => (
            <div key={screen.id} className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div className="glass" style={{ padding: "0.75rem", borderRadius: "8px" }}>
                    <Monitor size={24} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>{screen.name}</h3>
                    <span style={{ fontSize: "0.8rem", padding: "0.2rem 0.5rem", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px" }}>{screen.format}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem", marginTop: "1rem" }}>
                <span>{screen.totalCapacity} Total Seats</span>
                <span>{screen._count?.shows || 0} Shows</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isBuilderOpen && id && (
        <ScreenLayoutBuilder 
          theatreId={id} 
          onClose={() => setIsBuilderOpen(false)} 
          onSuccess={() => {
            setIsBuilderOpen(false);
            fetchScreens();
          }} 
        />
      )}
    </div>
  );
};

export default TheatreManager;
