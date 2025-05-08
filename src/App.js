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
import WarrantyDetails from "../src/testdata/WarrantyDetails"; // You need to create this component
import ViewServiceHistory from "./ApplicationUsers/ViewServiceHistory";
import RoleSelectionPage from "./components/RoleSelectionPage";
import DummyPaymentPage from "./components/dummyPaymentPage";
import ElectronicsShops from "./components/ElectronicsShops";
import ShopDetails from "./components/ShopDetails";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <Router>
        <Header />

        <div className="px-6 md:px-12 lg:px-24 py-6">
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <SignUpPage />
                ) : (
                  <Navigate to="/role" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login />
                ) : (
                  <Navigate to="/role" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <UserHomePage /> : <Navigate to="/login" />
              }
            />
            <Route path="/uhomepage" element={<UserHomePage />} />
            <Route path="/add-warranty" element={<AddingWarrantyUser />} />
            <Route path="/warranty-details/:id" element={<WarrantyDetails />} />
            <Route path="/service-home" element={<ServiceHomePage />} />
            <Route path="/service-history" element={<ViewServiceHistory />} />
            <Route path="/role" element={<RoleSelectionPage />} />
            <Route path="/payment" element={<DummyPaymentPage />} />
            <Route path="/profile" element={<DashBoard />} />
            <Route path="/shops" element={<ElectronicsShops />} />   
            <Route path="/shop/:id" element={<ShopDetails />} />
           
          </Routes>
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
