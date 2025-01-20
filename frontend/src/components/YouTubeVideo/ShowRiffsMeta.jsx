import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';

/*
  props:
    showRiff
    setShowRiff
    showRiffRef
*/
const ShowRiffsMeta = (props) =>
{
    const [data, setData] = useState(null);
    useEffect(
        () =>
        {
            setData("");

            if (props.showRiff)
            {
                fetch(`/riffs/${props.showRiff.riffId}/meta`)
                .then(response => response.text())
                .then(text =>
                {
                    setData(text);
                });
            }
        },
        [props.showRiff]
    )

    useEffect(
        () =>
        {
            (props.showRiffRef.current || {}).innerHTML = data;
        },
        [props.showRiffRef, data]
    )

  return (
    <React.Fragment>
        <div className="rifftube-riffmeta-container">
        {
            props.showRiff
            ?
                <div className="rifftube-riffmeta">
                    <div ref={props.showRiffRef} />
                    <button onClick={() => props.setShowRiff(null)}>
                        Close
                    </button>
                </div>
            :
                null
            
        }
        </div>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  //metaBarPlayhead: state.metaBarPlayhead,
});

const mapDispatchToProps = {
  //setMetaBarPlayhead,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowRiffsMeta);