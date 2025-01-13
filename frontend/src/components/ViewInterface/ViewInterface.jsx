import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthorSelector from './AuthorSelector.jsx';
import NewMetabar from '../NewMetabar.jsx';
import { setVideoID, getAllRiffs, setAudioPlayers, setAudioPlayerNotInUse } from '../../actions/index.js';
import NavBar from '../NavBar.jsx';


const ViewInterface = (props) =>
{
  const introDialogRef = React.createRef();

  const params = useParams();


  const setupAudioPlayers = () =>
  {
    console.log("setup audio players");
    let audioPlayers = [];
    let audioPlayersCount = 5;
    for (let i = 0; i < audioPlayersCount; i++) {

      audioPlayers[i] = new Audio(); // should be identical behavior to: document.createElement('audio');
      audioPlayers[i].controls = false;
      audioPlayers[i].addEventListener('ended', () =>
      {
        console.log('audio playback end', i);
        props.setAudioPlayerNotInUse(i);
      });
    }

    props.setAudioPlayers(audioPlayers);
  };

useEffect(
  () => {
    props.setVideoID(params.videoID);
    props.getAllRiffs(params.videoID);
  
    introDialogRef.current?.showModal();
  }, []);


    return (
      <React.Fragment>
        <NavBar color="grey" />

        <dialog
          id="introDialog"
          ref={introDialogRef}
          style={{ inset: "20%", zIndex: 1, }}>
          <div style={{fontSize: "180%",}}>
            <h1>Riffers:</h1>
            {
              props.riffs && Object.values(props.riffs).length > 0 ?
                <p dangerouslySetInnerHTML={{__html:
                    Object.values(props.riffs)
                    .map(({name, user_id: id}) => ({name, id})) // fun with destructuring and implicit return
                    .reduce((acc, cur) => {if (!acc.find(({id}) => id == cur.id)) acc.push(cur); return acc;}, [])
                    .reduce((acc, {name}) => `${acc}${name}<br>`, "")
                }}/>
              :
                <em>Loading...</em>
            }
            
            <form method="dialog">
              <button
                onClick={ () => setupAudioPlayers() }>
                  OK
              </button>
            </form>
          </div>
        </dialog>

        <div style={{ marginTop: '4em', width: '100%' }}>
          <h1>View {params.videoID}</h1>
          <NewMetabar
            duration={props.duration}
            id={params.videoID}
            riffs={Object.values(props.riffs ?? {})}
          />
        </div>
      </React.Fragment>
    );
}

const mapStateToProps = (state) => ({
  riffs: state.riffsMetaObj,
  duration: state.duration,
});

const mapDispatchToProps = {
  setVideoID,
  getAllRiffs,
  setAudioPlayers,
  setAudioPlayerNotInUse,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewInterface);
