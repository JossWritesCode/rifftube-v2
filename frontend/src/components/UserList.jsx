import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


import NavBar from './NavBar.jsx';

const UserList = () =>
{
    const [userList, setUserList] = useState(null)

  useEffect(() => {
    fetch('/users')
        .then(response => response.json())
        .then(json => setUserList(json));
  }, []);

 return (
  <React.Fragment>
    <NavBar color="grey" />
    <div className="landing-page">
      <h2 className="account-section-title">
        Every Riffer on RiffTube
      </h2>
    <Link to="/">
        <h4 className="account-section-title">See all videos instead</h4>
    </Link>
      <ul className='my-videos-list'>
        {
            userList &&
            userList.map(({ id, name }) => (
            <li className="my-video">
                    <Link to={`/profile/${id}`}>
                        <img
                        alt={`${name}`}
                        src={`/riffer-pic/${id}.png`}
                        style={ {width: "5em", verticalAlign: "middle"} }
                        />
                <h3 className="my-video-title" style={{display: "inline-block"}}>
                    &nbsp; {`${name}`}
                    <br />
                    &nbsp; {`R-ID#${id}`}
                </h3>
                    </Link>
            </li>
            ))
        }
      </ul>
      <section className="bottom-part">
        <footer className="landing-footer">
          Copyright © 2024 - All rights reserved
        </footer>
      </section>
    </div>
  </React.Fragment>
 );
};


let mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);