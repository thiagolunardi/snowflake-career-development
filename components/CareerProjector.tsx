import React from 'react'
import { eligibleTitles } from '../constants'
import type { MilestoneMap } from '../constants'

type Props = {
  milestoneByTrack: MilestoneMap,
  currentTitle: string,
  setTitleFn: (string) => void
}

class CareerProjector extends React.Component<Props> {
  render() {
    const titles = eligibleTitles(this.props.milestoneByTrack)
    return (
      <div>
        <style jsx>{`
          .modalBackdrop {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left 0;
            background-color: rgba(0, 0, 0, 0.75);
          }
        `}

        </style>
        <div>

          <div style={{ margin: 'auto', background: 'white', border: 'purple', width:'500px', borderRadius: '13px', padding: '21px'}}>
            <h1>
              What is this?
            </h1>
            
            <p>Having a formal system means we can better support the growth of our engineers. </p>
            <p>We’re able to have more honest, open conversations about progress, promotions, and opportunity. </p>
            <p>While the framework is still relatively new, it is showing early promise at incentivising the kinds of behaviours we want to see in the team, and recognising the different kinds of value that people add. </p>
            <p>We already have ideas on how to improve the framework further, and plan to continue iterating on it over time. </p>

            <h1>
              Skillset Projection:
            </h1>
            
            <h2> 

            {titles.map(title => (
              <option key={title}>
                {title}
              </option>
            ))}
            </h2>
            
          </div>
        </div>
      </div>
    );
  }
}

export default CareerProjector

