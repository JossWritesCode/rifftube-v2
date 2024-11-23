import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../actions';

const NavBar = ({ color, loggedIn, logout }) => (
  <nav className="navbar">
    <NavLink
      activeClassName="navbar-home-link-active"
      className="heading-primary-nav"
      exact
      /*style={{ color }}*/
      to="/"
    >
      RiffTube
    </NavLink>
    <NavLink activeClassName="navbar-link-active" style={{ color }} to="/riff">
      Riff<em>!</em>
    </NavLink>
    <NavLink activeClassName="navbar-link-active" style={{ color }} to="/about">
      About
    </NavLink>
    {loggedIn ? 
      (
        <React.Fragment>
          <NavLink
            activeClassName="navbar-link-active"
            style={{ color }}
            to="/account"
          >
            My Account
          </NavLink>
          <NavLink
            style={{ color }}
            onClick={ e => { logout(); e.preventDefault(); }}
            to="/logout" // this is ignored, but looks good
          >
            Sign Out
          </NavLink>
        </React.Fragment>
      ) : (
        <NavLink
          activeClassName="navbar-link-active"
          style={{ color }}
          to="/signup"
        >
          Signup
        </NavLink>
      )}
  </nav>
);
let mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
