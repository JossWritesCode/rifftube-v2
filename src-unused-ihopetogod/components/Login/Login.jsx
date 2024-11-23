import React from 'react';
import { connect } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { login, loginWithGoogle } from '../../actions/index.js';

const Login = ({ login, loginWithGoogle /*, videoID */ }) => {
  const email_ref = React.createRef();
  const pwd_ref = React.createRef();
  return (
    <React.Fragment>
      <div className="form-group">
        <label htmlFor="session_email">Email</label><br/>
        <input className="form-control" type="email" name="session[email]" id="session_email" ref={email_ref} />
      </div>
      <div className="form-group">
        <label htmlFor="session_password">Password</label><br/>
        <input className="form-control" type="password" name="session[password]" id="session_password" ref={pwd_ref} />
      </div>
      <button className='light' onClick={() => {console.log(email_ref); //debugger;
        login(email_ref.current.value, pwd_ref.current.value);
        }}>login</button>
      <br />or
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          loginWithGoogle(credentialResponse.credential);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        className="google-login"
      />
    </React.Fragment>
  );};

const mapStateToProps = (state) => ({
  //videoID: state.videoID,
});

const mapDispatchToProps = {
  login,
  loginWithGoogle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
