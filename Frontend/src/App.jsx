import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./auth/Login/Login";
import Signup from "./auth/Signup/Signup";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import ContactUs from "./pages/Contact";
import Profile from "./pages/Profile";
import OrderMedicine from "./components/OrderMedicine";
import MedicineDetails from "./pages/MedicineDetails";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/protectedRoute";
import "react-toastify/dist/ReactToastify.css";
import OrderSummary from "./pages/OrderSummary";
import ScrollToTop from "./components/ScrollToTop";
import ReferralRegister from "./pages/Program/ReferralRegister";
import PartnerRegister from "./pages/Program/PartnerRegister";
import CommonLogin from "./pages/Program/CommonLogin";
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();

  const handleSearch = (searchResults) => {
    setProducts(searchResults);
  };

  if (location.pathname.startsWith("/uploads/")) {
    window.location.replace(`https://meds4you.in${location.pathname}`);
    return null; // Prevents React from rendering anything
  }

  const noLayoutRoutes = ["/admin", "/uploads","*"];
  const shouldShowLayout = !noLayoutRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {shouldShowLayout && <Navbar onSearch={handleSearch} />}

      <ScrollToTop />
      <Routes>
        {/* Public Routes (accessible by non-logged-in users) */}
        <Route element={<ProtectedRoute publicOnly={true} />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/program" element={<CommonLogin />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/products/:id" element={<MedicineDetails />} />
          <Route path="/medicine/:id" element={<MedicineDetails />} />
          <Route path="/infoOrder" element={<OrderMedicine />} />
          <Route path="/register/referral" element={<ReferralRegister />} />
          <Route path="/register/partner" element={<PartnerRegister />} />
        </Route>

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Protected Routes for User */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-summary" element={<OrderSummary />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>


        {/* Other routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {shouldShowLayout && <Footer />}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
