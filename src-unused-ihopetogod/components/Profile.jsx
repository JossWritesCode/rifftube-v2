import React, { useEffect } from 'react';
import { connect } from 'react-redux';
<<<<<<<< HEAD:src-unused-ihopetogod/components/Profile.jsx
========
import { useParams } from 'react-router-dom';
>>>>>>>> 9c378a38a (new frontend):frontend/src/components/Profile.jsx
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
<<<<<<<< HEAD:src-unused-ihopetogod/components/Profile.jsx
        <UserVote gradeeId={userID} />
========
        <UserVote gradeeId={params.userID} />
>>>>>>>> 9c378a38a (new frontend):frontend/src/components/Profile.jsx
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
