import React, { useMemo } from 'react'
import * as d3 from 'd3'
import { trackIds, milestones, tracks, categoryColorScale } from '../constants'
import type { TrackId, Milestone, MilestoneMap } from '../constants'

const width = 400
const arcMilestones = milestones.slice(1) // we'll draw the '0' milestone with a circle, not an arc.

type Props = {
  milestoneByTrack: MilestoneMap,
  focusedTrackId: TrackId,
  handleTrackMilestoneChangeFn: (trackId: TrackId, milestone: Milestone) => void
}

function NightingaleChart({ milestoneByTrack, focusedTrackId, handleTrackMilestoneChangeFn }: Props) {
  const colorScale = useMemo(
    () => d3.scaleSequential([0, 5], d3.interpolateWarm),
    []
  )

  const radiusScale = useMemo(
    () => d3.scaleBand<number>()
      .domain(arcMilestones)
      .range([.15 * width, .45 * width])
      .paddingInner(0.1),
    []
  )

  const arcFn = useMemo(
    () => (d3.arc() as d3.Arc<unknown, number>)
      .innerRadius(milestone => radiusScale(milestone)!)
      .outerRadius(milestone => radiusScale(milestone)! + radiusScale.bandwidth())
      .startAngle(- Math.PI / trackIds.length)
      .endAngle(Math.PI / trackIds.length)
      .padAngle(Math.PI / 200)
      .padRadius(.45 * width)
      .cornerRadius(2),
    [radiusScale]
  )

  const currentMilestoneId = milestoneByTrack[focusedTrackId]
  return (
    <figure>
      <style jsx>{`
        figure {
          margin: 0;
        }
        svg {
          width: ${width}px;
          height: ${width}px;
        }
        .track-milestone {
          fill: white;
          cursor: pointer;
        }
        .track-milestone-current, .track-milestone:hover {
          stroke: #000;
          stroke-width: 4px;
          stroke-linejoin: round;
        }
      `}</style>
      <svg>
        <g transform={`translate(${width/2},${width/2}) rotate(-33.75)`}>
          {trackIds.map((trackId, i) => {
            const isCurrentTrack = trackId === focusedTrackId
            return (
              <g key={trackId} transform={`rotate(${i * 360 / trackIds.length})`}>
                {arcMilestones.map((milestone) => {
                  const isCurrentMilestone = isCurrentTrack && milestone === currentMilestoneId
                  const isMet = milestoneByTrack[trackId] >= milestone || milestone === 0
                  return (
                    <path
                        key={milestone}
                        className={'track-milestone ' + (isMet ? 'is-met ' : ' ') + (isCurrentMilestone ? 'track-milestone-current' : '')}
                        onClick={() => handleTrackMilestoneChangeFn(trackId, milestone as Milestone)}
                        d={arcFn(milestone)}
                        style={{fill: isMet ? categoryColorScale(tracks[trackId].category) : undefined}} />
                  )
                })}
                <title id="title">{tracks[trackId].displayName}</title>
                <circle
                    r="8"
                    cx="0"
                    cy="-50"
                    style={{fill: categoryColorScale(tracks[trackId].category)}}
                    className={"track-milestone " + (isCurrentTrack && !currentMilestoneId ? "track-milestone-current" : "")}
                    onClick={() => handleTrackMilestoneChangeFn(trackId, 0)} 
                    />
              </g>
          )
          })}
        </g>
      </svg>
    </figure>
  )
}

export default NightingaleChart
