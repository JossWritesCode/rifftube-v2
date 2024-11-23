import React from 'react';
import { Link } from 'react-router-dom';

const VideoList = ({ videoData, desc = '' }) => (
  <ul className='my-videos-list'>
    {videoData &&
      videoData.map(({ url, title, count }) => (
        <li className="my-video">
          <h3 className="my-video-title">
            <Link to={`/view/${url}`}>
              <img
                alt="video frame"
                src={`https://img.youtube.com/vi/${url}/1.jpg`}
                style={ {verticalAlign: "middle"} }
              />
            &nbsp; {title.length > 40 ? title.slice(0, 40) + '...' : title} &nbsp;
            &nbsp; ({count} riff{count === 1 ? '' : 's'}{desc}) &nbsp; (View) &nbsp;
            </Link>
            <Link to={`/riff/${url}`}>(Riff)</Link>
          </h3>
        </li>
      ))}
  </ul>
);

export default VideoList;
