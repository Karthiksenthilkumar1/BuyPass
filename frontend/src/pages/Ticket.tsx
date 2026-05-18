import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { Loader2, ArrowLeft, Download, MapPin, Calendar, Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface TicketData {
  id: string;
  totalAmount: number;
  status: string;
  show: {
    startTime: string;
    movie: {
      title: string;
      posterUrl: string;
      durationMinutes: number;
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
  tickets: {
    id: string;
    seat: {
      row: string;
      number: number;
    };
  }[];
}

const Ticket: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <h2>Ticket not found</h2>
        <Link to="/" style={{ color: "var(--accent-primary)" }}>Return to Home</Link>
      </div>
    );
  }

  const showDate = new Date(booking.show.startTime);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <button className="glass" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", border: "none", cursor: "pointer" }} onClick={() => window.print()}>
            <Download size={18} /> Download Pass
          </button>
        </div>

        {/* Digital Pass Card */}
        <div className="glass-card" style={{ 
          padding: 0, 
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}>
          {/* Top Section / Poster Background */}
          <div style={{ 
            height: "200px", 
            position: "relative",
            overflow: "hidden"
          }}>
            <img 
              src={booking.show.movie.posterUrl} 
              alt={booking.show.movie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(5px)", opacity: 0.6, transform: "scale(1.1)" }}
            />
            <div style={{ 
              position: "absolute", 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: "100px", 
              background: "linear-gradient(to top, rgba(20,20,20,1), transparent)" 
            }} />
            <div style={{ position: "absolute", bottom: "1.5rem", left: "2rem" }}>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                {booking.show.movie.title}
              </h1>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ padding: "2rem", display: "flex", gap: "2rem", backgroundColor: "rgba(20,20,20,0.9)" }}>
            
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>THEATRE</p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <MapPin size={18} color="var(--accent-primary)" style={{ marginTop: "3px" }} />
                  <div>
                    <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>{booking.show.screen.theatre.name}</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{booking.show.screen.name}, {booking.show.screen.theatre.location}, {booking.show.screen.theatre.city}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "3rem" }}>
                <div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>DATE</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem", fontWeight: "600" }}>
                    <Calendar size={18} color="var(--accent-primary)" />
                    {showDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>TIME</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.1rem", fontWeight: "600" }}>
                    <Clock size={18} color="var(--accent-primary)" />
                    {showDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>SEATS ({booking.tickets.length})</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {booking.tickets.map(ticket => (
                    <span key={ticket.id} style={{ 
                      padding: "0.25rem 0.75rem", 
                      backgroundColor: "var(--accent-primary)", 
                      color: "var(--bg-primary)", 
                      borderRadius: "4px",
                      fontWeight: "bold"
                    }}>
                      {ticket.seat.row}{ticket.seat.number}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* QR Code Divider */}
            <div style={{ width: "2px", borderLeft: "2px dashed rgba(255,255,255,0.1)", margin: "0 1rem" }} />

            {/* QR Code Section */}
            <div style={{ width: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "white", borderRadius: "12px" }}>
                <QRCodeSVG value={booking.id} size={150} />
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textAlign: "center" }}>
                Scan at the entrance<br/>Booking ID: {booking.id.split('-')[0].toUpperCase()}
              </p>
            </div>
          </div>

          {/* Ticket Footer (Cutout effect) */}
          <div style={{ 
            height: "40px", 
            backgroundColor: "var(--accent-primary)", 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--bg-primary)",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            fontSize: "0.9rem"
          }}>
            {booking.status === "CONFIRMED" ? "VALID DIGITAL PASS" : booking.status}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Ticket;
