import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import NavBar from './NavBar.jsx';

const Signup = ({
    history,
}) => {

    const [lastError, setLastError] = useState(null);
    const navigate = useNavigate();
    
    const signup = (email, password, name, pic) =>
    {
        let fd = new FormData();
        fd.append('user[email]', email);
        fd.append('user[password]', password);
        fd.append('user[name]', name);
        fd.append('user[riff_pic]', pic)
        axios({
            method: 'post',
            url: `/users`,
            data: fd,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then((res) => {
            //debugger;
            navigate('/');
            //dispatch({ type: SIGNUP, payload: res.data });
        }).catch(err => {
            console.log("error", err);
            setLastError(err?.response?.data);
            //dispatch({ type: SET_ERROR, payload: err?.response?.data })
        });
    };

    const signupWithGoogle = (credentials, password, name, pic) =>
    {
        let fd = new FormData();
        fd.append('credentials', credentials);
        fd.append('user[password]', password);
        fd.append('user[name]', name);
        fd.append('user[riff_pic]', pic)
        axios({
            method: 'post',
            url: `/signup-with-google`,
            data: fd, //{ credentials, password, name, pic },
        }).then((res) => {
            //debugger;
            navigate('/');
            //dispatch({ type: SIGNUP, payload: res.data });
        }).catch(err => {
            console.log("error", err);
            setLastError(err?.response?.data);
            //dispatch({ type: SET_ERROR, payload: err?.response?.data })
        });
    };

    const email_ref = React.createRef();
    const pwd_ref = React.createRef();
    const name_ref = React.createRef();
    const pic_ref = React.createRef();

    useEffect(() => {
    //getPublicUserData(userID);
    }, [/*getPublicUserData, userID*/]);

    return (
    <div className="landing-page">
        <NavBar />
        <div className="title-and-url heading">
        <h1 className="heading-primary-main account-heading">
            Sign up for RiffTube
        </h1>
        {
            lastError ?
                <pre className="error_alert">
                    { lastError }
                </pre>
            :
                null
        }
        </div>
        <section className="top-part">
        <div className="form-group">
        <label htmlFor="user_email">Email</label><br/>
        <input className="form-control" type="email" name="user[email]" id="user_email" ref={email_ref} />
        </div>
        <div className="form-group">
        <label htmlFor="user_password">Password</label><br/>
        <input className="form-control" type="password" name="user[password]" id="user_password" ref={pwd_ref} />
        </div>
        <div className="form-group">
        <label htmlFor="user_password_confirmation">Password confirmation</label><br/>
        <input className="form-control" type="password" name="user[password_confirmation]" id="user_password_confirmation" />
        </div>
        <div className="form-group">
        <label htmlFor="user_name">Riffer Name</label><br/>
        <input className="form-control" type="text" name="user[name]" id="user_name" ref={name_ref} />
        </div>
        <div className="form-group">
        <label htmlFor="profile_pic">Profile Pic (optional)</label><br/>
        <input type="file" name="user[riff_pic]" id="profile_pic" ref={pic_ref} />
        </div>
        <div className="form-group">
        <button onClick={() => {
            signup(email_ref.current.value, pwd_ref.current.value, name_ref.current.value, pic_ref.current.files[0]);
            //history.push('/');
        }}>Create User</button>
        </div>
        or
        <GoogleLogin
            onSuccess={credentialResponse => {
                console.log(credentialResponse);
                signupWithGoogle(credentialResponse.credential, pwd_ref.current.value, name_ref.current.value, pic_ref.current.files[0]);
                //history.push('/');
            }}
            onError={() => {
                console.log('Login Failed');
            }}
            className="google-login"
            text="signup_with"
        />
        (email is provided by google signin)
        </section>
    </div>
    );
};

let mapStateToProps = (state) => ({
  //lastError: state.lastError,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
