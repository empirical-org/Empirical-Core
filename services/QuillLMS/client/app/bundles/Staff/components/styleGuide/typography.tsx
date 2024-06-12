import * as React from "react";

const displayScale = [
  {
    mixinName: 'display-2xl',
    displayText: 'Adelle Sans - Bold 32pt'
  },
  {
    mixinName: 'display-2xl-semibold',
    displayText: 'Adelle Sans - Semibold 32pt'
  },
  {
    mixinName: 'display-xl',
    displayText: 'Adelle Sans - Bold 24pt'
  },
  {
    mixinName: 'display-xl-semibold',
    displayText: 'Adelle Sans - Semibold 24pt'
  },
  {
    mixinName: 'display-l',
    displayText: 'Adelle Sans - Bold 20pt'
  },
  {
    mixinName: 'display-l-semibold',
    displayText: 'Adelle Sans - Semibold 20pt'
  },
  {
    mixinName: 'display-m',
    displayText: 'Adelle Sans - Bold 18pt'
  },
  {
    mixinName: 'display-m-semibold',
    displayText: 'Adelle Sans - Semibold 18pt'
  },
  {
    mixinName: 'display-s',
    displayText: 'Adelle Sans - Bold 16pt'
  },
  {
    mixinName: 'display-s-semibold',
    displayText: 'Adelle Sans - Semibold 16pt'
  },
  {
    mixinName: 'display-xs',
    displayText: 'Adelle Sans - Bold 13pt'
  },
  {
    mixinName: 'display-xs-semibold',
    displayText: 'Adelle Sans - Semibold 13pt'
  },
  {
    mixinName: 'display-2xs',
    displayText: 'Adelle Sans - Bold 12pt'
  },
  {
    mixinName: 'display-2xs-semibold',
    displayText: 'Adelle Sans - Semibold 12pt'
  },
]

const textScale = [
  {
    mixinName: 'text-2xl',
    displayText: 'Adelle Sans - Regular 24pt'
  },
  {
    mixinName: 'text-xl',
    displayText: 'Adelle Sans - Regular 20pt'
  },
  {
    mixinName: 'text-l',
    displayText: 'Adelle Sans - Regular 18pt'
  },
  {
    mixinName: 'text-m',
    displayText: 'Adelle Sans - Regular 16pt'
  },
  {
    mixinName: 'text-s',
    displayText: 'Adelle Sans - Regular 14pt'
  },
  {
    mixinName: 'text-xs',
    displayText: 'Adelle Sans - Regular 13pt'
  },
  {
    mixinName: 'text-2xs',
    displayText: 'Adelle Sans - Regular 12pt'
  },
]

const navigationScale = [
  {
    mixinName: 'navigation-l',
    displayText: 'Adelle Sans - Semibold 14pt'
  },
  {
    mixinName: 'navigation-m',
    displayText: 'Adelle Sans - Semibold 13pt'
  },
]

const renderElement = (displayText, mixinName) => (
  <div className={mixinName} key={mixinName}>
    <span>{mixinName}</span>
    <span>{displayText}</span>
  </div>
)


const Typography = () => {

  return (
    <div id="typography">
      <h2 className="style-guide-h2">Typography</h2>
      <p>In order to use these styles, include the mixin name (on the left) inside a CSS rule, ex: <code>@include display-m</code></p>
      <div className="element-container">
        {displayScale.map(displayStyle => renderElement(displayStyle.displayText, displayStyle.mixinName))}
      </div>
      <div className="element-container">
        {textScale.map(textStyle => renderElement(textStyle.displayText, textStyle.mixinName))}
      </div>
      <div className="element-container">
        {navigationScale.map(navigationStyle => renderElement(navigationStyle.displayText, navigationStyle.mixinName))}
      </div>
    </div>
  )
}

export default Typography
