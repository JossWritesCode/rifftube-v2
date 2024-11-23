import React from 'react';
import { connect } from 'react-redux';
import YouTubeVideo from '../YouTubeVideo/YouTubeVideo';
import { setMetaBarPlayhead, setMetaBarCallback } from '../../actions';

class ViewFilter extends React.Component {
  constructor(props) {
    super(props);
    // window.metaPlayhead gets updated by the youtube component (???)
    props.setMetaBarPlayhead(React.createRef());
    this.selectDiv = React.createRef();
    let mbc = () =>
    {
      console.log("mbc", this, this.selectDiv);
      if (this.selectDiv.current && this.props.metaBarPlayhead.current)
        // seems like it shouldn't be needed, but here we are
        this.selectDiv.current.scrollLeft =
          this.props.metaBarPlayhead.current.offsetLeft - this.selectDiv.current.offsetWidth / 2;
    };
    props.setMetaBarCallback(mbc);

    this.state = {
      filteredRiffs: [],
      overlappingRiffs: [],
      nonOverlappingRiffs: null,
      selectedRiffs: null,
      tracks: [],
    };
    // filtered riffs is the final result
    // overlapping riffs is a list of sets [of ids] of overlapping riffs
    // selected riffs is a set
    // tracks are used for the UI
  }

  renderTracks = () =>
  {
      //debugger;

      // if riffs have changed, we need to recalculate

      // multiple tracks are used to display overlapping riffs at the same time
      const tracks = [[]];
      const trackPos = [0]; // time code where last riff on track ends

      const nonOverlappingRiffs = new Set();

      // used to keep track of conflicting riffs
      const runningRiffs = [];

      // these will overwrite the current values after being built
      const overlappingRiffs = [];
      const selectedRiffs = new Set();

      // slope basically means "was the last action to add or remove from the running list"
      var slope = 0;

      // sort riffs by starting time
      this.props.riffs.sort((e1, e2) => e1.start - e2.start);

      // loop through sorted riffs
      for (const riff of this.props.riffs) {
        // check to see if any riffs end before this riff starts
        if (runningRiffs.length > 0) {
          // this could be optimized by first sorting running set
          const toDelete = [];
          for (const toCheck of runningRiffs) {
            // (see above)
            if (toCheck.start + toCheck.duration <= riff.start) {
              // only add set if the prev action was an add,
              // and there is more than 1 riff in the set
              if (slope > 0 && runningRiffs.length > 1) {
                overlappingRiffs.push(new Set(runningRiffs));

                // when adding overlapping set, find if any are in track 0
                // if so, they go into selectedRiffs
                for (const candi of runningRiffs) {
                  if (tracks[0].includes(candi)) {
                    selectedRiffs.add(candi);
                    break;
                  }
                }
              } else if (slope > 0) {
                // 'if' part may be unnecessary
                nonOverlappingRiffs.add(toCheck);
              }

              // don't delete in place while looping
              toDelete.push(toCheck);
              slope = -1; // last action was to remove
            }
          }
          for (const el of toDelete)
            runningRiffs.splice(runningRiffs.indexOf(el), 1);
        }

        // add this riff to running list
        runningRiffs.push(riff);

        // keep running list sorted by first ending
        runningRiffs.sort(
          (e1, e2) => e1.start + e1.duration - (e2.start + e2.duration)
        );

        // last action was to add
        slope = 1;

        // assign riff to a track
        var flag = true;
        for (var i = 0; i < tracks.length; i++) {
          // check whether this track is available
          if (trackPos[i] <= riff.start) {
            tracks[i].push(riff);
            trackPos[i] = riff.start + riff.duration;
            flag = false;
            break;
          }
        }

        // if no track was found, add one
        if (flag) {
          tracks.push([riff]);
          trackPos.push(riff.start + riff.duration);
        }
      }

      // cleanup after loop
      // check to see if running set has more than 1 riff
      // if so, add it etc.
      if (runningRiffs.length > 1) {
        overlappingRiffs.push(new Set(runningRiffs));

        for (const candi of runningRiffs) {
          if (tracks[0].includes(candi)) {
            selectedRiffs.add(candi);
            break;
          }
        }
      } else nonOverlappingRiffs.add(runningRiffs[0]);

      const filteredRiffs = [...tracks[0]];

      debugger;

      this.setState({
        filteredRiffs,
        overlappingRiffs,
        nonOverlappingRiffs,
        selectedRiffs,
        tracks,
      });
  }

  selectRiff = (newRiff) => {
    // use id to find riff in "master" list
    //const riff = this.props.riffs.find( r => r.id == selected_id );

    // nothing to do if the selected riff has nothing overlapping it, or it's already selected
    if (this.state.nonOverlappingRiffs.has(newRiff) || this.state.selectedRiffs.has(newRiff))
      return;

    function overlappingRiffCheck(el1, el2)
    {
      return !(el2.start + el2.duration < el1.start
        || el2.start > el1.start + el1.duration);
    }

    function riffOverlap(el, s)
    {
      for (const riff of s)
      {
        //const riff = arr[i];
  
        if (overlappingRiffCheck(riff, el))
          return riff;
      }
      return null;
    }
    
    const selectedRiffs = new Set(this.state.selectedRiffs);

    selectedRiffs.add(newRiff);

    const newFiltered = new Set(this.state.filteredRiffs);

    let overlapping = new Set();

    // remove from the [new]Filtered array and selectedRiffs sets any riff overlapping the selected one

    let riff = riffOverlap(newRiff, newFiltered);
    while (riff !== null)
    {
      overlapping.add(riff);
      newFiltered.delete(riff);
      selectedRiffs.delete(riff);

      riff = riffOverlap(newRiff, newFiltered);
    }

    newFiltered.add(newRiff);

    // look through overlapping set for any riff that can fill a gap created by the above

    for (riff in this.state.overlappingRiffs)
    {
      // nothing to do if already selected
      if (selectedRiffs.has(riff)) continue;

      let ro = riffOverlap(riff, newFiltered);

      if (ro === null)
      {
        selectedRiffs.add(riff)
        newFiltered.add(riff)
      }
    }

    // generate final filtered list
    const filteredRiffs = [...newFiltered];

    this.setState({ filteredRiffs, selectedRiffs });
  };

  componentDidMount()
  {
    this.renderTracks();
  }

  componentDidUpdate(prevProps)
  {
    if (prevProps.riffs !== this.props.riffs)
    {
      this.renderTracks();
    }
  }

  render() {
    return (
      <React.Fragment>
        <YouTubeVideo id={this.props.id} riffs={this.state.filteredRiffs} />
        <div
          ref={this.selectDiv}
          style={{ fontSize: '2em', overflow: 'hidden', width: '100%' }}
        >
          <div
            style={{
              height: `${this.state.tracks.length * 0.75}em`,
              width: `${this.props.duration}em`,
              position: 'relative',
            }}
          >
            <div
              id="meta-play-head"
              style={{ backgroundColor: 'red', height: 'inherit' }}
              ref={this.props.metaBarPlayhead}
            />
            {this.state.tracks.map((trackArray, ind) => (
              <div
                style={{ width: `${this.props.duration}em`, height: '0.75em' }}
                key={ind}
              >
                {trackArray.map((riff) => (
                  <div
                    style={{
                      position: 'absolute',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.25em',
                      lineHeight: '3em',
                      verticalAlign: 'middle',
                      left: `${riff.start * 4}em`,
                      height: '3em',
                      width: `${riff.duration * 4}em`,
                      backgroundColor: this.state.filteredRiffs.includes(riff)
                        ? 'red'
                        : 'lightgrey',
                    }}
                    onClick={() => this.selectRiff(riff)}
                  >
                    {riff.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  metaBarPlayhead: state.metaBarPlayhead,
  metaBarCallback: state.metaBarCallback,
});

const mapDispatchToProps = {
  setMetaBarPlayhead,
  setMetaBarCallback,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewFilter);