import TrackSelector from '../components/TrackSelector'
import CareerProjector from '../components/CareerProjector'
import NightingaleChart from '../components/NightingaleChart'
import KeyboardListener from '../components/KeyboardListener'
import Track from '../components/Track'
import { eligibleTitles, trackIds, milestones } from '../constants'
import type { Milestone, MilestoneMap, TrackId, SnowflakeAppState } from '../constants'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from "./Header";
import { hashToState, stateToHash } from "../src/hash";
import { emptyState, defaultState } from "../src/state";

function SnowflakeApp() {
  const [appState, setAppState] = useState<SnowflakeAppState>(emptyState)
  const exportLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const state = hashToState(window.location.hash)
    if (state) {
      setAppState(state)
    } else {
      setAppState(defaultState())
    }
  }, [])

  useEffect(() => {
    const hash = stateToHash(appState)
    if (hash) window.location.replace(`#${hash}`)
  }, [appState])

  const handleTrackMilestoneChange = useCallback((trackId: TrackId, milestone: Milestone) => {
    setAppState(prev => {
      const milestoneByTrack = { ...prev.milestoneByTrack, [trackId]: milestone }
      const titles = eligibleTitles(milestoneByTrack)
      const title = titles.indexOf(prev.title) === -1 ? titles[0] : prev.title
      return { ...prev, milestoneByTrack, focusedTrackId: trackId, title }
    })
  }, [])

  const shiftFocusedTrack = useCallback((delta: number) => {
    setAppState(prev => {
      let index = trackIds.indexOf(prev.focusedTrackId)
      index = (index + delta + trackIds.length) % trackIds.length
      return { ...prev, focusedTrackId: trackIds[index] }
    })
  }, [])

  const selectNextTrack = useCallback(() => shiftFocusedTrack(1), [shiftFocusedTrack])
  const selectPrevTrack = useCallback(() => shiftFocusedTrack(-1), [shiftFocusedTrack])

  const setFocusedTrackId = useCallback((trackId: TrackId) => {
    setAppState(prev => ({ ...prev, focusedTrackId: trackId }))
  }, [])

  const shiftFocusedTrackMilestoneByDelta = useCallback((delta: number) => {
    setAppState(prev => {
      let milestone = (prev.milestoneByTrack[prev.focusedTrackId] + delta) as Milestone
      if (milestone < 0) milestone = 0 as Milestone
      if (milestone > 5) milestone = 5 as Milestone
      const milestoneByTrack = { ...prev.milestoneByTrack, [prev.focusedTrackId]: milestone }
      const titles = eligibleTitles(milestoneByTrack)
      const title = titles.indexOf(prev.title) === -1 ? titles[0] : prev.title
      return { ...prev, milestoneByTrack, title }
    })
  }, [])

  const increaseFocusedMilestone = useCallback(() => shiftFocusedTrackMilestoneByDelta(1), [shiftFocusedTrackMilestoneByDelta])
  const decreaseFocusedMilestone = useCallback(() => shiftFocusedTrackMilestoneByDelta(-1), [shiftFocusedTrackMilestoneByDelta])

  const setTitle = useCallback((title: string) => {
    setAppState(prev => {
      const titles = eligibleTitles(prev.milestoneByTrack)
      const resolvedTitle = titles.indexOf(title) === -1 ? titles[0] : title
      return { ...prev, title: resolvedTitle }
    })
  }, [])

  const handleClickNew = () => {
    window.location.href = '';
  }

  const handleClickExport = () => {
    const { milestoneByTrack, name } = appState

    const headers = ['skillset projection', ...trackIds]
    const values = [
      eligibleTitles(milestoneByTrack).join(' '),
      ...trackIds.map(id => milestoneByTrack[id])
    ]
    const csv = [headers, values].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = exportLinkRef.current
    link.href = url
    link.download = `${name}PerformanceReview.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

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
    name={appState.name}
    setNameFn={(name) => setAppState(prev => ({ ...prev, name }))}
    />
    
    <TrackSelector
    milestoneByTrack={appState.milestoneByTrack}
    focusedTrackId={appState.focusedTrackId}
    setFocusedTrackIdFn={setFocusedTrackId} />
    
    <div style={{display: 'flex'}}>
    <div style={{flex: 3}}>
    
    <KeyboardListener
    selectNextTrackFn={selectNextTrack}
    selectPrevTrackFn={selectPrevTrack}
    increaseFocusedMilestoneFn={increaseFocusedMilestone}
    decreaseFocusedMilestoneFn={decreaseFocusedMilestone} />
    <Track
    milestoneByTrack={appState.milestoneByTrack}
    trackId={appState.focusedTrackId}
    handleTrackMilestoneChangeFn={handleTrackMilestoneChange} />
    </div>
    <div style={{flex: 2}}>
    
    <NightingaleChart
    milestoneByTrack={appState.milestoneByTrack}
    focusedTrackId={appState.focusedTrackId}
    handleTrackMilestoneChangeFn={handleTrackMilestoneChange} />
    <div>
     <button className="btn btn-default" onClick={handleClickExport}>Export to CSV</button>
     <button className="btn btn-default" onClick={handleClickNew}>reset snowflake</button>
     <a ref={exportLinkRef} style={{display: 'none'}} aria-hidden="true" />
    </div>
    </div>
    <div>
    <CareerProjector
    milestoneByTrack={appState.milestoneByTrack}
    currentTitle={appState.title}
    setTitleFn={setTitle} />
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
  
  export default SnowflakeApp
  