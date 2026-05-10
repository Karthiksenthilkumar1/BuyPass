import React from "react";
import { LayoutDashboard, Film, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <header style={{ marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage platform content and monitor activity.</p>
        </header>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "4rem" }}>
          <StatCard icon={<TrendingUp color="var(--accent-primary)" />} label="Total Revenue" value="₹1,24,500" change="+12%" />
          <StatCard icon={<Film color="var(--accent-primary)" />} label="Active Movies" value="12" change="+2" />
          <StatCard icon={<Users color="var(--accent-primary)" />} label="Total Users" value="850" change="+54" />
          <StatCard icon={<LayoutDashboard color="var(--accent-primary)" />} label="Theatres" value="8" change="0" />
        </div>

        {/* Quick Actions */}
        <section>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>Quick Actions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <ActionCard 
              title="Add New Movie" 
              description="Upload posters, add descriptions, and set release dates."
              buttonText="Launch Creator"
            />
            <ActionCard 
              title="Review Bookings" 
              description="View and manage ticket sales across all theatres."
              buttonText="View Reports"
            />
            <ActionCard 
              title="Platform Settings" 
              description="Configure platform fees, taxes, and global parameters."
              buttonText="Open Settings"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, change }: { icon: React.ReactNode, label: string, value: string, change: string }) => (
  <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ padding: "2rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
      <div className="glass" style={{ padding: "0.75rem", borderRadius: "12px" }}>{icon}</div>
      <span style={{ color: "var(--success)", fontSize: "0.9rem" }}>{change}</span>
    </div>
    <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>{label}</div>
    <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{value}</div>
  </motion.div>
);

const ActionCard = ({ title, description, buttonText }: { title: string, description: string, buttonText: string }) => (
  <div className="glass-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
    <h3 style={{ fontSize: "1.3rem" }}>{title}</h3>
    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>{description}</p>
    <button className="glass" style={{ alignSelf: "flex-start", padding: "0.6rem 1.2rem", marginTop: "1rem", fontSize: "0.9rem" }}>
      {buttonText}
    </button>
  </div>
);

export default AdminDashboard;
