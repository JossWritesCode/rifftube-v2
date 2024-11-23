import React from 'react';
import { connect } from 'react-redux';
import EditInterface from './components/RiffControls/EditInterface.jsx';
import ViewInterface from './components/ViewInterface/ViewInterface.jsx';
import LandingPage from './components/LandingPage.jsx';
import UserList from './components/UserList.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About.jsx';
import Account from './components/Account.jsx';
import Profile from './components/Profile.jsx';
import Signup from './components/Signup.jsx';
import { currentUserStatus, } from './actions/index.js';

class App extends React.Component {

  componentDidMount = () => {
      // check if user is logged in
      this.props.currentUserStatus();
    }

  render() {
    return (
      <div className="App">
        <div>
          test
        </div>
        <Router>
          <Routes>
            <Route exact path="/" Component={LandingPage} />
            <Route exact path="/users" Component={UserList} />
            <Route exact path="/riff" Component={EditInterface} />
            <Route exact path="/riff/:videoID" Component={EditInterface} />
            <Route exact path="/about" Component={About} />
            <Route exact path="/view/:videoID" Component={ViewInterface} />
            <Route exact path="/account" Component={Account} />
            <Route exact path="/profile/:userID" Component={Profile} />
            <Route exact path="/signup" Component={Signup} />
          </Routes>
        </Router>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = {
  currentUserStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);