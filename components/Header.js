// @flow

import React from 'react'
import Help from "./Help";

type Props = {
  name: String,
  setNameFn: (string) => void
}

class Header extends React.PureComponent<Props> {
  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10%', height: '100%'}}>
      <div style={{width: 120, height: '100%'}}>
        <div className="aui">
        <img width="200px" src="https://s101-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/400/181/710/original/paymenttools_Logo_Yellow_Purple_RGB.png?1721728389"/>
        </div>
      </div>

      <form>

        <label style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        }}>
          <span>
            Enter Engineer's Name Here
          </span>
        <input
          type="text"
          className="name-input center"
          value={this.props.name}
          onChange={e => this.props.setNameFn(e.target.value)}
          placeholder="Jane Doe"
        />
        </label>
      </form>

      <Help />
      </div>
    );
  }
}

export default Header;
