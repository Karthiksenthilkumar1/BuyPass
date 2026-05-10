import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Clock, Calendar, Globe, Tag, Play, ChevronLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Show {
  id: string;
  startTime: string;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  genre: string;
  language: string;
  durationMinutes: number;
  releaseDate: string;
  shows: Show[];
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <h2>Movie not found</h2>
        <Link to="/" style={{ color: "var(--accent-primary)" }}>Return to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "5rem" }}>
      {/* Backdrop */}
      <div style={{
        position: "relative",
        height: "60vh",
        width: "100%",
        overflow: "hidden"
      }}>
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(20px)", opacity: 0.3 }}
        />
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, transparent 0%, var(--bg-primary) 100%)"
        }} />
      </div>

      {/* Content Container */}
      <div style={{
        maxWidth: "1200px",
        margin: "-30vh auto 0",
        padding: "0 2rem",
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        gap: "3rem"
      }}>
        {/* Header Section */}
        <section style={{ display: "flex", gap: "3rem", alignItems: "flex-start" }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ 
              width: "350px", 
              height: "500px", 
              overflow: "hidden", 
              flexShrink: 0,
              border: "1px solid var(--glass-border)"
            }}
          >
            <img src={movie.posterUrl} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingTop: "2rem" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              <ChevronLeft size={20} /> Back to Home
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: "4rem", lineHeight: "1.1", fontWeight: "bold" }}
            >
              {movie.title}
            </motion.h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={18} /> {new Date(movie.releaseDate).getFullYear()}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Clock size={18} /> {movie.durationMinutes} min</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Globe size={18} /> {movie.language}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Tag size={18} /> {movie.genre}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
              {movie.shows.map((show) => (
                <Link 
                  key={show.id} 
                  to={`/booking/${show.id}`} 
                  className="glass" 
                  style={{ 
                    padding: "0.5rem 1rem", 
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Play size={14} fill="currentColor" />
                  {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Link>
              ))}
            </div>

            <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.6" }}>
              {movie.description}
            </p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              {movie.shows.length > 0 ? (
                <Link 
                  to={`/booking/${movie.shows[0].id}`}
                  className="glass" 
                  style={{ 
                    backgroundColor: "var(--accent-primary)", 
                    padding: "1rem 3rem",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem"
                  }}
                >
                  <Play size={24} fill="currentColor" /> Book Tickets
                </Link>
              ) : (
                <div style={{ color: "var(--text-secondary)" }}>No shows available</div>
              )}
            </div>
          </div>
        </section>

        {/* Detailed Info / Cast Placeholder */}
        <section className="glass-card" style={{ padding: "3rem" }}>
          <h2 style={{ marginBottom: "2rem", fontSize: "1.8rem" }}>Synopsis</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", lineHeight: "1.8" }}>
            {movie.description} This is where we would expand on the movie details, plot summaries, and other relevant information once the data model is extended.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
