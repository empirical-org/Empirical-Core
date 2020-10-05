import * as React from 'react'

import { TwoThumbSlider } from '../../../Shared/index'

const Sliders = () => {
  const [lowerValue, setLowerValue] = React.useState(1)
  const [upperValue, setUpperValue] = React.useState(4)

  const onChange = (valuesArray) => {
    setLowerValue(valuesArray[0])
    setUpperValue(valuesArray[1])
  }

    return (<div id="sliders">
      <h2 className="style-guide-h2">Sliders</h2>
      <div className="element-container">
        <pre>
          {
  `
  const [lowerValue, setLowerValue] = React.useState(1)
  const [upperValue, setUpperValue] = React.useState(4)

  const onChange = (valuesArray) => {
    setLowerValue(valuesArray[0])
    setUpperValue(valuesArray[1])
  }

  return (<div className="sliders-container">
    <TwoThumbSlider
      handleChange={onChange}
      lowerValue={lowerValue}
      markLabels={[1, 2, 3, 4]}
      maxValue={4}
      minValue={1}
      step={1}
      upperValue={upperValue}
    />
  </div>)`
          }
        </pre>
        <div className="sliders-container">
          <TwoThumbSlider
            handleChange={onChange}
            lowerValue={lowerValue}
            markLabels={[1, 2, 3, 4]}
            maxValue={4}
            minValue={1}
            step={1}
            upperValue={upperValue}
          />
        </div>
      </div>
    </div>)

//   return (<div id="sliders">
//     <h2 className="style-guide-h2">Sliders</h2>
//     <div className="element-container">
//       <pre>
//         {
// `<div className="sliders-container">
// <TwoThumbSlider
//   tooltipText="I am a tooltip!"
//   tooltipTriggerText="Hover here"
// />
// </div>`
//         }
//       </pre>
//       <div className="sliders-container">
//         <TwoThumbSlider
//           lowerValue={lowerValue}
//           upperValue={upperValue}
//           minValue={1}
//           maxValue={4}
//           step={1}
//           handleChange={onChange}
//         />
//       </div>
//     </div>
//   </div>)
}

export default Sliders
