import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import RiffList from './RiffList.jsx';
import Login from '../Login/Login.jsx';

import { setRifferName, setPlayerMode, setRecorder,
  saveNewRiff, saveEditRiff, setVideoID, getAllRiffs, getMyRiffs, getUserOptions,
  PLAY_MODE,
  PAUSE_MODE,
  setFocusEl,
  BODY_SELECTOR,
  EDIT_SELECTOR,
} from '../../actions/index.js';

import { executeScriptElements, extractVideoID, riffFD2Obj } from './util.js';

/*This component houses all of the riff buttons and the rifflist*/
const EditControls = (props) =>
{
  // TODO: maybe: cut out the template?
  // just use ref for the dialog?
  let templateRef = React.useRef(null);
  const navigate = useNavigate();

  // needed to send the immediate save message
  const [editEl, setEditEl] = useState(null);

  // enforce focus on body once a second
  useEffect( () =>
  {
    const body = document.body;
    body.setAttribute("tabIndex", 1);
    const focInt = setInterval(resetFocus, 1000);
    function resetFocus()
    {
      // allow focus to leave the body if not logged in
      if (!props.loggedIn) return;
      // don't set focus if the prop is empty
      if (props.focusElement === '') return;
      // don't set focus if recording:
      // this is only needed to avoid a Chrome bug
      // where the :active CSS pseudoelement stops working
      // when focus is set
      if (window?.rifftube?.recording) return;

      // new: don't change focus if the
      // active element is a textarea
      // or any input element (maybe restrict?)
      if (
        ["TEXTAREA", "INPUT"]
        .includes(document.activeElement?.tagName)
      ) return;

      // TODO: remove the behavior for focusElement == ''
      // because it can be handled by the above


      const focusEl = document.querySelector(props.focusElement);
      
      if (document.activeElement !== focusEl)
      {
        focusEl.focus();
        console.log("reset focus", document.activeElement, focusEl);
      }
    }

    return () => clearInterval(focInt);
  }, [props.loggedIn, props.focusElement])

  let cancelHandler = e => { console.log("dial cancel"); closeDial(); e.preventDefault(); };

  // get user permission to record and save mediaRecorder object
  useEffect( () =>
  {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        let mediaRecorder = new MediaRecorder(stream);
        props.setRecorder(mediaRecorder);
      });
  }, []);

  // useCallback because the values of recorder and rifftubePlayer can change
  const keydown = useCallback( (e) =>
    {
      // ignore if not logged in
      if (!props.loggedIn || !props.confirmed) return;

      // ignore if the edit dialog is open
      if (document.querySelector('.rifftube-riff-edit-dialog')) return;

      let startNewRiff = (immediateRecord) =>
      {
        // based on options, maybe pause now
        if (props.userOptions.pause_to_riff)
          props.setPlayerMode(PAUSE_MODE);

        let td = templateRef.current.content.firstChild.cloneNode(true);
        td.id = "rifftube-edit-dialog";
        document.body.append(td);
        console.log("set cur dial", td);
        // TODO: actually keep track of the cur dialog...
        // or change logic here to Be Better
        td.showModal();

        let et = td.firstElementChild;

        // set these state variables for the component
        // they are the edit dialog element,
        // and the CSS selector for it
        setEditEl(et);

        //console.log("edit controls set edit el", et);

        // set focus to edit dialog
        props.setFocusEl(EDIT_SELECTOR);

        // new: should not be needed:
        /*
        if (e.key == 'r')
          props.setFocusEl(EDIT_SELECTOR);
        else
          props.setFocusEl(''); // the empty string signifies take no action
        */

        // set up recorder and start time
        let set_recorder_event = new CustomEvent("rifftube:riff:edit:setup:recorder",
        {
          detail: { recorder: props.recorder }
        });
        et.dispatchEvent(set_recorder_event);

        let set_anim_event = new CustomEvent("rifftube:riff:edit:setup:anim");
        et.dispatchEvent(set_anim_event);

        let set_start_event = new CustomEvent("rifftube:riff:edit:setup:start",
        {
          detail: { start: props.rifftubePlayer?.getCurrentTime?.() || 0 }
        });
        et.dispatchEvent(set_start_event);

        let immediate_start_event = new CustomEvent("rifftube:riff:edit:start",
        {
          detail: { type: immediateRecord }
        });
        et.dispatchEvent(immediate_start_event);

        td.addEventListener('cancel', cancelHandler, false);

        //console.log('dispatched', set_recorder_event, set_start_event);
      }
      
      /*
      console.log('kd meta count', e.getModifierState("Control") ||
        e.getModifierState("Alt") ||
        e.getModifierState("Meta"));
        */

      if ( e.getModifierState("Control") ||
              e.getModifierState("Alt") ||
              e.getModifierState("Meta") )
          return;

      if (e.key == 'r' || e.key == 't')
      {
        // immediate record if pressing r but not t
        startNewRiff(e.key);
      }
    },
    [
      props.recorder,
      props.rifftubePlayer,
      props.loggedIn, 
      props.confirmed, 
      props.userOptions,
    ] );

  const closeDial = useCallback(() =>
  {
    // used to set focus
    props.setFocusEl(BODY_SELECTOR);

    let dial = document.querySelector('#rifftube-edit-dialog');
    dial.close();
    dial.remove();

    console.log("close dial user options", props.userOptions);

    // depending on options, maybe play now
    if (props.userOptions?.play_after_riff)
      props.setPlayerMode(PLAY_MODE);
  },
  [
    props.userOptions,
  ]);

  const saveRiff = useCallback(({ detail }) =>
  {
    // detail is FormData
    //console.log( "sr", detail );
    
    let riff = riffFD2Obj(detail);

    console.log("save riff user info", riff, props.userInfo);

    // mark as unsaved
    riff.unsaved = true;

    // add user id:
    riff.user_id = props.userInfo.id;

      //...action.payload,
    //delete riff.payload;
    
    if ( riff.id )
    {
      props.saveEditRiff(detail, riff);
    }
    else
    {
      props.saveNewRiff(detail, riff);
    }

    closeDial();
  }, [props.userInfo, props.userOptions, props.saveEditRiff, props.saveNewRiff]);

  //console.log("ue", props.userOptions);
  const riffFinish = useCallback( () =>
  {
    //console.log("ue", props.userOptions);

    // based on options, maybe pause now
    // if no pause on start riff, should pause now
    if (props.mode == PLAY_MODE && !props.userOptions.pause_to_riff)
      props.setPlayerMode(PAUSE_MODE);

    // also based on options, maybe save immediately
    if (props.userOptions.immediate_save)
    {
      let edit_save_event = new CustomEvent("rifftube:riff:edit:trigger-save");
      editEl.dispatchEvent(edit_save_event);
    }
  }, [editEl, props.userOptions, props.mode] );
  
  useEffect(() =>
  {
    document.addEventListener('rifftube:riff:edit:save', saveRiff, false);
    document.addEventListener('rifftube:riff:edit:close', closeDial, false);

    return () =>
    {
      document.removeEventListener('rifftube:riff:edit:save', saveRiff, false);
      document.removeEventListener('rifftube:riff:edit:close', closeDial, false);
    }
  }, [props.userInfo, props.userOptions]);

  useEffect(() =>
  {
    document.addEventListener('keydown', keydown, false);

    return () =>
    {
      document.removeEventListener('keydown', keydown, false);
    }
  }, [keydown]);

  // this (and above) are special because the event listeners are connected
  // to functions that are updated, hence the dependencies lists
  useEffect(() =>
  {
    document.addEventListener('rifftube:riff:edit:riff:finish', riffFinish, false);

    return () =>
    {
      document.removeEventListener('rifftube:riff:edit:riff:finish', riffFinish, false);
    }
  }, [editEl, props.userOptions, props.mode]);

  
  
  useEffect(() =>
  {
    if (props.loggedIn && props.confirmed)
    {
      fetch(`/riffs/new?video_id=${props.videoID}`)
        .then(response => response.text())
        .then(text =>
          {
            let dial = document.createElement("dialog");
            dial.innerHTML = text;
            let el = templateRef.current;
            el.content.replaceChildren(dial);
            executeScriptElements(dial);
          });
          
    }
  }, [props.videoID, props.loggedIn, props.confirmed]);

  //console.log("ue", props.userOptions);
  useEffect(() =>
  {
    console.log("edit controls ue check user options", props.userOptions);
    if (props.loggedIn && props.userOptions == null)
      props.getUserOptions();
  },
  [props.loggedIn, props.userOptions]);

  return (
        <div className="control-panel">
          <button className="btn" id="change-video-btn" onClick={(e) => {
              const vPrompt = prompt("Paste YouTube URL or video ID:");
              if ( vPrompt )
              {
                const vID = extractVideoID(vPrompt);
                navigate(`/riff/${vID}`);
                props.setVideoID(vID);
                props.getAllRiffs(vID);
                props.getMyRiffs(vID);
              }
            }}>
            Change Video
          </button>
          {
            props.loggedIn ?
            (
              <React.Fragment>
                {
                  props.userInfo?.name ?
                  (
                    <div className="riffer-name">
                      Riffer Name:&nbsp;
                      {props.userInfo.name}
                    </div>
                  ) : null

                  /* to add back later <Collaboration /> */
                }
                <div id="recBtn"
                  onMouseDown={e=>
                  {
                    ;
                  }
                  }></div>
                <RiffList />
                <template ref={templateRef}></template>
              </React.Fragment>
            ) : 
              <div>
                <h2 className="add-riff-title">Sign In</h2>
                <Login /> <p>to get started</p>
              </div>
          }
        </div>
  );
}

let mapStateToProps = (state) => ({
  mode: state.mode,
  userInfo: state.userInfo,
  videoID: state.videoID,
  duration: state.duration,
  recorder: state.recorder,
  loggedIn: state.loggedIn,
  confirmed: state.confirmed,
  rifftubePlayer: state.rifftubePlayer,
  userOptions: state.userOptions,
  focusElement: state.focusElement,
});

const mapDispatchToProps = {
  setRifferName,
  setPlayerMode,
  setRecorder,
  saveNewRiff,
  saveEditRiff,
  setVideoID,
  getAllRiffs,
  getMyRiffs,
  getUserOptions,
  setFocusEl,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditControls);




      /*
      let newRiffDialog = document.createElement("dialog");
      templateRef.current.content.append(newRiffDialog);
      let newRiffFrame = document.createElement("iframe");
      newRiffFrame.setAttribute("allow", "microphone");
      newRiffDialog.append(newRiffFrame);
      newRiffFrame.src = `${baseURL2}/riffs/new?video_id=${props.videoID}`;
      */



    /*
    const blurEvent = () =>
    {
      setTimeout(() => {
        document.activeElement.blur();
      }, 100);
    };
    window.addEventListener('blur', blurEvent);
    const keydownEvent = (e) => {
      console.log(props.mode);

      if (e.key === 'r') props.createTempRiff('audio', props.videoID, true);
      else if (e.key === 't') props.createTempRiff('text', props.videoID);
      else if (props.mode === EDIT_MODE || props.mode === EDIT_NEW_MODE) return;
      else if (e.key === 'j' || e.key === 'ArrowLeft' || e.key === 'Left')
        // I actually took MS specific BS into account
        window.rifftubePlayer.seekTo(
          Math.max(window.rifftubePlayer.getCurrentTime() - 5, 0),
          true
        );
      else if (e.key === 'l' || e.key === 'ArrowRight' || e.key === 'Right')
        window.rifftubePlayer.seekTo(
          Math.min(window.rifftubePlayer.getCurrentTime() + 5, props.duration),
          true
        );
      else if (e.key === ' ' || e.key === 'k') {
        props.togglePlayerMode();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', keydownEvent);

    return () => {
      window.removeEventListener('blur', blurEvent);
      window.removeEventListener('keydown', keydownEvent);
    };
  }, [props]);
  */

  //console.log("ec props", props);