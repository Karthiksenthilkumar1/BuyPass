import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Trash2, Loader2, Save, Layout } from "lucide-react";
import api from "../lib/api";

interface RowConfig {
  id: string;
  rowLabel: string;
  seatsCount: number;
  category: string;
  priceMultiplier: number;
}

interface ScreenLayoutBuilderProps {
  theatreId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ScreenLayoutBuilder: React.FC<ScreenLayoutBuilderProps> = ({ theatreId, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [format, setFormat] = useState("2D");
  const [rows, setRows] = useState<RowConfig[]>([
    { id: Date.now().toString(), rowLabel: "A", seatsCount: 10, category: "Standard", priceMultiplier: 1.0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addRow = () => {
    // auto increment row label A, B, C...
    const lastLabel = rows.length > 0 ? rows[rows.length - 1].rowLabel : "@";
    const nextLabel = String.fromCharCode(lastLabel.charCodeAt(0) + 1);
    
    setRows([
      ...rows,
      { 
        id: Date.now().toString(), 
        rowLabel: nextLabel <= 'Z' ? nextLabel : `R${rows.length + 1}`, 
        seatsCount: 10, 
        category: "Standard", 
        priceMultiplier: 1.0 
      }
    ]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof RowConfig, value: any) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rows.length === 0) {
      setError("Please add at least one row.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      await api.post(`/theatres/${theatreId}/screens`, {
        name,
        format,
        layout: rows
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create screen layout");
    } finally {
      setLoading(false);
    }
  };

  const totalSeats = rows.reduce((sum, row) => sum + (isNaN(row.seatsCount) ? 0 : row.seatsCount), 0);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(5px)",
      zIndex: 2000, display: "flex", justifyContent: "center", alignItems: "center", padding: "2rem"
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card"
        style={{ 
          width: "100%", maxWidth: "1200px", height: "90vh", 
          display: "grid", gridTemplateColumns: "1fr 1fr", 
          overflow: "hidden", position: "relative",
          backgroundColor: "#111113",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Left Side: Form */}
        <div style={{ padding: "2rem", overflowY: "auto", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Layout size={24} /> Screen Builder
            </h2>
          </div>

          {error && (
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          <form id="screen-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Screen Name</label>
                <input
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Screen 1"
                  style={{ width: "100%", padding: "0.8rem", backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Format</label>
                <select 
                  value={format} onChange={e => setFormat(e.target.value)}
                  style={{ width: "100%", padding: "0.8rem", backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }}
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.2rem" }}>Row Configuration</h3>
                <button type="button" onClick={addRow} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer" }}>
                  <Plus size={16} /> Add Row
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {rows.map((row) => (
                  <div key={row.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 2fr 1.5fr auto", gap: "0.5rem", alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "8px" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Row</label>
                      <input type="text" value={row.rowLabel} onChange={e => updateRow(row.id, "rowLabel", e.target.value)} style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "4px" }} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Seats</label>
                      <input type="number" min="1" max="50" value={row.seatsCount} onChange={e => updateRow(row.id, "seatsCount", parseInt(e.target.value))} style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "4px" }} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Category</label>
                      <select value={row.category} onChange={e => updateRow(row.id, "category", e.target.value)} style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "4px" }}>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="VIP">VIP</option>
                        <option value="Recliner">Recliner</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Price x</label>
                      <input type="number" step="0.1" min="0.5" value={row.priceMultiplier} onChange={e => updateRow(row.id, "priceMultiplier", parseFloat(e.target.value))} style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "4px" }} required />
                    </div>
                    <button type="button" onClick={() => removeRow(row.id)} style={{ alignSelf: "flex-end", padding: "0.5rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "4px", cursor: "pointer", height: "34px", marginTop: "18px" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Visual Preview */}
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Layout Preview</h3>
            <span style={{ padding: "0.4rem 1rem", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "20px", fontSize: "0.9rem" }}>
              Total Capacity: {totalSeats}
            </span>
          </div>

          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", backgroundColor: "rgba(0,0,0,0.2)" }}>
            {/* Screen indicator */}
            <div style={{ width: "80%", height: "8px", backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "4px", marginBottom: "3rem", boxShadow: "0 5px 20px rgba(255,255,255,0.3)" }}></div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
              {rows.map(row => (
                <div key={`preview-${row.id}`} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ width: "20px", color: "var(--text-secondary)", fontSize: "0.9rem", textAlign: "right" }}>{row.rowLabel}</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: isNaN(row.seatsCount) ? 0 : row.seatsCount }).map((_, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          width: "20px", height: "20px", 
                          backgroundColor: row.category === "Standard" ? "#3b82f6" : row.category === "Premium" ? "#8b5cf6" : row.category === "VIP" ? "#f59e0b" : "#ec4899",
                          borderRadius: "4px",
                          opacity: 0.8
                        }} 
                        title={`Seat ${row.rowLabel}${i+1} - ${row.category}`}
                      />
                    ))}
                  </div>
                  <span style={{ width: "20px", color: "var(--text-secondary)", fontSize: "0.9rem" }}>{row.rowLabel}</span>
                </div>
              ))}
            </div>
            {rows.length === 0 && (
              <div style={{ margin: "auto", color: "var(--text-secondary)" }}>Add rows to see preview</div>
            )}
          </div>

          {/* Footer actions */}
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.8rem 1.5rem", background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
              Cancel
            </button>
            <button form="screen-form" type="submit" disabled={loading} style={{ padding: "0.8rem 1.5rem", backgroundColor: "var(--accent-primary)", border: "none", color: "white", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Screen Layout
            </button>
          </div>
        </div>

        <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
          <X size={24} />
        </button>
      </motion.div>
    </div>
  );
};

export default ScreenLayoutBuilder;
