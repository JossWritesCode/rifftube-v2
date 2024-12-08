import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../actions';

//const NavBar = ({ color, loggedIn, logout }) => (
const NavBar = (props) => (
  <nav className="navbar">
    <NavLink
      activeclassname="navbar-home-link-active"
      className="heading-primary-nav"
      /*style={{ color }}*/
      to="/"
    >
      RiffTube
    </NavLink>
    <NavLink activeclassname="navbar-link-active" style={{ color: props ? props.color : "initial" }} to="/riff">
      Riff<em>!</em>
    </NavLink>
    <NavLink activeclassname="navbar-link-active" style={{ color: props ? props.color : "initial" }} to="/about">
      About
    </NavLink>
    {props && props.loggedIn ? 
      (
        <React.Fragment>
          <NavLink
            activeclassname="navbar-link-active"
            style={{ color: props ? props.color : "initial" }}
            to="/account"
          >
            My Account
          </NavLink>
          <NavLink
            style={{ color: props ? props.color : "initial" }}
            onClick={ e => { props.logout(); e.preventDefault(); }}
            to="/logout" // this is ignored, but looks good
          >
            Sign Out
          </NavLink>
        </React.Fragment>
      ) : (
        <NavLink
        activeclassname="navbar-link-active"
          style={{ color: props ? props.color : "initial" }}
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
