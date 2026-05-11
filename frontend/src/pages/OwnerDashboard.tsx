import React, { useState, useEffect } from "react";
import { Landmark, Monitor, Calendar, Settings, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";

interface Theatre {
  id: string;
  name: string;
  city: string;
  location: string;
  _count?: {
    screens: number;
  };
}

const OwnerDashboard: React.FC = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: "", city: "", location: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchTheatres = async () => {
    try {
      const response = await api.get("/theatres/owner");
      setTheatres(response.data);
    } catch (error) {
      console.error("Failed to fetch theatres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, []);

  const handleAddTheatre = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const response = await api.post("/theatres", formData);
      setTheatres([response.data.theatre, ...theatres]);
      setIsModalOpen(false);
      setFormData({ name: "", city: "", location: "" });
    } catch (error: any) {
      setFormError(error.response?.data?.message || "Failed to create theatre.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Theatre Dashboard</h1>
            <p style={{ color: "var(--text-secondary)" }}>Manage your screens, shows, and seating layouts.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="glass" 
            style={{ backgroundColor: "var(--accent-primary)", padding: "0.8rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}
          >
            <Plus size={20} /> Add Theatre
          </button>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          {/* Main Content: Theatres List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Your Theatres</h2>
            
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                <Loader2 className="animate-spin" size={32} color="var(--accent-primary)" />
              </div>
            ) : theatres.length === 0 ? (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
                <Landmark size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
                <p>You haven't added any theatres yet.</p>
              </div>
            ) : (
              theatres.map((theatre) => (
                <TheatreItem 
                  key={theatre.id}
                  name={theatre.name} 
                  location={`${theatre.city}, ${theatre.location}`} 
                  screens={theatre._count?.screens || 0} 
                />
              ))
            )}
          </div>

          {/* Sidebar: Quick Stats/Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ marginBottom: "1.5rem" }}>Business Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <SmallStat label="Today's Bookings" value="142" />
                <SmallStat label="Revenue (MTD)" value="₹45,200" />
                <SmallStat label="Occupancy Rate" value="68%" />
              </div>
            </div>

            <div className="glass-card" style={{ padding: "2rem" }}>
              <h3 style={{ marginBottom: "1.5rem" }}>Management</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <SidebarLink icon={<Monitor size={18} />} label="Manage Screens" />
                <SidebarLink icon={<Calendar size={18} />} label="Show Scheduling" />
                <SidebarLink icon={<Settings size={18} />} label="Theatre Settings" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Theatre Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                onClick={() => setIsModalOpen(false)}
                style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
              >
                <X size={24} />
              </button>

              <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Add New Theatre</h2>
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Enter the details of your new cinema property.</p>

              {formError && (
                <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddTheatre} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Theatre Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Grand Cinema"
                    style={{ width: "100%", padding: "0.8rem 1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "white" }}
                  />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="e.g. Mumbai"
                      style={{ width: "100%", padding: "0.8rem 1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "white" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Location Area</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Bandra West"
                      style={{ width: "100%", padding: "0.8rem 1rem", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", color: "white" }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="glass" 
                  style={{ backgroundColor: "var(--accent-primary)", padding: "1rem", marginTop: "1rem", fontSize: "1rem", fontWeight: "600", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
                >
                  {formLoading ? <Loader2 className="animate-spin" size={20} /> : <Landmark size={20} />}
                  {formLoading ? "Creating..." : "Create Theatre"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TheatreItem = ({ name, location, screens }: { name: string, location: string, screens: number }) => (
  <motion.div whileHover={{ x: 10 }} className="glass-card" style={{ padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <div className="glass" style={{ padding: "1rem", borderRadius: "12px" }}>
        <Landmark size={32} color="var(--accent-primary)" />
      </div>
      <div>
        <h3 style={{ fontSize: "1.3rem", marginBottom: "0.25rem" }}>{name}</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{location}</p>
      </div>
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{screens}</div>
      <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Screens</div>
    </div>
  </motion.div>
);

const SmallStat = ({ label, value }: { label: string, value: string }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{label}</span>
    <span style={{ fontWeight: "600" }}>{value}</span>
  </div>
);

const SidebarLink = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", width: "100%", textAlign: "left", color: "var(--text-secondary)", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
    {icon}
    <span style={{ fontSize: "0.95rem" }}>{label}</span>
  </button>
);

export default OwnerDashboard;
