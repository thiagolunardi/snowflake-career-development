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

export const iCTitles = [
  {label: 'Software Engineer - L1', minPoints: 0, maxPoints: 60},
  {label: 'Software Engineer - L2', minPoints: 60, maxPoints: 90},
  {label: 'Software Engineer - L3', minPoints: 80, maxPoints: 110},
  {label: 'Senior Software Engineer - L4', minPoints: 100, maxPoints: 130},
  {label: 'Senior Software Engineer - L5', minPoints: 140, maxPoints: 180},
  {label: 'Staff / Architect - L6', minPoints: 180, maxPoints: 210},
  {label: 'Principal Engineer - L7', minPoints: 210, maxPoints: 230}
]

export const titles = iCTitles

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
  
  
  export const eligibleTitles = (milestoneMap: MilestoneMap): string[] => {
      const totalPoints = totalPointsFromMilestoneMap(milestoneMap)
      return iCTitles
        .filter(title => (title.minPoints === undefined || totalPoints.IC >= title.minPoints)
          && (title.maxPoints === undefined || totalPoints.IC <= title.maxPoints))
        .map(title => title.label)
  }