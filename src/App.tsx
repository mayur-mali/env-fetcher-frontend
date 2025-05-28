import { useState } from "react";

import "./App.css";
import { Link, NavLink, Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <NavLink to="/">Home</NavLink> |
      <NavLink to="/dashboard">Dashboard</NavLink> |
      <NavLink to="/login">Login</NavLink>
      <Outlet />
    </div>
  );
}

export default App;
