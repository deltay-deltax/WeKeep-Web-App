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
} from "react-router-dom";
import AddingWarrantyUser from "./ApplicationUsers/AddingWarrantyUser";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ServiceHomePage from "./ServicePerson/ServiceHomePage";
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
import Notifications from "./ApplicationUsers/Notifications";

function App() {
  const { isAuthenticated, userData } = useAuth();

  // Helper function to redirect based on user role
  const redirectBasedOnRole = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (userData?.role === "user") {
      return <Navigate to="/uhomepage" replace />;
    } else if (userData?.role === "service") {
      return <Navigate to="/service-home" replace />;
    } else {
      return <RoleSelectionPage />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Router>
        <Header />

        <div className="px-6 md:px-12 lg:px-24 py-6">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                !isAuthenticated ? <LandingPage /> : redirectBasedOnRole()
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <RegisterRoleSelection />
                ) : (
                  redirectBasedOnRole()
                )
              }
            />
            <Route
              path="/register/user"
              element={
                !isAuthenticated ? <SignUpPage /> : redirectBasedOnRole()
              }
            />
            <Route
              path="/register/service"
              element={
                !isAuthenticated ? <ServiceSignUpPage /> : redirectBasedOnRole()
              }
            />
            <Route
              path="/login"
              element={!isAuthenticated ? <Login /> : redirectBasedOnRole()}
            />
            {/* Role selection after login - only show if user has no role */}
            <Route
              path="/role"
              element={
                isAuthenticated ? (
                  userData?.role ? (
                    redirectBasedOnRole()
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
              path="/profile"
              element={
                isAuthenticated ? (
                  <DashBoard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
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
            <Route
              path="/service/report-problem"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ProblemReportForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
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
              path="/shop/conversation/:shopId/:userId"
              element={
                isAuthenticated && userData?.role === "service" ? (
                  <ShopConversation />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
