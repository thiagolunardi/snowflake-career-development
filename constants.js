// @flow
import * as d3 from 'd3'
import TECHNOLOGY from './trackData/technology.json'
import SYSTEM from './trackData/system.json'
import PEOPLE from './trackData/people.json'
import PROCESS from './trackData/process.json'
import INFLUENCE from './trackData/influence.json'

export type TrackId = 'TECHNOLOGY' | 'SYSTEM' | 'PEOPLE' | 'PROCESS' | 'INFLUENCE'
export type Milestone = 0 | 1 | 2 | 3 | 4 | 5 

export type MilestoneMap = {
  'TECHNOLOGY': Milestone,
  'SYSTEM': Milestone,
  'PEOPLE': Milestone,
  'PROCESS': Milestone,
  'INFLUENCE': Milestone,
}
export const milestones = [0, 1, 2, 3, 4, 5]

// Title thresholds per track (minimum points on each pillar)
// Pillars: Technology, System, People, Process, Influence
// Points per milestone: 10, 20, 30, 40, 50; 0 means no milestone.
export const titles = [
  { label: 'L1 Engineer', thresholds: { TECHNOLOGY: 10, SYSTEM: 10, PEOPLE: 10, PROCESS: 10, INFLUENCE: 10 } },
  { label: 'L2 Engineer', thresholds: { TECHNOLOGY: 20, SYSTEM: 20, PEOPLE: 10, PROCESS: 20, INFLUENCE: 10 } },
  { label: 'L3 Engineer', thresholds: { TECHNOLOGY: 20, SYSTEM: 30, PEOPLE: 20, PROCESS: 20, INFLUENCE: 20 } },
  { label: 'L4 Senior Engineer', thresholds: { TECHNOLOGY: 30, SYSTEM: 30, PEOPLE: 30, PROCESS: 30, INFLUENCE: 20 } },
  { label: 'L5 Senior Engineer', thresholds: { TECHNOLOGY: 40, SYSTEM: 40, PEOPLE: 30, PROCESS: 40, INFLUENCE: 30 } },
  { label: 'L6 Staff Engineer', thresholds: { TECHNOLOGY: 50, SYSTEM: 40, PEOPLE: 40, PROCESS: 40, INFLUENCE: 40 } },
  { label: 'L7 Principal Engineer', thresholds: { TECHNOLOGY: 50, SYSTEM: 50, PEOPLE: 40, PROCESS: 40, INFLUENCE: 50 } },
  { label: 'L6 Architect', thresholds: { TECHNOLOGY: 30, SYSTEM: 50, PEOPLE: 40, PROCESS: 40, INFLUENCE: 40 } },
  { label: 'L7 Principal Architect', thresholds: { TECHNOLOGY: 30, SYSTEM: 50, PEOPLE: 40, PROCESS: 40, INFLUENCE: 50 } },
  { label: 'L5 Engineering Team Lead', thresholds: { TECHNOLOGY: 30, SYSTEM: 40, PEOPLE: 40, PROCESS: 30, INFLUENCE: 30 } },
  { label: 'L6 Engineering Manager', thresholds: { TECHNOLOGY: 30, SYSTEM: 40, PEOPLE: 50, PROCESS: 40, INFLUENCE: 40 } },
  { label: 'L7 Head of Engineering', thresholds: { TECHNOLOGY: 30, SYSTEM: 40, PEOPLE: 50, PROCESS: 50, INFLUENCE: 50 } }
]

export const maxLevel = 350

export type Track = {
  displayName: string,
  category: string, // TK categoryId type?
  description: string,
  milestones: {
    summary: string,
    signals: string[],
    examples: string[]
  }[]
}
  
  export const tracks: Tracks = {
    TECHNOLOGY, SYSTEM, PEOPLE, PROCESS, INFLUENCE
  };
  
  export const trackIds: TrackId[] = Object.keys(tracks)
  export const ICtrackIds: ICTrackId[] = Object.keys(tracks)
  
  export const categoryIds: Set<string> = trackIds.reduce((set, trackId) => {
    set.add(tracks[trackId].category)
    return set
  }, new Set())
  
  export const categoryPointsFromMilestoneMap = (milestoneMap: MilestoneMap) => {
    let pointsByCategory = new Map()
    trackIds.forEach((trackId) => {
      const milestone = milestoneMap[trackId]
      const categoryId = tracks[trackId].category
      let currentPoints = pointsByCategory.get(categoryId) || 0
      if (milestone === 0){
        pointsByCategory.set(categoryId, currentPoints + 0)
      }
      else {
        pointsByCategory.set(categoryId, currentPoints + tracks[trackId].milestones[milestone - 1].points)
      }
    })
    return Array.from(categoryIds.values()).map(categoryId => {
      const points = pointsByCategory.get(categoryId)
      return { categoryId, points: pointsByCategory.get(categoryId) || 0 }
    })
  }
  
  export const totalPointsFromMilestoneMap = (milestoneMap: MilestoneMap): number => {
    var sum = {IC: 0, M: 0, Total: 0};
    trackIds.map(trackId => {
      const milestone = milestoneMap[trackId]
      if (milestone > 0) {
        sum.Total = sum.Total + tracks[trackId].milestones[milestone-1].points
        if (tracks[trackId].category === "IC") {
          sum.IC = sum.IC + tracks[trackId].milestones[milestone-1].points
        } else {
          sum.M = sum.M + tracks[trackId].milestones[milestone-1].points
        }
      }
    })
    return sum;
  }
  
  
  export const categoryColorScale = d3.scaleOrdinal()
  .domain(categoryIds)
  .range(['#FB8B24', '#D90368'])
  
  
  const pointsByTrackFromMilestoneMap = (milestoneMap: MilestoneMap): {[TrackId]: number} => {
    const result = {
      TECHNOLOGY: 0,
      SYSTEM: 0,
      PEOPLE: 0,
      PROCESS: 0,
      INFLUENCE: 0,
    };
    trackIds.forEach(trackId => {
      const milestone = milestoneMap[trackId];
      if (milestone > 0) {
        result[trackId] = tracks[trackId].milestones[milestone - 1].points;
      }
    });
    return result;
  };

  export const eligibleTitles = (milestoneMap: MilestoneMap): string[] => {
      const pointsByTrack = pointsByTrackFromMilestoneMap(milestoneMap)
      const list = titles
        .filter(t =>
          Object.entries(t.thresholds).every(([trackId, minPoints]) => {
            // $FlowFixMe: trackId is a TrackId key
            return pointsByTrack[trackId] >= (minPoints || 0)
          })
        )
        .map(t => t.label)
      return list.length ? list : ['No eligible title yet']
  }