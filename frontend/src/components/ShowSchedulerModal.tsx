import React, { useState, useEffect } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";

interface Movie {
  id: string;
  title: string;
}

interface ShowSchedulerModalProps {
  screenId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ShowSchedulerModal: React.FC<ShowSchedulerModalProps> = ({ screenId, onClose, onSuccess }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    movieId: "",
    startTime: "",
    basePrice: 150
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, movieId: response.data[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
        setError("Failed to load movies. Are there any in the database?");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await api.post("/shows", {
        screenId,
        movieId: formData.movieId,
        startTime: new Date(formData.startTime).toISOString(),
        basePrice: Number(formData.basePrice)
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to schedule show.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(5px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2000, padding: "1rem"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card"
        style={{ width: "100%", maxWidth: "500px", padding: "2.5rem", position: "relative" }}
      >
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={24} color="var(--accent-primary)" />
          Schedule Show
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Select a movie and time for this screen.</p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem 0" }}>
            <Loader2 className="animate-spin" size={32} color="var(--accent-primary)" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {error && (
              <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Select Movie</label>
              {movies.length === 0 ? (
                <div style={{ color: "#ef4444", fontSize: "0.9rem", padding: "0.8rem", border: "1px dashed rgba(239, 68, 68, 0.5)", borderRadius: "8px" }}>
                  No movies available in the database. Please add movies first.
                </div>
              ) : (
                <select
                  required
                  value={formData.movieId}
                  onChange={(e) => setFormData({...formData, movieId: e.target.value})}
                  style={{ width: "100%", padding: "0.8rem 1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "white", cursor: "pointer" }}
                >
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id} style={{ backgroundColor: "#111" }}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Start Time</label>
              <input
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                style={{ width: "100%", padding: "0.8rem 1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "white", colorScheme: "dark" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Base Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="10"
                value={formData.basePrice}
                onChange={(e) => setFormData({...formData, basePrice: Number(e.target.value)})}
                style={{ width: "100%", padding: "0.8rem 1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "white" }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting || movies.length === 0}
              className="glass" 
              style={{ 
                backgroundColor: (submitting || movies.length === 0) ? "rgba(255,255,255,0.1)" : "var(--accent-primary)", 
                padding: "1rem", marginTop: "1rem", fontSize: "1rem", fontWeight: "600", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem",
                cursor: (submitting || movies.length === 0) ? "not-allowed" : "pointer",
                color: (submitting || movies.length === 0) ? "var(--text-secondary)" : "white"
              }}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
              {submitting ? "Scheduling..." : "Schedule Show"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ShowSchedulerModal;
