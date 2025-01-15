import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Groups from "../pages/Groups";
import Create from "../pages/Create";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users/profile/:userId" element={<Profile />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/create" element={<Create />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
