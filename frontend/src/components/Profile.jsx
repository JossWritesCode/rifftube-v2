import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPublicUserData } from '../actions/index.js';
import NavBar from './NavBar.jsx';
import VideoList from './VideoList.jsx';
import UserVote from './UserVote.jsx';

const Profile = ({
  publicProfileData,
  publicProfileName,
  getPublicUserData,
}) => {

  const params = useParams();

  useEffect(() => {
    getPublicUserData(params.userID);
  }, [getPublicUserData, params.userID]);

  return (
    <div className="landing-page">
      <NavBar />
      <div className="title-and-url heading">
        <h1 className="heading-primary-main account-heading">
          Profile for &quot;{publicProfileName}&quot;
        </h1>
      </div>
      <section>
        <UserVote gradeeId={params.userID} />
      </section>
      <section className="top-part">
        <h2 className="account-section-title">Videos</h2>
        <VideoList videoData={publicProfileData} desc={` by ${publicProfileName}`} />
      </section>
    </div>
  );
};

let mapStateToProps = (state) => ({
  publicProfileData: state.publicProfileData,
  publicProfileName: state.publicProfileName,
});

const mapDispatchToProps = {
  getPublicUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
