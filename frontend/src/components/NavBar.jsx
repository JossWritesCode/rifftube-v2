import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout, setVideoID, getAllRiffs, getMyRiffs } from '../actions';
import { extractVideoID } from '../util.js';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

//const NavBar = ({ color, loggedIn, logout }) => (
const NavBar = (props) =>
{

  const navigate = useNavigate();
  
  return (
    <nav className="navbar">
      <NavLink
        activeclassname="navbar-home-link-active"
        className="heading-primary-nav"
        /*style={{ color }}*/
        to="/"
      >
        RiffTube
      </NavLink>
      <NavLink activeclassname="navbar-link-active" style={{ color: props ? props.color : "initial" }} to="/about">
        About
      </NavLink>
      <NavLink activeclassname="navbar-link-active" style={{ color: props ? props.color : "initial" }} to="/riff">
        Riff<em>!</em>
      </NavLink>
      {props && props.loggedIn ? 
        (
          <React.Fragment>
            <NavLink
              style={{ color: props ? props.color : "initial" }}
              to="/change-video" // this is ignored, but looks good
              onClick={(e) => {
                e.preventDefault();
                const vPrompt = prompt("Paste YouTube URL or video ID:");
                if ( vPrompt )
                {
                  const vID = extractVideoID(vPrompt);
                  navigate(`/riff/${vID}`);
                  props.setVideoID(vID);
                  props.getAllRiffs(vID);
                  props.getMyRiffs(vID);
                }
              }}>
              Change Video
            </NavLink>
            <UserMenu />
          </React.Fragment>
        ) : (
          <NavLink
          activeclassname="navbar-link-active"
            style={{ color: props ? props.color : "initial" }}
            to="/signup"
          >
            Sign Up
          </NavLink>
        )}
    </nav>
  );
}

let mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
});

const mapDispatchToProps = {
  logout,
  setVideoID,
  getAllRiffs,
  getMyRiffs,
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
