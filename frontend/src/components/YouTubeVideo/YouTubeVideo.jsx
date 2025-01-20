import React, { createRef } from 'react';
import { connect } from 'react-redux';
import {
  setPlayerMode,
  setRiffPlaying,
  loadRiff,
  togglePlayerMode,
  setVideoDuration,
  setRifftubePlayer,
  setFreeAudioPlayerInUse,
  EDIT_MODE,
  EDIT_NEW_MODE,
  PLAY_MODE,
  PAUSE_MODE,
} from '../../actions/index.js';
import VideoSidebar from './VideoSidebar.jsx';
import ShowRiffsMeta from './ShowRiffsMeta.jsx';

// based on https://stackoverflow.com/questions/54017100/how-to-integrate-youtube-iframe-api-in-reactjs-solution

/*
  props:
    zoomState, setZoomState
    more
    setRiffMute
*/

class YouTubeVideo extends React.Component
{
  constructor(props) {
    super(props);
    this.riffersRef = createRef();
    this.state = { riffCont: {} };
  }

  componentDidMount = () => {
    // On mount, check to see if the API script is already loaded

    if (!window.YT || !window.YT.Player) {
      // If not, load the script asynchronously
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      // onYouTubeIframeAPIReady will load the video after the script is loaded
      window.onYouTubeIframeAPIReady = this.loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } // If script is already there, load the video directly
    else {
      this.loadVideo();
      this.checkForRiffsToLoad(0); // check if any riffs at < 10s in need loading
    }
  };

  showRiffer(riff)
  {
    console.log("show", riff);
    let rifferCont = document.createElement("div");
    let riffPic = document.createElement("img");
    try
    {
      riffPic.src = `/riffer-pic/${riff.user_id}.png`;
    }
    catch (err)
    {
      console.log("showriff err", err);
    }
    rifferCont.append(riffPic);
    if (riff.showText)
    {
      const textDiv = document.createElement("div");
      textDiv.className = "rifftube-text-riff";
      textDiv.innerHTML = riff.text;
      rifferCont.append(textDiv);
    }
    this.riffersRef.current.append(rifferCont);
    this.setState({ riffCont: {...this.state.riffCont, [riff.id]: rifferCont} });
    //riff.riffPicCont = rifferCont;

  }
  
  hideRiffer(riff)
  {
    console.log("hide", riff);
    const cont = this.state.riffCont[riff.id];
    cont.classList.add("hiding");
    cont.addEventListener('animationend', () => {
      //console.log('Animation ended');
      cont.remove();
      // remove from state?
    });
  }

  loadVideo = () => {
    if (!window.YT || !window.YT.loaded || !window.YT.Player) return; // can be called by componentDidUpdate before window.YT has loaded

    const { id } = this.props;

    if (this.props.rifftubePlayer) this.props.rifftubePlayer.destroy();

    this.player = new window.YT.Player('rifftube-player', {
      videoId: id,
      height: "100%",
      width: "100%",
      playerVars: {
        playsinline: 1, // allows it to play inline on iOS
      },
      events: {
        onReady: this.onPlayerReady,
        onStateChange: this.onPlayerStateChange,
      },
    });

    this.props.setRifftubePlayer(this.player);
  };

  onPlayerReady = (event) => {
    //event.target.playVideo();

    this.props.setVideoDuration(event.target.getDuration());
  };

  // TODO: account for muted riffs!!!!
  checkForRiffsToLoad = (t) => {

    Object.values(this.props.riffs).forEach((riff) => {
      if (
        // if no id, it is being saved
        riff.id &&
        //if it's an audio riff
        !riff.isText &&
        //if it's not loaded already
        !this.props.riffsAudio.all[riff.id] && //!riff.payload &&
        //if it's not loading
        !this.props.riffsAudio.loading[riff.id] && //!riff.loading &&
        // if the riff is in the future
        riff.start >= t &&
        // ...but is less than 10 seconds in the future
        riff.start < t + 10
      )
        // load the riff to be played at the right time
        this.props.loadRiff(riff.id);
    });
  };

  onPlayerStateChange = ({ data }) => {
    /*
        -1 (unstarted)
        0 (ended)
        1 (playing)
        2 (paused)
        3 (buffering)
        5 (video cued).
        */

    // the following conditional leaves out some 'else's that should never occur

    if (data === 1) {
      // playing

      // the following code is
      // needed I think... for pausing during a riff.
      // so that (subsiquent) 'zombie' riffs can be killed,
      // I think.
      this.curRiff = this.props.riffsPlaying;

      /*******************************************************/
      // this timer is responsible for showing and hiding riffs
      this.riffInterval = setInterval(() =>
      {
        //console.log("interval", this.props.rifftubePlayer);
        if (
          !(
            this.props.rifftubePlayer &&
            typeof this.props.rifftubePlayer.getCurrentTime == 'function'
          )
        )
          return;

        let t = this.props.rifftubePlayer.getCurrentTime();

        // if the MetaBar component exists, update its playhead
        if (this.props.metaBarPlayhead && this.props.metaBarPlayhead.current)
        {
          this.props.metaBarPlayhead.current.style.left = `${(t / this.props.duration) * 100}%`;
          if (this.props.metaBarCallback)
            this.props.metaBarCallback();
        }

        //
        this.checkForRiffsToLoad(t);

        // first stop any zombie riffs
        Object.values(this.props.riffs).forEach((riff) =>
        {
          const index = riff.id; // lazy refactoring
          if (
            this.curRiff[index] &&
            (t < riff.start || t > riff.start + riff.duration)
          ) {
            if (this.curRiff[index].inUse) this.curRiff[index].inUse = false;

            console.log("killing riff", index, `${riff.start} > ${t} > ${riff.start + riff.duration}`);

            this.hideRiffer(riff);

            // by setting this to false, text riffs will be hidden
            this.props.setRiffPlaying(index, false);
            this.curRiff[index] = null;

            if (!riff.isText)
              // make sure all audio clips have stopped
              this.audLock--;
            if (!this.audLock) {
              this.props.rifftubePlayer.setVolume(this.vol ? this.vol : 100); // hopefully unnecessary volume failsafe
              delete this.vol;
            }
          }
        });

        // next start any that should be playing
        Object.values(this.props.riffs).forEach((riff) =>
        {
          const index = riff.id;
          // the riff will start playing within half a second, or will be skipped
          if (!this.curRiff[index] && t > riff.start && t < riff.start + 0.5)
          {
            console.log("starting riff", index, `${riff.start} < ${t} < ${riff.start + riff.duration}`);

            this.props.setRiffPlaying(index, true);
            this.curRiff[index] = true; // used for text only; overwritten for audio

            this.showRiffer(riff);

            // TODO: feed in user options as props
            if (riff.speak)
            {
              const voiceInfo = JSON.parse(riff.voice);
              
              const utterThis = new SpeechSynthesisUtterance(riff.text);
              utterThis.pitch = voiceInfo.pitch;
              utterThis.rate = voiceInfo.rate;

              let voices = speechSynthesis.getVoices();
              for (let voice of voices)
              {
                  if (voiceInfo?.lang == voice.lang && voiceInfo?.name == voice.name)
                    utterThis.voice = voice;
              }
              
              speechSynthesis.speak(utterThis);
            }

            if (!riff.isText) {
              if (!this.vol) {
                this.vol = this.props.rifftubePlayer.getVolume();
                this.props.rifftubePlayer.setVolume(this.vol * 0.25);
              }

              // keeps track of how many audio tracks need to end before volume should be restored
              if (!this.audLock) this.audLock = 1;
              else this.audLock++;

              if (!this.props.riffsAudio.all[riff.id]) {
                //(!riff.payload) {
                return;
              } // DEBUG - SHOULD BE REMOVED
              var audioURL = URL.createObjectURL(
                this.props.riffsAudio.all[riff.id]
              ); //(riff.payload);
              //debugger;

              // not sure why this was here
              //window.lastRiff = this.props.riffsAudio.all[riff.id]; // riff.payload;

              // FIX THIS:

              let audio = this.props.audioPlayers.free;
              this.props.setFreeAudioPlayerInUse();
              audio.src = audioURL;
              audio.load();
              audio.play();

              this.curRiff[index] = audio;

              /*for (let i = 0; i < window.audioPlayersCount; i++) {
                /*
                if ( window.audioContexts[i].inUse ) continue;
                let audioContext = window.audioContexts[i];
                window.audioContexts[i].inUse = true;
                var blob = riff.payload;
                new Response(blob).arrayBuffer().then(function(arrayBuffer) {
                  window.audioContexts[0].decodeAudioData(arrayBuffer, audioData => {
                    debugger;
                    var source = window.audioContexts[i].createBufferSource();
                    source.buffer = audioData;
                    source.connect(window.audioContexts[i].destination);
                    source.start()
                  })
                });
                ?/

                let audio = window.audioPlayers[i];
                if (audio.inUse) continue;
                audio.inUse = true;

                // TEST:
                //audio.srcEl.src = audioURL;
                audio.src = audioURL;
                audio.load();
                audio.play();

                /*
                var se = document.createElement('source');
                audio.appendChild(se);
                se.src = audioURL;
                //se.type = 'audio/webm';
                audio.load();
                audio.play();
                */

                // ORIG:
                /*
                audio.src = audioURL;
                audio.play();
                ?/

                this.curRiff[index] = audio; // audioContext;
                break;
              }
              */
            }
          }
        });
      }, 100); // 100/1000 = 1/10 s

      if (this.props.mode !== PLAY_MODE) {
        // change mode state
        this.props.setPlayerMode(PLAY_MODE);
      }
    } // not playing
    else {
      // stop riff-check interval when not playing
      clearInterval(this.riffInterval);

      if (this.props.mode === PLAY_MODE) {
        // change mode state
        this.props.setPlayerMode(PAUSE_MODE);
      }
    }
  };

  componentDidUpdate = (prevProps) => {
    // seems needed on more than just mounting
    // (makes sense; the riff meta takes some start to load)
    this.checkForRiffsToLoad(0); // check if any riffs at < 10s in need loading

    if (this.props.id !== prevProps.id) this.loadVideo();

    if (!(this.player && this.player.getPlayerState)) return;

    if (this.props.mode !== prevProps.mode) {
      if (
        (this.props.mode === EDIT_MODE ||
          this.props.mode === EDIT_NEW_MODE ||
          this.props.mode === PAUSE_MODE) &&
        this.player.getPlayerState() === 1
      ) {
        this.player.pauseVideo();
      } else if (
        this.props.mode === PLAY_MODE &&
        this.player.getPlayerState() !== 1
      ) {
        this.player.playVideo();
      }
    }
  };

  render = () => {
    return (
      <React.Fragment>
        <div className="rifftube-container">
          {/* <AllowPlayback />*/}
          <VideoSidebar
            zoomState={this.props.zoomState}
            setZoomState={this.props.setZoomState} />
          <div className="rifftube-overlay">
            <div className="rifftube-riffs-container">
              <div className="rifftube-riffers" ref={this.riffersRef} />
            </div>
          </div>
          <div id="rifftube-player" />
          <ShowRiffsMeta
            setRiffMute={this.props.setRiffMute}
            showRiff={this.props.showRiff}
            setShowRiff={this.props.setShowRiff}
            showRiffRef={this.props.showRiffRef} />
        </div>
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => ({
  mode: state.mode,
  // this is passed in?
  //riffs: state.riffs,
  riffsPlaying: state.riffsPlaying,
  duration: state.duration,
  riffsAudio: state.riffsAudio,
  metaBarCallback: state.metaBarCallback,
  metaBarPlayhead: state.metaBarPlayhead,
  audioPlayers: state.audioPlayers,
  rifftubePlayer: state.rifftubePlayer,
});

const mapDispatchToProps = {
  setPlayerMode,
  setRiffPlaying,
  togglePlayerMode,
  loadRiff,
  setVideoDuration,
  setRifftubePlayer,
  setFreeAudioPlayerInUse,
};

export default connect(mapStateToProps, mapDispatchToProps)(YouTubeVideo);
