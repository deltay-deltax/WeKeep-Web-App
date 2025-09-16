import UserHomePage from "./ApplicationUsers/UserHomePage";
import DashBoard from "./Logins/DashBoard";
import Login from "./Logins/Login";
import SignUpPage from "./Logins/SignUpPage";
import { useAuth } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import AddingWarrantyUser from "./ApplicationUsers/AddingWarrantyUser";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ServiceHomePage from "./ServicePerson/ServiceHomePage";
import ServiceRequests from "./ServicePerson/ServiceRequests";
import WarrantyDetails from "../src/testdata/WarrantyDetails";
import ViewServiceHistory from "./ApplicationUsers/ViewServiceHistory";
import RoleSelectionPage from "./components/RoleSelectionPage";
import DummyPaymentPage from "./components/dummyPaymentPage";
import ElectronicsShops from "./components/ElectronicsShops";
import ShopDetails from "./components/ShopDetails";
import ProblemReportForm from "./ServicePerson/ProblemReportForm";
import ServiceUpdateForm from "./ServicePerson/ServiceUpdateForm";
import ServiceHistoryViewer from "./ServicePerson/ServiceHistoryViewer";
import LandingPage from "./components/LandingPage";
import RegisterRoleSelection from "./components/RegisterRoleSelection";
import ServiceSignUpPage from "./Logins/ServiceSignUpPage";
import ShopConversation from "./ServicePerson/ShopConversation";
import ShopDashboard from "./ServicePerson/ShopDashboard";
import ServiceAnalytics from "./ServicePerson/ServiceAnalytics";
import Notifications from "./ApplicationUsers/Notifications";
import AdminVerifyShops from "./components/AdminVerifyShops";
import AdminDashboard from "./components/AdminDashboard";
import AdminAnalytics from "./components/AdminAnalytics";

function AppContent() {
  const { isAuthenticated, userData, loading } = useAuth(); // Add loading
  const location = useLocation();
  
  // Show footer on all pages
  const showFooter = true;

  // Show loading spinner while auth is resolving
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Header />

      <div className="px-6 md:px-12 lg:px-24 py-6">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LandingPage />
                ) : userData?.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : userData?.role === "user" ? (
                  <Navigate to="/uhomepage" replace />
                ) : userData?.role === "service" ? (
                  <Navigate to="/service-home" replace />
                ) : (
                  <RoleSelectionPage />
                )
              }
            />

            {/* Auth routes */}
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <RegisterRoleSelection />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/register/user"
              element={
                !isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/register/service"
              element={
                !isAuthenticated ? (
                  <ServiceSignUpPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? <Login /> : <Navigate to="/" replace />
              }
            />

            {/* FIXED: Shop routes - Available to ALL authenticated users */}
            <Route
              path="/shops"
              element={
                isAuthenticated ? (
                  <ElectronicsShops />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/shop/:id"
              element={
                isAuthenticated ? (
                  <ShopDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* FIXED: Chat route - Available to ALL authenticated users */}
            <Route
              path="/shop/conversation/:shopId/:userId"
              element={
                isAuthenticated ? (
                  <ShopConversation />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Common authenticated routes */}
            <Route
              path="/warranty-details/:id"
              element={
                isAuthenticated ? (
                  <WarrantyDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/service-history"
              element={
                isAuthenticated ? (
                  <ViewServiceHistory />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/payment"
              element={
                isAuthenticated ? (
                  <DummyPaymentPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/notifications"
              element={
                isAuthenticated ? (
                  <Notifications />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <DashBoard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Role selection after login */}
            <Route
              path="/role"
              element={
                isAuthenticated ? (
                  userData?.role ? (
                    <Navigate to="/" replace />
                  ) : (
                    <RoleSelectionPage />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* User routes */}
            <Route
              path="/uhomepage"
              element={
                isAuthenticated && userData?.role === "user" ? (
                  <UserHomePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/add-warranty"
              element={
                isAuthenticated && userData?.role === "user" ? (
                  <AddingWarrantyUser />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Service person routes */}
            <Route
              path="/service-home"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ServiceHomePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/service"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ServiceHomePage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Removed manual problem reporting route for production flow */}
            <Route
              path="/service/update"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ServiceUpdateForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/service/update/:requestId"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ServiceUpdateForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/service/history"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ServiceHistoryViewer />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/shop-dashboard"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ShopDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/service-requests"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ServiceRequests />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/service-analytics"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ServiceAnalytics />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Admin - simple access gate: role must be 'admin' */}
            <Route
              path="/admin"
              element={
                isAuthenticated && userData?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/verify-services"
              element={
                isAuthenticated && userData?.role === "admin" ? (
                  <AdminVerifyShops />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/analytics"
              element={
                isAuthenticated && userData?.role === "admin" ? (
                  <AdminAnalytics />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
