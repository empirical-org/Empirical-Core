import * as React from 'react'
import { Range, getTrackBackground, } from 'react-range'

interface TwoThumbSliderProps {
  lowerValue: number,
  upperValue: number,
  minValue: number,
  maxValue: number,
  step: number,
  handleChange: (values: number[]) => void,
  markLabels?: string[]|number[],
  id?: string
}

const Track = ({ props, children, values, minValue, maxValue, }) => {
  const { style, ref, onMouseDown, onTouchStart, } = props
  const background = getTrackBackground({
    values,
    colors: ['#dbdbdb', '#06806b', '#dbdbdb'],
    min: minValue,
    max: maxValue
  })

  return (
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

export const TwoThumbSlider = (props: TwoThumbSliderProps) => {
  const { lowerValue, upperValue, minValue, maxValue, step, handleChange, markLabels, id, } = props
  const values = [lowerValue, upperValue]
  return (
    <div
      className="slider-container two-thumb-slider-container"
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
        renderMark={({ props, index, }) => <Mark index={index} markLabels={markLabels} props={props} />}
        renderThumb={({ props, isDragged }) => <Thumb props={props} />}
        renderTrack={({ props, children, }) => <Track maxValue={maxValue} minValue={minValue} props={props} values={values}>{children}</Track>}
        step={step}
        values={values}
      />
    </div>
  );
}
