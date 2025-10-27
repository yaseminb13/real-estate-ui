import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import BusinessPage from "./pages/BusinessPage";
import CustomerPage from "./pages/CustomerPage";
import PropertyPage from "./pages/PropertyPage";
import PropertySearch from "./pages/PropertySearch";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Tüm sayfalar DashboardLayout içinde render olacak */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="business" element={<BusinessPage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="properties" element={<PropertyPage />} />
          <Route path="search" element={<PropertySearch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
