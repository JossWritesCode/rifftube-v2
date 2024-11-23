import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getGlobalVideoList } from '../actions/index.js';
import NavBar from './NavBar.jsx';
import VideoList from './VideoList.jsx';

const TheList = ({ globalVideoList, getGlobalVideoList }) => {
  useEffect(() => {
    getGlobalVideoList();
  }, [getGlobalVideoList]);

  return (
    <div className="landing-page">
      <NavBar />
      <div className="title-and-url heading">
        <h1 className="heading-primary-main account-heading">The List</h1>
      </div>
      <section className="top-part">
        <h2 className="account-section-title">
          every movie with at least one riff added to it
        </h2>
        <Link to="/users">
          <h4>See all riffers instead</h4>
        </Link>
        <VideoList userData={globalVideoList} />
      </section>
    </div>
  );
};

let mapStateToProps = (state) => ({
  globalVideoList: state.globalVideoList,
});

const mapDispatchToProps = {
  getGlobalVideoList,
};

export default connect(mapStateToProps, mapDispatchToProps)(TheList);
