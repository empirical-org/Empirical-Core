import * as React from 'react'
import { Range, getTrackBackground, } from 'react-range'

interface TwoThumbSliderProps {
  lowerValue: number,
  upperValue: number,
  minValue: number,
  maxValue: number,
  step: number,
  handleChange: (event: any) => void,
  onMouseDown: (event: any) => void,
  onTouchStart: (event: any) => void
}

const Track = ({ props, children, }) => {
  const { onMouseDown, style, ref, onTouchStart, values, minValue, maxValue, } = props
  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        ...style,
        height: '36px',
        display: 'flex',
        width: '100%'
      }}
    >
      <div
        ref={ref}
        style={{
          height: '5px',
          width: '100%',
          borderRadius: '4px',
          background: getTrackBackground({
            values: values,
            colors: ['#ccc', '#548BF4', '#ccc'],
            min: minValue,
            max: maxValue
          }),
          alignSelf: 'center'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export const Thumb = ({ props, isDragged, }) => (
  <div
    {...props}
    style={{
      ...props.style,
      height: '42px',
      width: '42px',
      borderRadius: '4px',
      backgroundColor: '#FFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0px 2px 6px #AAA'
    }}
  >
    <div
      style={{
        height: '16px',
        width: '5px',
        backgroundColor: isDragged ? '#548BF4' : '#CCC'
      }}
    />
  </div>
)

const TwoThumbSlider = (props: TwoThumbSliderProps) => {
  const { lowerValue, upperValue, minValue, maxValue, step, handleChange, } = props
  const values = [lowerValue, upperValue]
  return (
    <div
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
        renderThumb={({ props, isDragged }) => <Thumb isDragged={isDragged} props={props} />}
        renderTrack={({ props, children, }) => <Track props={props}>{children}</Track>}
        step={step}
        values={values}
      />
    </div>
  );
}
