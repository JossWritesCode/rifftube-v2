import React, { useState, useEffect, createRef, useCallback } from 'react';
import { connect } from 'react-redux';
import {
  editRiff,
  deleteRiff,
  updateRiffTime,
  setFocusEl,
  BODY_SELECTOR,
  EDIT_SELECTOR,
} from '../../actions/index.js';
import Audio from '../../images/settings_voice-24px.svg';
import Text from '../../images/chat-24px.svg';

import { executeScriptElements, debounce } from './util.js';

/*
import Delete from '../../images/delete-24px.svg';
import Edit from '../../images/edit-24px.svg';
*/

/* this component is where a user can edit their riff */
function RiffDetail(props)
{
  const [visible, setVisible] = useState(false);

  //useEffect(() => { setTimeout(() => {setVisible(true);}, 20000); }, []);
  useEffect(() => {
    setVisible(true);
  }, []);

  const update = useCallback(debounce(props.updateRiffTime, 500), [props.updateRiffTime]);

  const divRef = createRef();

  useEffect(() => {
    if (props.scroll)
      divRef.current.parentNode.scrollTop = divRef.current.offsetTop;
  }, [divRef, props.scroll]);

  const timeRef = createRef();

  // uncontrolled component needs this to update value
  useEffect( () =>
  {
    timeRef.current.value = props.start;
  }, [props.start]);

  function closeDial()
  {
    let dial = document.querySelector('#rifftube-edit-dialog');
    dial.close();
    dial.remove();
    props.setFocusEl(BODY_SELECTOR);
  }
  let cancelHandler = e => { console.log("dial cancel"); closeDial(); e.preventDefault(); };


  return (
    <div
      ref={divRef}
      className={`riff-detail${props.selected ? ' riff-detail-selected' : ''}${
        visible ? '' : ' invisible'
      }`}
      style={props.style}
    >
      <button
        onClick={() => {
          props.rifftubePlayer?.seekTo(Math.max(props.start - 3, 0), true);
        }}
      >
        ⇥
      </button>
      {props.isText ? (
        <div className="text-icon riff-type-icon">
          <img alt="text" src={Text} />
        </div>
      ) : (
        <div className="audio-icon riff-type-icon">
          <img alt="audio" src={Audio} />
        </div>
      )}
      {/* 
      <li>
        start start: {props.start ? props.start.toFixed(2) : null}
      </li>
      <li>duration: {props.duration.toFixed(2)}secs</li>
      <li>type: {props.type}</li>
      */}
      <input
        type="number"
        className="edit-start"
        min="0"
        step="0.5"
        defaultValue={props.start?.toFixed(2)} // start SHOULDN'T be nil, but...
        ref={timeRef}
        onChange={() => {
          update
          (
            props.id,
            timeRef.current.value,
          );
        }}
      ></input>
      <div className="edit-riff-buttons">
        <button
          className="riff-button"
          onClick={() =>
            {
              fetch(`/riffs/${props.id}/edit`)
                .then(response => response.text())
                .then(text =>
                  {
                    // for focus
                    props.setFocusEl(EDIT_SELECTOR);

                    let el = document.createElement("dialog");
                    el.id = "rifftube-edit-dialog";
                    el.innerHTML = text;
                    executeScriptElements(el);
                    document.body.append(el);
                    el.showModal();
                    let et = el.firstElementChild;
                    let set_recorder_event = new CustomEvent("rifftube:riff:edit:setup:recorder",
                    {
                      detail: { recorder: props.recorder }
                    });
                    et.dispatchEvent(set_recorder_event);

                    let set_anim_event = new CustomEvent("rifftube:riff:edit:setup:anim");
                    et.dispatchEvent(set_anim_event);

                    el.addEventListener('cancel', cancelHandler, false);
                  });
            }
            /*
            props.editRiff(
              props.index,
              props.type === 'audio' ? props.id : null, // weird but ok; yields id or null/false
              !props.riffsAudio[props.id]
            )
            */
          }
        >
          ✎
        </button>
        <button
          className="riff-button"
          onClick={() => {
            if (window.confirm('Delete?'))
              props.deleteRiff(
                props.id,
                props.video_id,
                props.websocket
              );
          }}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  riffsAudio: state.riffsAudio.all,
  rifftubePlayer: state.rifftubePlayer,
  recorder: state.recorder,
  focusElement: state.focusElement,
});

const mapDispatchToProps = {
  editRiff,
  deleteRiff,
  updateRiffTime,
  setFocusEl,
};

export default connect(mapStateToProps, mapDispatchToProps)(RiffDetail);
