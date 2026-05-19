import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CityProvider } from "./context/CityContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import Signup from "./pages/Signup";
import MovieDetails from "./pages/MovieDetails";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import TheatreManager from "./pages/TheatreManager";
import Ticket from "./pages/Ticket";
import MyTickets from "./pages/MyTickets";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/partner/login" element={<AdminLogin />} />
            <Route path="/partner/signup" element={<AdminSignup />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/booking/:id" element={
              <ProtectedRoute allowedRoles={["USER", "THEATRE_OWNER", "ADMIN"]}>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/ticket/:id" element={
              <ProtectedRoute allowedRoles={["USER", "THEATRE_OWNER", "ADMIN"]}>
                <Ticket />
              </ProtectedRoute>
            } />
            <Route path="/checkout/:id" element={
              <ProtectedRoute allowedRoles={["USER", "THEATRE_OWNER", "ADMIN"]}>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/my-tickets" element={
              <ProtectedRoute allowedRoles={["USER", "THEATRE_OWNER", "ADMIN"]}>
                <MyTickets />
              </ProtectedRoute>
            } />
            
            {/* Protected Management Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/dashboard" 
              element={
                <ProtectedRoute allowedRoles={["THEATRE_OWNER"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/theatre/:id" 
              element={
                <ProtectedRoute allowedRoles={["THEATRE_OWNER"]}>
                  <TheatreManager />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;
