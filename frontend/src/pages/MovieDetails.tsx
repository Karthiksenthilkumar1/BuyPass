import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Clock, Calendar, Globe, Tag, Play, ChevronLeft, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useCity } from "../context/CityContext";

interface Theatre {
  id: string;
  name: string;
  city: string;
  location: string;
}

interface Screen {
  id: string;
  name: string;
  theatre: Theatre;
}

interface Show {
  id: string;
  startTime: string;
  screen?: Screen;
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
  const { selectedCity } = useCity();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Generate next 7 days for the date selector
  const upcomingDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

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

  const cityShows = movie.shows.filter(show => {
    const showDate = new Date(show.startTime);
    return (
      show.screen?.theatre?.city === selectedCity &&
      showDate.toDateString() === selectedDate.toDateString()
    );
  });
  
  const showsByTheatre: Record<string, { theatre: Theatre; shows: Show[] }> = {};
  cityShows.forEach(show => {
    const theatre = show.screen!.theatre;
    if (!showsByTheatre[theatre.id]) {
      showsByTheatre[theatre.id] = { theatre, shows: [] };
    }
    showsByTheatre[theatre.id].shows.push(show);
  });
  
  const theatreGroups = Object.values(showsByTheatre);

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

            <div style={{ marginTop: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MapPin size={24} color="var(--accent-primary)" />
                Shows in {selectedCity}
              </h2>

              {/* Date Selector */}
              <div style={{ 
                display: "flex", 
                gap: "1rem", 
                overflowX: "auto", 
                paddingBottom: "1rem",
                marginBottom: "1rem",
                scrollbarWidth: "none" // Hide scrollbar for cleaner look
              }}>
                {upcomingDates.map((date, i) => {
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        padding: "0.75rem 1.5rem",
                        borderRadius: "12px",
                        border: isSelected ? "1px solid var(--accent-primary)" : "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: isSelected ? "var(--accent-primary)" : "rgba(255,255,255,0.05)",
                        color: isSelected ? "var(--bg-primary)" : "var(--text-primary)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: "80px",
                        transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: "600", opacity: isSelected ? 0.9 : 0.6 }}>
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        {date.getDate()}
                      </span>
                      <span style={{ fontSize: "0.8rem", opacity: isSelected ? 0.9 : 0.6 }}>
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {theatreGroups.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {theatreGroups.map(({ theatre, shows }) => (
                    <div key={theatre.id} className="glass-card" style={{ padding: "1.5rem" }}>
                      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.25rem" }}>{theatre.name}</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>{theatre.location}</p>
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                        {shows.map((show) => (
                          <Link 
                            key={show.id} 
                            to={`/booking/${show.id}`} 
                            className="glass" 
                            style={{ 
                              padding: "0.5rem 1rem", 
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              transition: "all 0.2s"
                            }}
                          >
                            <Play size={14} fill="currentColor" />
                            {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--text-secondary)", padding: "2rem", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
                  No shows available for {movie.title} in {selectedCity} on {selectedDate.toLocaleDateString()}
                </div>
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
