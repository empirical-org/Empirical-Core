// adapted from https://github.com/JackPu/reactjs-percentage-circle/blob/master/src/index.js

import * as React from 'react';

const PercentageCircle = ({ percent, borderWidth, radius, bgcolor, color, children, textStyle, innerColor, }) => {

  let leftTransformerDegree = '0deg';
  let rightTransformerDegree = '0deg';
  if (percent >= 50) {
    rightTransformerDegree = '180deg';
    leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
  } else {
    rightTransformerDegree = percent * 3.6 + 'deg';
    leftTransformerDegree = '0deg';
  }

  return (
    <div
      className="percentage-circle"
      style={{
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius,
        backgroundColor: bgcolor,
      }}
    >
      <div
        className="left-wrap"
        style={{
          width: radius,
          height: radius * 2,
          left: 0,
        }}
      >
        <div
          className="loader"
          id="id1"
          style={{
            left: radius,
            width: radius,
            height: radius * 2,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: color,
            transform: 'rotate(' + leftTransformerDegree + ')',
          }}
        />
      </div>
      <div
        className="right-wrap"
        style={{
          width: radius,
          height: radius * 2,
          left: radius,
        }}
      >
        <div
          className="loader2"
          id="id2"
          style={{
            left: -radius,
            width: radius,
            height: radius * 2,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: color,
            transform: 'rotate(' + rightTransformerDegree + ')',
          }}
        />
      </div>
      <div
        className="inner-circle"
        style={{
          left: borderWidth,
          top: borderWidth,
          width: (radius - borderWidth) * 2,
          height: (radius - borderWidth) * 2,
          borderRadius: radius - borderWidth,
          backgroundColor: innerColor,
        }}
      >
        {children ? children : <span className={'text ' + textStyle}>{percent}%</span>}
      </div>
    </div>
  );
}

export default PercentageCircle
