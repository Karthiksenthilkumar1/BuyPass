import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { Loader2, Ticket as TicketIcon, Calendar, Clock, MapPin } from "lucide-react";

interface Booking {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  show: {
    startTime: string;
    movie: {
      title: string;
      posterUrl: string;
    };
    screen: {
      name: string;
      theatre: {
        name: string;
        location: string;
        city: string;
      };
    };
  };
  tickets: any[];
}

const MyTickets: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <TicketIcon size={36} color="var(--accent-primary)" />
          My Tickets
        </h1>

        {bookings.length === 0 ? (
          <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <TicketIcon size={64} color="var(--text-secondary)" style={{ opacity: 0.5 }} />
            <h2 style={{ fontSize: "1.5rem", color: "var(--text-secondary)" }}>No bookings found</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>You haven't booked any tickets yet.</p>
            <Link to="/" className="glass" style={{ padding: "0.75rem 2rem", backgroundColor: "var(--accent-primary)", color: "white", fontWeight: "600" }}>
              Explore Movies
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {bookings.map(booking => {
              const showDate = new Date(booking.show.startTime);
              const isPast = showDate < new Date();

              return (
                <Link key={booking.id} to={`/ticket/${booking.id}`}>
                  <div className="glass-card" style={{ 
                    padding: 0, 
                    display: "flex",
                    overflow: "hidden",
                    opacity: isPast ? 0.6 : 1,
                    transition: "transform 0.2s, opacity 0.2s",
                  }}>
                    <div style={{ width: "120px", flexShrink: 0 }}>
                      <img 
                        src={booking.show.movie.posterUrl} 
                        alt={booking.show.movie.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ padding: "1.5rem", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{booking.show.movie.title}</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <MapPin size={16} /> {booking.show.screen.theatre.name}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Calendar size={16} /> {showDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Clock size={16} /> {showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                          <span style={{ padding: "0.25rem 0.5rem", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", fontSize: "0.8rem" }}>
                            {booking.tickets.length} Ticket(s)
                          </span>
                          <span style={{ padding: "0.25rem 0.5rem", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "4px", fontSize: "0.8rem" }}>
                            ₹{booking.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div style={{ 
                          padding: "0.5rem 1rem", 
                          backgroundColor: isPast ? "transparent" : "var(--accent-primary)", 
                          border: isPast ? "1px solid var(--text-secondary)" : "none",
                          color: isPast ? "var(--text-secondary)" : "white",
                          borderRadius: "100px",
                          fontSize: "0.9rem",
                          fontWeight: "bold"
                        }}>
                          {isPast ? "PAST" : "VIEW TICKET"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyTickets;
