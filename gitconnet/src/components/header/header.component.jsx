import React from "react";
import { Link } from "react-router-dom";
import "./header.style.scss";

import CustomButton from "../custom-button/custom-button.component";

const Header = (props) => {
  return (
    <nav className="header">
      <div className="logo">
        <CustomButton title="GitConnect" />
      </div>
      <div className="options">
        <Link to="/search">
          <CustomButton title="Search" />
        </Link>
        <Link to="/profile">
          <CustomButton title="Profile" />
        </Link>
        <Link to="/projects">
          <CustomButton title="Project" />
        </Link>
        <Link to="/notifications">
          <CustomButton title="Notification" />
        </Link>
        <Link to="/">
          <CustomButton title="Sign out" onClick={() => props.handleLogin()} />
        </Link>
      </div>
    </nav>
  );
};

export default Header;
