import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import ViewFilter from './ViewFilter';

const AuthorSelector = (props) =>
{
  console.log(props);
  //debugger;

  const [state, setState] = useState({ names: [], muted: {}, filteredRiffs: [], all: true });
  const [search, setSearch] = useSearchParams();

  const encSearchAndToggle = id => ({solo: state.names.map((el) => el.id).filter((el) => el == id ? !!state.muted[el] : !state.muted[el]).join(',')});
  const encSearch = () => ({solo: state.names.map((el) => el.id).filter((el) => !state.muted[el]).join(',')});



  const toggleMute = (id) => {

    setSearch(encSearchAndToggle(id));
  };

  
  useEffect( () => {
    console.log("au ue");

    const rifferList = search.get("solo")
      ? search.get("solo").indexOf(',') >= 0
        ? search.get("solo").split(',')
        : [search.get("solo")]
      : [];

      const m = {};
      state.names.forEach((el) => {
        m[el.id] = !(
          rifferList.includes(String(el.id)) || search.get("solo") === null
        );
      });

      const includes = (arr, id) => arr.some((el) => el.id === id);

      const names = [];

      Object.values(props.riffs).forEach((riff) => {
        if (!includes(names, riff.user_id)) {
          names.push({ name: riff.name, id: riff.user_id });

          if (search.get("solo") !== null) {
            m[riff.user_id] = !rifferList.some(
              (riffer) => riff.user_id === Number(riffer)
            );
          }
        }
      });

      setState({
        names,
        muted: m,
        all: search.get("solo") === null,
        filteredRiffs: Object.values(props.riffs).filter((el) => !m[el.user_id]),
      });
  }, [search.get("solo"), props.riffs, props.timestamp]);


  return (
    <React.Fragment>
      <ViewFilter
        id={props.videoID}
        duration={props.duration}
        riffs={state.filteredRiffs}
      />
      <div
        onClick={() => {
          if (!state.all)
            setSearch({});
          else
            setSearch(encSearch());
        }}
        style={{
          backgroundColor: state.all ? 'blue' : 'gray',
        }}
      >
        All
      </div>
      {state.names.map((el) => (
        <div
          key={el.id}
          onClick={() => toggleMute(el.id)}
          style={{
            backgroundColor: state.muted[el.id] ? 'gray' : 'blue',
          }}
        >
          {el.name}
        </div>
      ))}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  timestamp: state.riffs.timestamp,
});

export default connect(mapStateToProps, null)(AuthorSelector);
