import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { store, actions } = useContext(Context);
  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">React Boilerplate</span>
        </Link>
        <div className="ml-auto">
          {!sessionStorage.getItem("token") ? (
            <div>
              <Link to="/login">
                <button className="btn btn-primary">Log in</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary">Register</button>
              </Link>
              <Link to="/">
                <button className="btn btn-primary">Home</button>
              </Link>
            </div>
          ) : (
            <div>
              <button className="btn btn-primary" onClick={actions.logout}>
                Log out
              </button>
              <Link to="/">
                <button className="btn btn-primary">Home</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
