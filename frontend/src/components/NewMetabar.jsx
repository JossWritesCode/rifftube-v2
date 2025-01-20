import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import YouTubeVideo from './YouTubeVideo/YouTubeVideo';
import { setMetaBarPlayhead, setMetaBarCallback } from '../actions';

/*
  props:
    riffs:
      array of riffs
    userInfo:
      present only if logged in.
      If passed, will display the logged-in UI,
      with user's riffs at the top.
*/
const NewMetabar = (props) =>
{
  // real values don't matter for the initialization maybe
  const [state, setState] = useState({ riffsByRiffer: [], myTracks: null, filteredRiffs: [] });
  const [zoomState, setZoomState] = useState(false);
  const [search, setSearch] = useSearchParams();
  
  const scrollDiv = useRef();
  const playhead = useRef();

  const mbc = useCallback(() =>
  {
    // is this the stupidest thing ever?
    const halfVid = scrollDiv.current?.parentElement.offsetWidth / 2
    const fullWidth = scrollDiv.current?.offsetWidth;
    const curPos = props.metaBarPlayhead?.current?.offsetLeft
    const offset = halfVid - curPos;
    //console.log("mbc", offset);
    (scrollDiv.current || {}).style.setProperty("--scroll",
      (curPos > halfVid && curPos < fullWidth - halfVid)
      ?
        `${offset}px`
      :
        Math.min(0, Math.max(halfVid - fullWidth, offset)));
  },
  [props.metaBarPlayhead]);

  useEffect(
    () => 
    {
      props.setMetaBarPlayhead(playhead);
    },
    []
  );
  
  useEffect(
    () => 
    {
      props.setMetaBarCallback(mbc);
    },
    [props.metaBarPlayhead]
  );

  // logic here is: use the opposite of muted,
  // unless toggling this riffer, then use muted:
  // (riffer.id == id) ? riffer.muted : !riffer.muted
  // this ends up being equivalent to
  // (riffer.id == id) == riffer.muted
  const encSearchAndToggle =
    id =>
    (
      {solo: state.riffsByRiffer.filter(riffer => (riffer.user_id == id) == riffer.muted).map(riffer => riffer.user_id).join(",")}
    );

  const toggleMute = (id) => setSearch(encSearchAndToggle(id));

  useEffect( () =>
  {
    // create list of riffers to play from the 'search' part of the URL.
    // is this readable or no?
    // search.get() may be a string, or undefined.
    // .split() will work even with no comma.
    // if undefined, it will eval to the empty array.
    // .map(Number) is like .map(el => Number(el))
    const rifferList = search.get("solo")?.split(',').map(Number) ?? [];

    // riffsByRiffer = [ {
    //  user_id: number,
    //  name: string,
    //  muted: bool,
    //  open: bool,
    //  tracks: [[{ muted: bool, ...}]] },
    //   ... ]
    const riffsByRiffer = [];
    const myTracks = props.userInfo ? [[]] : null;
    
    const pushToTrack = (riff, tracks) =>
    {
      for (let track of tracks)
      {
        const last = track.at(-1);
        if (last != null && last.start + last.duration < riff.start)
        {
          track.push(riff);
          return;
        }
      }

      // open track not found
      tracks.push([riff]);
    };

    props.riffs.toSorted(
      (e1, e2) => e1.start - e2.start
    ).forEach( riff =>
    {
      // if the user is logged in, and this riff is the users, add to myTracks
      // otherwise, add to riffsByRiffer
      if (props.userInfo && props.userInfo.id == riff.user_id)
      {
        // add a muted field, starts false
        //myRiffs.push({...riff, muted: false});
        pushToTrack({...riff, muted: false}, myTracks);
      }
      else
      {
        const fer = riffsByRiffer.find(rfr => rfr.user_id == riff.user_id);

        if (fer)
        {
          //fer.riffs.push({...riff, muted: false});
          pushToTrack({...riff, muted: false}, fer.tracks);
        }
        else
        {
          console.log("new riffer with riff", riff);
          
          riffsByRiffer.push({
            user_id: riff.user_id,
            name: riff.name,
            muted: !rifferList.includes(riff.user_id),
            open: state.riffsByRiffer.find(rfr => rfr.user_id == riff.user_id)?.open,
            tracks: [[{...riff, muted: false}]]
          });
        }
      }
    } );

    console.log("metabar riffer setup", riffsByRiffer, myTracks);

    // default: { riffByRiffer: [], myTracks: null, filteredRiffs: [] }
    setState({
      riffsByRiffer,
      myTracks,
      filteredRiffs: props.riffs.filter(riff => rifferList.includes(riff.user_id) && !riff.muted),
    });
  }, [search.get("solo"), props.riffs, props.timestamp]);
  // TODO: remove timestamp stuff, I think

  return (
    <React.Fragment>
      <YouTubeVideo
        id={props.id}
        zoomState={zoomState}
        setZoomState={setZoomState}
        riffs={state.filteredRiffs} />
      <div className="metabar-cont">
        <div className="metabar-riffers">
        {
          state.riffsByRiffer?.map(riffer => (
            <div
              style={{"--trackN": riffer.tracks.length}}
              className={`metabar-riffer-cont ${riffer.open ? 'metabar-open' : ''}`}
              key={riffer.user_id}>
              <label className="metabar-riffer-name-cont">
                <div
                  style={{"--riffer-pic-src": `url(/riffer-pic/${riffer.user_id}.png)`}}>
                  <input
                    type="checkbox"
                    defaultChecked={!riffer.muted}
                    onChange={() => toggleMute(riffer.user_id)} />
                  <div className="metabar-riffer-name-id-flex">
                    <span className="metabar-riffer-name">
                      {riffer.name}
                    </span>
                    <span className="metabar-riffer-id">
                      ({riffer.user_id})
                    </span>
                  </div>
                </div>
              </label>
            </div>
          ))
        }
        </div>
        <div>
        {
          state.riffsByRiffer?.map(riffer => (
          <div
            style={{"--trackN": riffer.tracks.length}}
            key={riffer.user_id}
            className={`disc-cont ${riffer.open ? 'metabar-open' : ''}`}>
            {
              riffer.tracks.length > 1
              ?
                (
                  <label className="disc">
                    <input type="checkbox" className="disc-cb"
                      onChange={() => {const riffsByRiffer = [...state.riffsByRiffer]; const r = riffsByRiffer.find(rfr => rfr.user_id == riffer.user_id); r.open = !r.open; setState({...state, riffsByRiffer});}}
                      value={riffer.open} />
                  </label>
                )
              :
                null
            }
            
          </div>
          ))
        }
        </div>
        <div
          className="metabar-tracks">
          <div
            ref={scrollDiv}
            style={{"--duration": props.duration}}
            className={`metabar-tracks-scroll ${zoomState ? 'metabar-zoomed' : ''}`}>
            <div
              id="meta-play-head"
              ref={props.metaBarPlayhead}
            />
            {
              state.riffsByRiffer?.map(riffer => (
                <div
                  style={{"--trackN": riffer.tracks.length}}
                  className={`metabar-riffer-tracks-cont ${riffer.open ? 'metabar-open' : ''}`}
                  key={riffer.user_id}>
                {
                  riffer.tracks.map((track, ind) => (
                    <div
                      style={{"--track-num": ind}}
                      className="metabar-riffer-track"
                      key={ind}>
                      {
                        track.map(riff => (
                          <div
                            key={riff.id}
                            style={{
                              "--start": riff.start / props.duration,
                              "--duration": riff.duration / props.duration,
                              "--bgcolor": riffer.muted ? "rgba(100, 100, 100, 0.3)" : "rgba(255, 100, 100, 0.3)"
                            }}
                            className="metabar-riffer-track-riff">
                              {riff.start} / {props.duration} = {riff.start / props.duration}
                          </div>
                        ))
                      }
                    </div>
                  ))
                }
              </div>
            ))
          }
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}


const mapStateToProps = (state) => ({
  metaBarPlayhead: state.metaBarPlayhead,
  metaBarCallback: state.metaBarCallback,
  timestamp: state.riffs.timestamp, // TODO: check: unneeded?
});

const mapDispatchToProps = {
  setMetaBarPlayhead,
  setMetaBarCallback,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMetabar);

/*
state.names.map((el) => (
        <div
          key={el.id}
          onClick={() => toggleMute(el.id)}
          style={{
            backgroundColor: state.muted[el.id] ? 'gray' : 'blue',
          }}
        >
          {el.name}
        </div>
      ))
        */