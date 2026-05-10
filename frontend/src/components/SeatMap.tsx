import React from "react";
import { motion } from "framer-motion";

interface Seat {
  id: string;
  row: string;
  number: number;
  category: string;
  isBooked: boolean;
}

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, selectedSeats, onToggleSeat }) => {
  // Group seats by row
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
      {/* Screen Visualization */}
      <div style={{
        width: "80%",
        height: "8px",
        background: "var(--accent-primary)",
        borderRadius: "4px",
        marginBottom: "3rem",
        boxShadow: "0 10px 30px var(--accent-primary)",
        position: "relative"
      }}>
        <span style={{
          position: "absolute",
          top: "15px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          letterSpacing: "0.2em"
        }}>SCREEN</span>
      </div>

      {Object.entries(rows).map(([rowName, rowSeats]) => (
        <div key={rowName} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ width: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{rowName}</span>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {rowSeats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.id);
              const color = seat.isBooked 
                ? "var(--bg-secondary)" 
                : isSelected 
                  ? "var(--accent-primary)" 
                  : seat.category === "Premium" 
                    ? "var(--accent-secondary)" 
                    : "rgba(255, 255, 255, 0.1)";

              return (
                <motion.button
                  key={seat.id}
                  whileHover={!seat.isBooked ? { scale: 1.2 } : {}}
                  whileTap={!seat.isBooked ? { scale: 0.9 } : {}}
                  onClick={() => !seat.isBooked && onToggleSeat(seat.id)}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "6px",
                    backgroundColor: color,
                    border: isSelected ? "2px solid white" : "1px solid var(--glass-border)",
                    cursor: seat.isBooked ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    color: seat.isBooked ? "var(--text-secondary)" : "white",
                  }}
                  title={`Row ${seat.row}, Seat ${seat.number} (${seat.category})`}
                >
                  {seat.number}
                </motion.button>
              );
            })}
          </div>
          <span style={{ width: "1.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{rowName}</span>
        </div>
      ))}

      {/* Legend */}
      <div style={{ display: "flex", gap: "2rem", marginTop: "3rem" }}>
        <LegendItem color="rgba(255, 255, 255, 0.1)" label="Available" />
        <LegendItem color="var(--accent-secondary)" label="Premium" />
        <LegendItem color="var(--accent-primary)" label="Selected" />
        <LegendItem color="var(--bg-secondary)" label="Booked" />
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: color }} />
    <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{label}</span>
  </div>
);

export default SeatMap;
