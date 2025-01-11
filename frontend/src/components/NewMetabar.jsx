import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import YouTubeVideo from './YouTubeVideo/YouTubeVideo';

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
  const [state, setState] = useState({ riffsByRiffer: [], myRiffs: null, filteredRiffs: [] });
  const [search, setSearch] = useSearchParams();

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
    // create list of riffers to play from the 'search' part of the URL
    // is this readable or no?
    // search.get() may be a string, or undefined.
    // .split() will work even with no comma.
    // if undefined, it will eval to the empty array.
    // .map(Number) is like .map(el => Number(el))
    const rifferList = search.get("solo")?.split(',').map(Number) ?? [];

    // riffsByRiffer = [ { user_id: number, name: string, muted: bool, riffs: [{ muted: bool, ...}] }, ... ]
    const riffsByRiffer = [];
    const myRiffs = props.userInfo ? [] : null;
    
    props.riffs.forEach( riff =>
    {
      // if the user is logged in, and this riff is the users, add to myRiffs
      // otherwise, add to riffsByRiffer
      if (props.userInfo && props.userInfo.id == riff.user_id)
      {
        // add a muted field, starts false
        myRiffs.push({...riff, muted: false});
      }
      else
      {
        const fer = riffsByRiffer.find(rfr => rfr.user_id == riff.user_id);

        if (fer)
        {
          fer.riffs.push({...riff, muted: false});
        }
        else
        {
          console.log("new riffer with riff", riff);
          riffsByRiffer.push({
            user_id: riff.user_id,
            name: riff.name,
            muted: !rifferList.includes(riff.user_id),
            riffs: [{...riff, muted: false}]
          });
        }
      }
    } );

    console.log("metabar riffer setup", riffsByRiffer, myRiffs);

    // default: { riffByRiffer: [], myRiffs: null, filteredRiffs: [] }
    setState({
      riffsByRiffer,
      myRiffs,
      filteredRiffs: props.riffs.filter(riff => rifferList.includes(riff.user_id) && !riff.muted),
    });
  }, [search.get("solo"), props.riffs, props.timestamp]);


  return (
    <React.Fragment>
      <YouTubeVideo id={props.id} riffs={state.filteredRiffs} />
      {
        state.riffsByRiffer?.map(riffer => (
          <label
            className="metabar-riffer-name-cont"
          >
            <div
              key={riffer.user_id}
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
        ))
      }
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  timestamp: state.riffs.timestamp,
});

export default connect(mapStateToProps, null)(NewMetabar);

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