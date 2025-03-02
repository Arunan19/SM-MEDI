import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorProfile from "./pages/doctor/profile/profileD"; // Ensure correct import
import Adminprofile from "./pages/Admin/ProfileA/profileA"; // Ensure correct import
import BSCProfile from "./pages/BCS/ProfileB/profileB"; // Ensure correct import
import Login from "./pages/login/login"; // Corrected import statement
import MakeRequest from "./pages/doctor/make request/make request";
import CollectionRequests from "./pages/BCS/Collection request/collection request"; // Ensure correct import
import LogoutB from "./pages/BCS/logout/logoutB"; // Ensure correct import
import LogoutD from "./pages/doctor/logout/logoutD"; // Ensure correct import

function App() {
  return (
    <Router>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<DoctorProfile />} />
          <Route path="/admin" element={<Adminprofile />} />
          <Route path="/bsc-profile" element={<BSCProfile />} />
          <Route path="/make-request" element={<MakeRequest />} />
          <Route path="/collection-requests" element={<CollectionRequests />} />
          <Route path="/logoutB" element={<LogoutB />} />
          <Route path="/logoutD" element={<LogoutD />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
