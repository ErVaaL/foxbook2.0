import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Groups from "../pages/Groups";
import Create from "../pages/Create";
import GroupDetails from "../pages/GroupDetails";
import Event from "../pages/Event";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import MasterControl from "../pages/MasterControl";
import { MasterControlProvider } from "../contexts/masterControlContext/MasterControlContext";

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
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/events/:id" element={<Event />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <MasterControlProvider>
            <Route path="/master-control" element={<MasterControl />} />
          </MasterControlProvider>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
