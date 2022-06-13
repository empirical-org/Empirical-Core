import * as React from 'react'

interface cuesFieldProps {
  handleCuesChange: any,
  cues: Array<string>,
}

const CuesField: React.SFC<any> = (props) => {
  return (
    <div className="cues-field field">
      <div className="spread-label">
        <label>Joining Words <span className="optional">(Optional)</span></label>
        <span>Make sure you separate words with commas “,”</span>
      </div>
      <div className="control">
        <input className="input" onChange={props.handleCuesChange} type="text" value={props.cues.join(',')} />
      </div>
    </div>
  )
}

export default CuesField
