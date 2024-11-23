import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Login from './Login/Login.jsx';
import { setRifferName, setRiffPic, getUserData } from '../actions/index.js';
import NavBar from './NavBar.jsx';
import VideoList from './VideoList.jsx';

const Account = ({
  setRifferName,
  setRiffPic,
  userData,
  getUserData,
  userInfo,
  acctImgKey,
  loggedIn,
}) => {
  const [userName, setUserName] = useState(userInfo?.name);

  useEffect(() => {
    if (loggedIn) getUserData();
  }, [getUserData, loggedIn]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userName !== '') {
      setRifferName(userName);
    }
  };

  const picSubmit = (event) => {
    event.preventDefault();
    //console.log(event.target.children[0].value);
    setRiffPic(event.target.children[0].files[0], userInfo.id);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setUserName(event.target.value);
  };

  return (
    <div className="landing-page">
      <NavBar />
      <div className="title-and-url heading">
        <h1 className="heading-primary-main account-heading">
          Account Settings
        </h1>
      </div>
      <section className="top-part">
        {loggedIn ? (
          <React.Fragment>
            <h3>
              <Link to={`/profile/${userInfo.id}`}>visit public profile</Link>
            </h3>
            <form onSubmit={(event) => handleSubmit(event)}>
              <label>
                <h3 className="account-section-title">My Riffer Name</h3>
                <input
                  onChange={(event) => handleChange(event)}
                  type="text"
                  name="name"
                  defaultValue={userInfo.name}
                  className="form-field"
                />
              </label>
              <input type="submit" value="Submit" className="btn" />
            </form>
            <img key={acctImgKey} src={`/riffer-pic/${userInfo.id}.png?${acctImgKey}`} style={{ width: '15em' }} />
            <form onSubmit={(event) => picSubmit(event)}>
              <input type="file" name="image" /><br /><br />
              <button type="submit">Upload</button>
            </form>
            <h2 className="account-section-title">My Videos</h2>
            <VideoList videoData={userData} desc={" by you"} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Login /> <p>to get started</p>
          </React.Fragment>
        )}
      </section>
    </div>
  );
};

let mapStateToProps = (state) => ({
  userData: state.userData,
  acctImgKey: state.acctImgKey,
  loggedIn: state.loggedIn,
  confirmed: state.confirmed,
  userInfo: state.userInfo,
});

const mapDispatchToProps = {
  setRifferName,
  setRiffPic,
  getUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
