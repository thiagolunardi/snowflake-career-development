// @flow

import TrackSelector from '../components/TrackSelector'
import MTrackSelector from '../components/MTrackSelector'
import CareerProjector from '../components/CareerProjector'
import NightingaleChart from '../components/NightingaleChart'
import KeyboardListener from '../components/KeyboardListener'
import Track from '../components/Track'
import { eligibleTitles, trackIds, milestones, milestoneToPoints } from '../constants'
import type { Milestone, MilestoneMap, TrackId } from '../constants'
import React from 'react'
import Header from "./Header";
import { hashToState, stateToHash } from "../src/hash";
import { emptyState, defaultState } from "../src/state";

type SnowflakeAppState = {
  milestoneByTrack: MilestoneMap,
  name: string,
  title: string,
  focusedTrackId: TrackId,
}

type Props = {}

class SnowflakeApp extends React.Component<Props, SnowflakeAppState> {
  constructor(props: Props) {
    super(props)
    this.state = emptyState()
  }
  
  componentDidUpdate() {
    const hash = stateToHash(this.state)
    if (hash) window.location.replace(`#${hash}`)
  }
  
  componentDidMount() {
    const state = hashToState(window.location.hash)
    if (state) {
      this.setState(state)
    } else {
      this.setState(defaultState())
    }
  }
  
  handleClickNew() {
    window.location.href = '';
    document.querySelector('.name-input').value = '';
  }
  
  handleClicExport() {
    
    const headers = ["skillset projection"];
    const rows = [eligibleTitles(this.state.milestoneByTrack).toString().split(',').join(' ')];

    var headersAndValues = JSON.stringify(this.state.milestoneByTrack).replace(/\"/g,'').replace('}','').replace('{','').split(",");
    
    headersAndValues.forEach(element => {
      const csvData = element.split(":");
      headers.push(csvData[0]);
      rows.push(csvData[1]);
    });
    
 
    const csvCon = [
      headers,
      rows
    ];
    
    let csvContent = "data:text/csv;charset=utf-8," 
    + csvCon.map(e => e.join(",")).join("\n");
      
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    
    
    link.setAttribute("download", this.state.name+"PerformanceReview.csv");
    
    //link.setAttribute("download", "my_data.csv");
    
    
    document.body.appendChild(link); // Required for FF
    
    link.click(); // This will download the data file named "my_data.csv".
    
    
  }
  
  
  render() {
    return (
      <main>
      <style jsx global>{`
      .aui .light-fill { fill: #FFF; }
      .aui .logo-border { fill: transparent; stroke: #939598; }
      .aui .logo-gradient-dark { fill: #1D396B; }
      .aui .logo-gradient-darkest { fill: #051E3C; }
      .aui .logo-gradient-light { fill: #79B3E1; }
      body {
        font-family: Helvetica;
      }
      main {
        width: 90%;
        margin: 0 auto;
        background-color: #f2d5dc;
      }
      .name-input {
        border: none;
        display: block;
        border-bottom: 2px solid #fff;
        font-size: 25px;
        line-height: 40px;
        font-weight: bold;
        width: 380px;
        margin-bottom: 10px;
      }
      .name-input:hover, .name-input:focus {
        border-bottom: 2px solid #ccc;
        outline: 0;
      }
      a {
        color: #888;
        text-decoration: none;
      }
      .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
      }
      
      `}</style>
      
      <Header
      name={this.state.name}
      setNameFn={(name) => this.setState({name})}
      />
      
      <TrackSelector
      milestoneByTrack={this.state.milestoneByTrack}
      focusedTrackId={this.state.focusedTrackId}
      setFocusedTrackIdFn={this.setFocusedTrackId.bind(this)} />
      
      <div style={{display: 'flex'}}>
      <div style={{flex: 3}}>
      
      <KeyboardListener
      selectNextTrackFn={this.shiftFocusedTrack.bind(this, 1)}
      selectPrevTrackFn={this.shiftFocusedTrack.bind(this, -1)}
      increaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, 1)}
      decreaseFocusedMilestoneFn={this.shiftFocusedTrackMilestoneByDelta.bind(this, -1)} />
      <Track
      milestoneByTrack={this.state.milestoneByTrack}
      trackId={this.state.focusedTrackId}
      handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)} />
      </div>
      <div style={{flex: 2}}>
      
      <NightingaleChart
      milestoneByTrack={this.state.milestoneByTrack}
      focusedTrackId={this.state.focusedTrackId}
      handleTrackMilestoneChangeFn={(track, milestone) => this.handleTrackMilestoneChange(track, milestone)} />
      <div>
       <button className="btn btn-default" onClick={this.handleClicExport.bind(this)}>Export to CSV</button>
       <button className="btn btn-default" onClick={this.handleClickNew.bind(this)}>reset snowflake</button>
      </div>
      </div>
      <div>
      <CareerProjector
      milestoneByTrack={this.state.milestoneByTrack}
      currentTitle={this.state.title}
      setTitleFn={(title) => this.setTitle(title)} />
      </div>
      
      </div>
      <div className="footer" style={{display: 'flex', paddingBottom: '3px'}}>
      <div style={{flex: 1}}>
      Made with ❤️ by <a href="https://medium.engineering" target="_blank">Medium Eng</a>.
      Changes and adaptation by <a href="https://paymenttools.com" target="_blank">Paymenttools</a>. 
      </div>
      </div>
      <br></br>
      <br></br>
      </main>
      )
    }
    
    handleTrackMilestoneChange(trackId: TrackId, milestone: Milestone) {
      const milestoneByTrack = this.state.milestoneByTrack
      milestoneByTrack[trackId] = milestone
      
      const titles = eligibleTitles(milestoneByTrack)
      const title = titles.indexOf(this.state.title) === -1 ? titles[0] : this.state.title
      
      this.setState({ milestoneByTrack, focusedTrackId: trackId, title })
    }
    
    shiftFocusedTrack(delta: number) {
      let index = trackIds.indexOf(this.state.focusedTrackId)
      index = (index + delta + trackIds.length) % trackIds.length
      const focusedTrackId = trackIds[index]
      this.setState({ focusedTrackId })
    }
    
    setFocusedTrackId(trackId: TrackId) {
      let index = trackIds.indexOf(trackId)
      const focusedTrackId = trackIds[index]
      this.setState({ focusedTrackId })
    }
    
    shiftFocusedTrackMilestoneByDelta(delta: number) {
      let prevMilestone = this.state.milestoneByTrack[this.state.focusedTrackId]
      let milestone = prevMilestone + delta
      if (milestone < 0) milestone = 0
      if (milestone > 5) milestone = 5
      this.handleTrackMilestoneChange(this.state.focusedTrackId, milestone)
    }
    
    setTitle(title: string) {
      let titles = eligibleTitles(this.state.milestoneByTrack)
      title = titles.indexOf(title) == -1 ? titles[0] : title
      this.setState({ title })
    }
  }
  
  export default SnowflakeApp
  