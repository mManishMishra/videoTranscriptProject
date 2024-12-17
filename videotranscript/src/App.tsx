import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/login/Login";
import VideoUploader from "./components/uploader/VideoUploader";
import UserManagement from "./components/login/userManagement/UserManagement";
import { ErrorPage } from "./components/ErrorPage";
import ProtectedRoute from "./components/login/ProtectedRoute";
import Layout from "./components/Layout";
import UserProfile from "./components/login/userManagement/UserProfile";
import EditUser from "./components/login/userManagement/UserFormEdit";
import ContactUs from "./components/ContactUs";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route index element={<Home />} />
          {/* Protected routes */}
          <Route
            path="/upload"
            element={
                <VideoUploader />
            }
          />
           <Route
            path="/contact-us"
            element={
                <ContactUs />
            }
          />
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
           {/* User Profile Route */}
           <Route path="/user-profile/:id" element={<UserProfile />} />

{/* Edit User Route */}
<Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
