import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from '../actions';

const UserMenu = (props) => (
    <div style={{display: "inline-block", float: "right"}} id="nav-user-menu-cont">
        <label>
            <input type="checkbox" style={{position: "absolute", visibility: "hidden"}}
                id="nav-user-menu-checkbox" />
            <div
                id="nav-user-menu"
                style={
                    props.loggedIn && props.userInfo
                    ?
                        {backgroundImage: `url(/riffer-pic/${props.userInfo.id}.png`}
                    :
                        null
            } />
        </label>
        <div id="nav-user-menu-items">
            {props && props.loggedIn ? 
                  (
                    <div>
                        <div>
                        <NavLink
                            activeclassname="navbar-link-active"
                            style={{ color: props ? props.color : "initial" }}
                            to="/account"
                        >
                            {props.userInfo.name || "Account"}
                        </NavLink>
                        </div>
                        <div>
                        <NavLink
                            style={{ color: props ? props.color : "initial" }}
                            onClick={ e => { props.logout(); e.preventDefault(); }}
                            to="/logout" // this is ignored, but looks good
                        >
                            Sign Out
                        </NavLink>
                        </div>
                    </div>
                  ) : (
                    <NavLink
                    activeclassname="navbar-link-active"
                      style={{ color: props ? props.color : "initial" }}
                      to="/signup"
                    >
                      Signup
                    </NavLink>
                  )}
        </div>
    </div>
);

let mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
  userInfo: state.userInfo,
});

const mapDispatchToProps = {
    logout,
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