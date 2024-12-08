import React from 'react';
import { Link } from 'react-router-dom';

const VideoList = ({ videoData, desc = '' }) => (
  <ul className='my-videos-list'>
    {videoData && videoData.map &&
      videoData.map(({ url, title, count, id }) => (
        <li className="my-video" key={id}>
          <h3 className="my-video-title">
            <Link to={`/view/${url}`}>
              <img
                alt="video frame"
                src={`https://img.youtube.com/vi/${url}/1.jpg`}
                style={ {verticalAlign: "middle"} }
              />
              &nbsp; {/*title.length > 40 ? title.slice(0, 40) + '...' : title*/}
              <div style={{width: "50%", display: "inline-block", verticalAlign: "middle"}}>
                {title}
              </div>
              &nbsp;
              <span  style={{fontStyle: "italic"}}>
                ({count} riff{count === 1 ? '' : 's'}{desc}) &nbsp;&nbsp;  
              </span>
            </Link>
            (
              <Link to={`/riff/${url}`}>
                Riff
                <span style={{fontSize: "200%"}}>🎙</span>
              </Link>
            )
          </h3>
        </li>
      ))}
  </ul>
);

export default VideoList;
