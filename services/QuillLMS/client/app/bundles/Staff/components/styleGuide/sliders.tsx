import * as React from 'react'

import { OneThumbSlider, TwoThumbSlider } from '../../../Shared/index'

const Sliders = () => {
  const [lowerValue, setLowerValue] = React.useState(1)
  const [upperValue, setUpperValue] = React.useState(4)
  const [value, setValue] = React.useState(null)

  const onChangeOneThumbSliderValue = (valuesArray) => {
    setValue(valuesArray[0])
  }

  const onChangeTwoThumbSliderValues = (valuesArray) => {
    setLowerValue(valuesArray[0])
    setUpperValue(valuesArray[1])
  }

  return (
    <div id="sliders">
      <h2 className="style-guide-h2">Sliders</h2>
      <div className="element-container">
        <h3>One Thumb Slider</h3>
        <pre>
          {
            `
  const [value, setValue] = React.useState(null)

  const onChangeOneThumbSliderValue = (valuesArray) => {
    setValue(valuesArray[0])
  }

  return (<div className="sliders-container">
    <OneThumbSlider
      handleChange={onChangeOneThumbSliderValue}
      markLabels={[1, 2, 3, 4]}
      maxValue={4}
      minValue={1}
      step={1}
      value={value}
    />
  </div>)`
          }
        </pre>
        <div className="sliders-container">
          <OneThumbSlider
            handleChange={onChangeOneThumbSliderValue}
            markLabels={[1, 2, 3, 4]}
            maxValue={4}
            minValue={1}
            step={1}
            value={value}
          />
        </div>
      </div>
      <div className="element-container">
        <h3>Two Thumb Slider</h3>
        <pre>
          {
            `
  const [lowerValue, setLowerValue] = React.useState(1)
  const [upperValue, setUpperValue] = React.useState(4)

  const onChangeTwoThumbSliderValues = (valuesArray) => {
    setLowerValue(valuesArray[0])
    setUpperValue(valuesArray[1])
  }

  return (<div className="sliders-container">
    <TwoThumbSlider
      handleChange={onChangeTwoThumbSliderValues}
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
            handleChange={onChangeTwoThumbSliderValues}
            lowerValue={lowerValue}
            markLabels={[1, 2, 3, 4]}
            maxValue={4}
            minValue={1}
            step={1}
            upperValue={upperValue}
          />
        </div>
      </div>

    </div>
  )
}

export default Sliders
