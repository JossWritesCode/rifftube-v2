import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';

/*
  props:
    zoomState, setZoomState
*/
const VideoSidebar = (props) =>
{
  console.log("Radio killed the Video Sidebar");

  return (
    <React.Fragment>
      <div className="video-sidebar">
        <label className="video-sidebar-zoom-lbl">
          <div>
            <input
              type="checkbox"
              defaultChecked={props.zoomState}
              onChange={e => props.setZoomState(e.target.checked)} />
              Zoom
          </div>
        </label>
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoSidebar);