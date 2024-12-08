import React, { useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { getUserOptions, setUserOptions } from '../actions'

import { executeScriptElements } from './RiffControls/util.js';

const UserOptions = (props) =>
{
    let optsRef = useRef(null);
    let [editState, setEditState] = useState(false);
    let [editEl, setEditEl] = useState(null);

    const saveOptions = (body) =>
    {
        props.setUserOptions(body.detail);
        
        closeOptions();
    };
    
    const closeOptions = () =>
    {
        setEditState(false);
    };

    useEffect(() =>
    {
      document.addEventListener('rifftube:options:save', saveOptions, false);
      document.addEventListener('rifftube:options:cancel', closeOptions, false);
  
      return () =>
      {
        document.removeEventListener('rifftube:options:save', saveOptions, false);
        document.removeEventListener('rifftube:options:cancel', closeOptions, false);
      }
    }, []);

    const handleEditEl = useCallback(el => [console.log(el), el?.replaceChildren(editEl)]);

    useEffect(() =>
    {
        if (editState)
            optsRef.current.replaceChildren(editEl);
        else
            optsRef.current.innerHTML = "";
    }, [editState])

    useEffect(() =>
    {
        if (props.loggedIn && props.confirmed)
        {
            fetch("/user_options/edit")
            .then(response => response.text())
            .then(text =>
            {
                let d = document.createElement("div");
                d.innerHTML = text;
                executeScriptElements(d);
                setEditEl(d);
                //optsRef.current.replaceChildren(d);
            });
        }
        else
            optsRef.current.innerHTML = "";
    }, [props.loggedIn]);

    useEffect(() =>
    {
      if (props.loggedIn && props.userOptions == null)
        props.getUserOptions();
    }, [props.loggedIn, props.confirmed, props.userOptions])

    return (props.loggedIn ?
        (
            <>
            <div ref={optsRef}></div>
            {editState ||
            (
                <div style={{width: "50%"}}>
                    {Object.entries(props.userOptions || {}).map( ([k,v]) => (<div>{k}: {JSON.stringify(v)}</div>) )}
                    <button onClick={() => setEditState(true)}>Edit</button>
                </div>
            )}
            </>
        )
    :
        null
    );
};

let mapStateToProps = (state) => ({
    userInfo: state.userInfo,
    loggedIn: state.loggedIn,
    confirmed: state.confirmed,
    userOptions: state.userOptions,
});

const mapDispatchToProps = {
    getUserOptions,
    setUserOptions,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserOptions);
