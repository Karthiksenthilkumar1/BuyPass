import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import SeatMap from "../components/SeatMap";
import { Loader2, CreditCard, ChevronLeft } from "lucide-react";

interface Seat {
  id: string;
  row: string;
  number: number;
  category: string;
  isBooked: boolean;
  priceMultiplier: number;
}

interface Show {
  id: string;
  movie: { title: string };
  startTime: string;
  basePrice: number;
  theatre: { name: string; city: string };
  screen: { name: string };
  seats: Seat[];
}

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await api.get(`/shows/${id}`);
        setShow(response.data);
      } catch (error) {
        console.error("Error fetching show:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShow();
  }, [id]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId) 
        : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    if (!show) return 0;
    const seatPrice = selectedSeats.reduce((total, id) => {
      const seat = show.seats.find(s => s.id === id);
      return total + (show.basePrice * (seat?.priceMultiplier || 1));
    }, 0);
    
    const fees = 20;
    const taxes = seatPrice * 0.18;
    return seatPrice + fees + taxes;
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    setBookingLoading(true);
    try {
      const response = await api.post("/bookings", { showId: id, seatIds: selectedSeats });
      const bookingId = response.data.booking.id;
      alert("Booking Confirmed!");
      navigate(`/ticket/${bookingId}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="animate-spin" size={48} /></div>;
  if (!show) return <div style={{ textAlign: "center", paddingTop: "10rem" }}>Show not found</div>;

  return (
    <div style={{ paddingTop: "8rem", minHeight: "100vh", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", display: "flex", gap: "4rem" }}>
        
        {/* Left: Seat Selection */}
        <div style={{ flex: 1 }}>
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "2rem" }}>
            <ChevronLeft size={20} /> Change Movie
          </button>
          
          <div className="glass-card" style={{ padding: "4rem 2rem" }}>
            <SeatMap 
              seats={show.seats} 
              selectedSeats={selectedSeats} 
              onToggleSeat={toggleSeat} 
            />
          </div>
        </div>

        {/* Right: Booking Summary */}
        <div style={{ width: "400px" }}>
          <div className="glass-card" style={{ position: "sticky", top: "8rem", padding: "2.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{show.movie.title}</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {show.theatre.name} • {show.screen.name}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Selected Seats ({selectedSeats.length})</span>
                <span>{selectedSeats.length > 0 ? selectedSeats.map(id => {
                  const seat = show.seats.find(s => s.id === id);
                  return seat ? `${seat.row}${seat.number}` : "";
                }).filter(Boolean).join(", ") : "None"}</span>
              </div>

              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Tickets Total</span>
                  <span>₹{calculateTotal() > 0 ? (calculateTotal() - 20 - (calculateTotal() - 20) * 0.18 / 1.18).toFixed(2) : "0.00"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Platform Fee</span>
                  <span>₹20.00</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Taxes (GST)</span>
                  <span>₹{(calculateTotal() * 0.15).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: "bold" }}>
                <span>Total Amount</span>
                <span style={{ color: "var(--accent-primary)" }}>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <button 
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || bookingLoading}
                className="glass" 
                style={{ 
                  backgroundColor: selectedSeats.length > 0 ? "var(--accent-primary)" : "var(--bg-secondary)", 
                  color: "white",
                  padding: "1.2rem",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  marginTop: "1rem",
                  cursor: selectedSeats.length > 0 ? "pointer" : "not-allowed"
                }}
              >
                {bookingLoading ? <Loader2 className="animate-spin" /> : <CreditCard size={24} />}
                {bookingLoading ? "Processing..." : "Confirm Booking"}
              </button>
              
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textAlign: "center", marginTop: "1rem" }}>
                By confirming, you agree to our Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
