import * as React from 'react'
import { Range, getTrackBackground, } from 'react-range'

interface SharedSliderProps {
  minValue: number,
  maxValue: number,
  step: number,
  handleChange: (values: number[]) => void,
  markLabels?: string[]|number[],
  id?: string,
}

interface SliderProps extends SharedSliderProps {
  values: number[]
  trackColors: string[]
  className?: string,
}

interface TwoThumbSliderProps extends SharedSliderProps {
  lowerValue: number,
  upperValue: number,
}

interface OneThumbSliderProps extends SharedSliderProps {
  value: number,
  defaultValue: number
}

const Track = ({ props, children, colors, values, minValue, maxValue, }) => {
  const { style, ref, onMouseDown, onTouchStart, } = props
  const background = getTrackBackground({
    values,
    colors,
    min: minValue,
    max: maxValue
  })

  return (
    // disabling lint on next line because the interaction is redundant
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="track-container"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={style}
    >
      <div
        className="track"
        ref={ref}
        style={{ background, }}
      >
        {children}
      </div>
    </div>
  )
}

const Thumb = ({ props, }) => {
  const { style, } = props

  return (
    <div
      {...props}
      className="thumb"
      style={style}
    />
  )
}

const Mark = ({ props, index, markLabels, }) => {
  let className = 'mark'
  className += index === 0 ? ' first-mark' : ''
  className += markLabels && index === markLabels.length - 1 ? ' last-mark' : ''
  return <div {...props} className={className}>{markLabels && markLabels[index]}</div>
}

const Slider = ({ values, minValue, maxValue, step, handleChange, markLabels, id, className, trackColors, }: SliderProps) => {
  const renderThumb = ({ props, }) =>  { return <Thumb props={props} /> }

  const renderMark = ({ props, index, }) => { return <Mark index={index} markLabels={markLabels} props={props} /> }

  const renderTrack = ({ props, children, }) => {
    return (
      <Track
        colors={trackColors}
        maxValue={maxValue}
        minValue={minValue}
        props={props}
        values={values}
      >
        {children}
      </Track>
    )
  }

  return (
    <div
      className={className}
      id={id}
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Range
        max={maxValue}
        min={minValue}
        onChange={handleChange}
        renderMark={renderMark}
        renderThumb={renderThumb}
        renderTrack={renderTrack}
        step={step}
        values={values}
      />
    </div>
  );
}

export const OneThumbSlider = ({ value, defaultValue, minValue, maxValue, step, handleChange, markLabels, id, }: OneThumbSliderProps) => {
  const disabled = !value && value !== 0
  const values = disabled ? [defaultValue || minValue] : [value]

  let className = "slider-container one-thumb-slider-container"

  if (disabled) {
    className += ' display-as-disabled'
  }

  const trackColors = disabled ? ['#dbdbdb', '#dbdbdb'] : ['#dbdbdb', '#06806b']

  const sliderProps = { values, minValue, maxValue, step, handleChange, markLabels, id, className, trackColors, }

  return <Slider {...sliderProps} />
}

export const TwoThumbSlider = ({ lowerValue, upperValue, minValue, maxValue, step, handleChange, markLabels, id, }: TwoThumbSliderProps) => {
  const values = [lowerValue, upperValue]

  const className = "slider-container two-thumb-slider-container"

  const trackColors = ['#dbdbdb', '#06806b', '#dbdbdb']

  const sliderProps = { values, minValue, maxValue, step, handleChange, markLabels, id, className, trackColors, }

  return <Slider {...sliderProps} />
}
