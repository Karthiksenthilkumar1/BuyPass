import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { Play, Info, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  genre: string;
  language: string;
  durationMinutes: number;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const featuredMovie = movies[0];

  return (
    <main style={{ paddingTop: "8rem" }}>
      {/* Hero Section */}
      {featuredMovie && (
        <section style={{
          height: "70vh",
          position: "relative",
          margin: "0 5%",
          borderRadius: "32px",
          overflow: "hidden",
          marginBottom: "4rem"
        }}>
          <img 
            src={featuredMovie.posterUrl} 
            alt={featuredMovie.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
          />
          <div style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "4rem",
            background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: "4rem", fontWeight: "bold" }}
            >
              {featuredMovie.title}
            </motion.h1>
            <div style={{ display: "flex", gap: "1.5rem", color: "var(--text-secondary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={18} /> 2024</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Clock size={18} /> {featuredMovie.durationMinutes} min</span>
              <span className="glass" style={{ padding: "2px 12px", fontSize: "0.8rem" }}>{featuredMovie.genre}</span>
            </div>
            <p style={{ maxWidth: "600px", color: "var(--text-secondary)", fontSize: "1.1rem" }}>
              {featuredMovie.description}
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button className="glass" style={{ 
                backgroundColor: "var(--text-primary)", 
                color: "var(--bg-primary)", 
                padding: "0.8rem 2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "600"
              }}>
                <Play size={20} fill="currentColor" /> Book Now
              </button>
              <button className="glass" style={{ 
                padding: "0.8rem 2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: "600"
              }}>
                <Info size={20} /> Details
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Movie Grid */}
      <section style={{ padding: "0 5%", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Explore Movies</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "2rem"
        }}>
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="glass-card" style={{ height: "400px", opacity: 0.5 }}></div>
            ))
          ) : (
            movies.map((movie) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="glass-card"
                  style={{ padding: "0", overflow: "hidden" }}
                >
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{movie.title}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                      <span>{movie.genre}</span>
                      <span>{movie.language}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
