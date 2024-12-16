import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute"; // Import PrivateRoute
import { GroupList } from "./components/group/GroupList.tsx";
import { CreateGroup } from "./components/group/CreateGroup";
import { JoinGroup } from "./components/group/JoinGroup";
import { GroupDetails } from "./components/group/GroupDetails";
import { LoginPage } from "./components/auth/LoginPage";
import { Header } from "./components/Header";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <GroupList />
              </PrivateRoute>
            }
          />
          <Route
  path="/create-group"
  element={
    <PrivateRoute>
      <CreateGroup />
    </PrivateRoute>
  }
/>
          <Route
            path="/join-group"
            element={
              <PrivateRoute>
                <JoinGroup />
              </PrivateRoute>
            }
          />
          <Route
  path="/group/:id"
  element={
    <PrivateRoute>
      <GroupDetails />
    </PrivateRoute>
  }
/>


          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
