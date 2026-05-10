import React from "react";
import { Landmark, Monitor, Calendar, Settings, Plus } from "lucide-react";
import { motion } from "framer-motion";

const OwnerDashboard: React.FC = () => {
  return (
    <div style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Theatre Dashboard</h1>
            <p style={{ color: "var(--text-secondary)" }}>Manage your screens, shows, and seating layouts.</p>
          </div>
          <button className="glass" style={{ backgroundColor: "var(--accent-primary)", padding: "0.8rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}>
            <Plus size={20} /> Add Theatre
          </button>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          {/* Main Content: Theatres List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Your Theatres</h2>
            <TheatreItem name="Grand Cinema" location="Mumbai, Bandra West" screens={4} />
            <TheatreItem name="Plaza Multiplex" location="Mumbai, Worli" screens={6} />
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
  <button style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.75rem", width: "100%", textAlign: "left", color: "var(--text-secondary)", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>
    {icon}
    <span style={{ fontSize: "0.95rem" }}>{label}</span>
  </button>
);

export default OwnerDashboard;
