import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getGlobalVideoList } from '../actions';

import VideoList from './VideoList';
import NavBar from './NavBar.jsx';

//const LandingPage = ({ globalVideoList, getGlobalVideoList }) => {
const LandingPage = (props) => {

  //console.log("LP", props);

  useEffect(() => {
    props.getGlobalVideoList();
  }, [props.getGlobalVideoList]);

 return (
  <React.Fragment>
    <NavBar color="grey" />
    <div className="landing-page">
      <h2 className="account-section-title">
        Every YouTube movie on RiffTube
      </h2>
        <Link to="/users">
          <h4 className="account-section-title">See all riffers instead</h4>
        </Link>
      <VideoList videoData={props.globalVideoList} />
      <section className="bottom-part">
        <footer className="landing-footer">
          Copyright © 2024 - All rights reserved
        </footer>
      </section>
    </div>
  </React.Fragment>
 );
};


const mapStateToProps = (state) => ({
  globalVideoList: state.globalVideoList,
});

const mapDispatchToProps = {
  getGlobalVideoList,
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);