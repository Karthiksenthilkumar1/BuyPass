import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { Loader2, ShieldCheck, ChevronLeft, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  id: string;
  totalAmount: number;
  platformFee: number;
  taxes: number;
  status: string;
  show: {
    startTime: string;
    movie: {
      title: string;
    };
    screen: {
      name: string;
      theatre: {
        name: string;
      };
    };
  };
}

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number to add space every 4 digits
    const input = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = input.match(/.{1,4}/g)?.join(" ") || input;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date to MM/YY
    const input = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (input.length >= 2) {
      setExpiryDate(`${input.substring(0, 2)}/${input.substring(2, 4)}`);
    } else {
      setExpiryDate(input);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMessage("");

    try {
      await api.post("/payments/process", {
        bookingId: id,
        cardNumber,
        cardHolder,
        expiryDate,
        cvv,
      });

      // Navigate directly to the confirmed ticket page on success
      navigate(`/ticket/${id}`);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Payment declined. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

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
        <h2>Booking not found</h2>
        <button onClick={() => navigate("/")} style={{ color: "var(--accent-primary)" }}>Return to Home</button>
      </div>
    );
  }

  // Detect card type (mock helper)
  const getCardType = () => {
    if (cardNumber.startsWith("4")) return "VISA";
    if (/^5[1-5]/.test(cardNumber)) return "MASTERCARD";
    return "CARD";
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "flex", gap: "4rem" }}>
        
        {/* Left: Interactive Payment Form */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)", marginBottom: "1rem", background: "none", border: "none", cursor: "pointer" }}>
              <ChevronLeft size={20} /> Back to Booking
            </button>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Secure Checkout</h1>
            <p style={{ color: "var(--text-secondary)" }}>Choose your payment method and complete your transaction.</p>
          </div>

          {/* Interactive Credit Card Container */}
          <div style={{ perspective: "1000px", width: "100%", maxWidth: "400px", height: "240px", margin: "0 auto 1.5rem" }}>
            <motion.div 
              style={{ 
                width: "100%", 
                height: "100%", 
                position: "relative", 
                transformStyle: "preserve-3d" 
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Front Side */}
              <div style={{ 
                position: "absolute", 
                width: "100%", 
                height: "100%", 
                backfaceVisibility: "hidden",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1f1f1f 0%, #111 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: "white",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: "50px", height: "40px", backgroundColor: "#d4af37", borderRadius: "8px", opacity: 0.8 }} /> {/* Chip */}
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "1px", color: "rgba(255,255,255,0.7)" }}>
                    {getCardType()}
                  </span>
                </div>
                
                <div style={{ fontSize: "1.6rem", letterSpacing: "3px", textAlign: "center", margin: "1.5rem 0", fontFamily: "monospace" }}>
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>CARDHOLDER</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: "600", textTransform: "uppercase" }}>
                      {cardHolder || "YOUR NAME"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>EXPIRES</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: "600" }}>{expiryDate || "MM/YY"}</div>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div style={{ 
                position: "absolute", 
                width: "100%", 
                height: "100%", 
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #111 0%, #1f1f1f 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "2rem 0",
                display: "flex",
                flexDirection: "column",
                color: "white",
                boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)"
              }}>
                <div style={{ height: "45px", backgroundColor: "black", width: "100%", marginBottom: "1.5rem" }} />
                <div style={{ padding: "0 2rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem", textAlign: "right" }}>CVV</div>
                  <div style={{ 
                    height: "40px", 
                    backgroundColor: "white", 
                    color: "black", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "flex-end", 
                    paddingRight: "1rem", 
                    borderRadius: "6px",
                    fontFamily: "monospace",
                    fontSize: "1.2rem",
                    fontWeight: "bold"
                  }}>
                    {cvv ? "•".repeat(cvv.length) : "•••"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <form onSubmit={handlePay} className="glass-card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Cardholder Name</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="John Doe"
                value={cardHolder} 
                onChange={(e) => setCardHolder(e.target.value)} 
                required 
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--glass-border)", borderRadius: "8px", background: "rgba(255,255,255,0.03)", color: "white" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Card Number</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="4000 1234 5678 9010" 
                value={cardNumber} 
                onChange={handleCardNumberChange} 
                required 
                style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--glass-border)", borderRadius: "8px", background: "rgba(255,255,255,0.03)", color: "white" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1.5rem" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>Expiry Date</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="MM/YY" 
                  value={expiryDate} 
                  onChange={handleExpiryChange} 
                  required 
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--glass-border)", borderRadius: "8px", background: "rgba(255,255,255,0.03)", color: "white" }}
                />
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>CVV</label>
                <input 
                  type="password" 
                  className="glass-input" 
                  placeholder="•••" 
                  maxLength={3}
                  value={cvv} 
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} 
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  required 
                  style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--glass-border)", borderRadius: "8px", background: "rgba(255,255,255,0.03)", color: "white" }}
                />
              </div>
            </div>

            {errorMessage && (
              <div style={{ color: "var(--danger)", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "1rem", borderRadius: "8px", fontSize: "0.9rem" }}>
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={processing}
              className="glass" 
              style={{ 
                backgroundColor: "var(--accent-primary)", 
                color: "white", 
                padding: "1.2rem", 
                fontSize: "1.2rem", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                marginTop: "1rem",
                cursor: "pointer",
                border: "none"
              }}
            >
              {processing ? (
                <>
                  <Loader2 className="animate-spin" /> Processing Secure Payment...
                </>
              ) : (
                `Pay ₹${booking.totalAmount.toFixed(2)}`
              )}
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              <ShieldCheck size={16} color="#10B981" /> 256-bit SSL encrypted transaction
            </div>
          </form>
        </div>

        {/* Right: Booking Summary */}
        <div style={{ width: "400px" }}>
          <div className="glass-card" style={{ position: "sticky", top: "8rem", padding: "2.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{booking.show.movie.title}</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              {booking.show.screen.theatre.name} • {booking.show.screen.name}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                  <span>₹{(booking.totalAmount - booking.platformFee - booking.taxes).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Platform Fee</span>
                  <span>₹{booking.platformFee.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Taxes (GST)</span>
                  <span>₹{booking.taxes.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: "bold" }}>
                <span>Total Amount</span>
                <span style={{ color: "var(--accent-primary)" }}>₹{booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
