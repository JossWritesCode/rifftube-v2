import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';

/*
  props:
    showRiff
    setShowRiff
    showRiffRef
    setRiffMute
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
                fetch(`/riffs/${props.showRiff.id}/meta`)
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

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                defaultChecked={props.showRiff.mute}
                                onChange={e => props.setRiffMute(props.showRiff.user_id, props.showRiff.id, e.target.checked)} />
                            Mute Riff
                        </label>
                    </div>

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