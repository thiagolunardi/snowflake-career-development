import React, { memo } from 'react'
import Help from "./Help";

type Props = {
  name: string,
  setNameFn: (name: string) => void
}

const Header = memo(function Header({ name, setNameFn }: Props) {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10%', height: '100px'}}>
    <div style={{width: 120, height: '100%', display: 'flex', alignItems: 'center'}}>
      <div className="aui">
      <img width="200px" alt="Company logo" src="https://s101-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/400/181/710/original/paymenttools_Logo_Yellow_Purple_RGB.png?1721728389"/>
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
          Enter Engineer&apos;s Name Here
        </span>
      <input
        type="text"
        className="name-input center"
        value={name}
        onChange={e => setNameFn(e.target.value)}
        placeholder="Jane Doe"
      />
      </label>
    </form>

    <Help />
    </div>
  );
})

export default Header;
