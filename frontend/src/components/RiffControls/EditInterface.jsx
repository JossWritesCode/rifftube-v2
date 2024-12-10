import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import YouTubeVideo from '../YouTubeVideo/YouTubeVideo.jsx';
import EditControls from './EditControls.jsx';
import {
  setVideoID,
  getAllRiffs,
  getMyRiffs,
  setWebSocket,
  getRiffsMeta,
  getRiffs,
  setAudioPlayers,
  setAudioPlayerNotInUse,
  cableUpdate,
  cableDelete,
  EMPTY_RIFFS,
  setFocusEl,
  BODY_SELECTOR,
} from '../../actions/index.js';
import MetaBar from '../MetaBar.jsx';
import NavBar from '../NavBar.jsx';

import consumer from "./cable/consumer.js"

const EditInterface = (props) => {
  
  const introDialogRef = React.createRef();

  const params = useParams();
  const navigate = useNavigate();

  const setupAudioPlayers = () =>
  {
    // set focus to body element
    props.setFocusEl(BODY_SELECTOR);

    console.log("setup audio players");
    let audioPlayers = [];
    let audioPlayersCount = 5;
    for (let i = 0; i < audioPlayersCount; i++) {

      audioPlayers[i] = new Audio(); // should be identical behavior to: document.createElement('audio');
      audioPlayers[i].controls = false;
      audioPlayers[i].addEventListener('ended', () =>
      {
        console.log('audio playback end', i);
        props.setAudioPlayerNotInUse(i);
      });
    }

    props.setAudioPlayers(audioPlayers);
  };

  const handleWSConnection = (vid) =>
  {
    var arr_of_identifiers = consumer.subscriptions.subscriptions.map(s => {
      return s.identifier
    });
    //debugger;
    /*
    var is_subscribed = false;
    for (const identifier of arr_of_identifiers) {
      if(identifier.includes(chatRoomId)) {
        is_subscribed = true;
        break;
      }
    }
    console.log(is_subscribed);
    if(is_subscribed == false) {
      // subscribe to server
    }
    */


    console.log("loading notif channel js", vid);

    // disconnect the previous ws

    console.log(props.websocket);

    if (props.websocket) return;

    if (props.websocket) consumer.subscriptions.remove(props.websocket);

    const self = this;

    // set up new ws (cable subscription)
    const ws = consumer.subscriptions.create({channel: "NotifChannel", video_id: vid}, {
      connected() {
        // Called when the subscription is ready for use on the server
        console.log("cable connected", vid);
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        console.log("actioncable received!", data);

        // currently being used only to talk to self
        // an odd situation for sure
        if (data.from != self.props.userInfo.id) return;

        debugger;
        if (data.cmd == "update")
        {
          self.props.cableUpdate(data);
        }
        else if (data.cmd == "delete")
        {
          self.props.cableDelete(data);
        }
      },

      rejected()
      {
        console.log("ActionCable rejected!");
      }
    });

    // set global ws state
    setWebSocket(ws);

    console.log(ws);
  }

  useEffect(() => {
    if (params.videoID) {
      props.setVideoID( params.videoID );
      props.getAllRiffs( params.videoID );
      props.getMyRiffs( params.videoID );
      const vid = params.videoID;
      handleWSConnection(vid);
    }
    introDialogRef.current?.showModal();
    // sets the focus element to the ok button
    // when the intro dialog is shown
    props.setFocusEl("#introDialog button");
    
  }, []);
  

  // watch for video id change
  useEffect(() => {
  
    if (!params.videoID)
    {
      // props.videoID has a default it can fall back on if needed
      navigate(`/riff/${props.videoID}`);
    }
    else if (params.videoID !== props.videoID) {
      props.setVideoID( params.videoID );
      props.getRiffs(props.videoID);

      const vid = params.videoID;
      handleWSConnection(vid);
    }
  }, [params.videoID]);

  

  // I think needed?
  useEffect(() =>
  {
    if ( props.riffs == EMPTY_RIFFS)
    {
      console.log("getRiff invoked because riffs is null");
      props.getRiffs(props.videoID);
    }
  });


  /*
  if (
    props.loggedIn &&
    (!props.websocket || props.videoID !== prevProps.videoID)
  ) {
    //const websocket = new WebSocket( `ws://localhost:3300/riff?videoID=${params.videoID}&googleToken=${props.googleUser.getAuthResponse().id_token}` );
    var baseURL;
    if (process.env.NODE_ENV === 'production')
      baseURL = 'wss://rifftube.herokuapp.com';
    else baseURL = 'ws://localhost:3300';

    const websocket = new WebSocket(
      `${baseURL}/riff?videoID=${
        params.videoID
      }&googleToken=${props.googleUser.getAuthResponse().id_token}`
    );
    websocket.onmessage = (event) => {
      console.log(event.data);

      const msg = JSON.parse(event.data);

      if (msg.video_id === props.videoID && msg.type === 'update')
        props.getRiffsMeta(props.videoID);
    };
    props.setWebSocket(websocket);
  }
  */

  return (
    <React.Fragment>
      <NavBar color="grey" />

      <dialog
        id="introDialog"
        ref={introDialogRef}
        style={{ inset: "20%", zIndex: 1, }}>
        <div style={{fontSize: "180%",}}>
          <h1>Getting Started</h1>
          <p>
            To record a riff, press and hold the R key. Recording occurs while the key is held down.
          </p>
          <p>
            To create a new text riff, press and hold the T key.
          </p>
          <p>
            You can add audio to a text riff, or remove audio and use only text, at any time.
          </p>
          <p>
            ⇥ means &quot;jump to&quot;
          </p>
          <p>
            ✎ means &quot;edit&quot;
          </p>
          <p>
            🗑 means &quot;delete&quot;
          </p>
          <p>
            Adjust the timing by 0.5 seconds with the up and down arrows.
          </p>
          <p>
            If pressing R and T does not bring up the New Riff dialog,
            click somewhere outside the YouTube video.
          </p>
          <form method="dialog">
            <button
              onClick={ () => setupAudioPlayers() }>
                OK
            </button>
          </form>
        </div>
      </dialog>

      
      <div className="main-section">
        <div className="youtube-section">
        { props.loggedIn && !props.confirmed ?
            <div className="need-to-confirm-div">You need to confirm your email address.
              <button type="button"
                onClick={ () =>
                  fetch("/user/confirm/reissue", { method: "POST" })
                  .then( () => alert("Done! Check your email for the welcome letter.") )
                  .catch( err => { console.log(err); alert("Error sending welcome letter. Please try again later.") } )
                }>
                  Click here
                </button> to re-send
              the welcome letter with confirmation link.
            </div>
          : '' }
          <YouTubeVideo id={props.videoID} riffs={props.riffs} />
          <MetaBar />
          <div className="view-share-riff-link">
            <a
              href={`/view/${props.videoID}${props.userInfo ? `?solo=${props.userInfo.id}` : ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Riffed Video
            </a>
          </div>
        </div>
      <EditControls history={props.history} />
      </div>
    </React.Fragment>
  )
};

const mapStateToProps = (state) => ({
  riffs: state.riffs,
  videoID: state.videoID,
  loggedIn: state.loggedIn,
  confirmed: state.confirmed,
  userInfo: state.userInfo,
  websocket: state.websocket,
});

const mapDispatchToProps = {
  setVideoID,
  getAllRiffs,
  getMyRiffs,
  setWebSocket,
  getRiffsMeta,
  getRiffs,
  setAudioPlayers,
  setAudioPlayerNotInUse,
  cableUpdate,
  cableDelete,
  setFocusEl,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditInterface);
