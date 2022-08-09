import * as React from 'react'
import { Range, getTrackBackground, } from 'react-range'

interface OneThumbSliderProps {
  value: number,
  minValue: number,
  maxValue: number,
  step: number,
  handleChange: (values: number[]) => void,
  markLabels?: string[]|number[],
  id?: string,
}

const Track = ({ props, children, displayAsDisabled, values, minValue, maxValue, }) => {
  const { style, ref, onMouseDown, onTouchStart, } = props
  const background = getTrackBackground({
    values,
    colors: displayAsDisabled ? ['#dbdbdb', '#dbdbdb'] : ['#dbdbdb', '#06806b'],
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

export const OneThumbSlider = ({ value, minValue, maxValue, step, handleChange, markLabels, id, }: OneThumbSliderProps) => {
  const values = value ? [value] : [minValue]
  const disabled = value === undefined

  let className = "slider-container one-thumb-slider-container"

  if (disabled) {
    className += ' display-as-disabled'
  }

  return (
    // disabling jsx-a11y rules for onclick because we shouldn't be using this as the only way to enable it for keyboard users
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
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
        renderMark={({ props, index, }) => <Mark index={index} markLabels={markLabels} props={props} />}
        renderThumb={({ props, }) => <Thumb props={props} />}
        renderTrack={({ props, children, }) => <Track displayAsDisabled={disabled} maxValue={maxValue} minValue={minValue} props={props} values={values}>{children}</Track>}
        step={step}
        values={values}
      />
    </div>
  );
}
