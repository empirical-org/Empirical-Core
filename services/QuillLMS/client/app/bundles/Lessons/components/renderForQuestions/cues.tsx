import * as React from 'react';
import {
  Cue,
  CueExplanation
} from '../../../Shared/index';

const arrow = `${process.env.CDN_URL}/images/icons/pointing-arrow.svg`;

// temporarily making this an export and leaving the default export because of the other components that use it
const Cues = ({ cues, displayArrowAndText, }: { cues: string[], displayArrowAndText?: boolean }) => {
  if (!(cues && cues.length && cues.filter(cue => cue.length).length)) { return <span /> }

  const cueDivs = cues.map((cue, i) => <Cue cue={cue} key={`${i}${cue}`} />)
  const arrowAndText = displayArrowAndText && (
    <React.Fragment>
      <img alt="Arrow Icon" src={arrow} />
      <CueExplanation text='choose one' />
    </React.Fragment>
  )
  return (
    <div className="cues">
      {cueDivs}
      {arrowAndText}
    </div>
  )
}

export default Cues
