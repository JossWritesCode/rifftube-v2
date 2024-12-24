import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../actions';

//const NavBar = ({ color, loggedIn, logout }) => (
const UserMenu = (props) => (
    <div
        className="nav-user-menu"
        style={
            props.loggedIn && props.userInfo
            ?
                {backgroundImage: `url(/riffer-pic/${props.userInfo.id}.png`}
            :
                null} />
);

let mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
  userInfo: state.userInfo,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);

`
/*
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
  */

  `