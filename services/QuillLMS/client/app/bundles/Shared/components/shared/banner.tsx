import * as React from 'react';

import { arrowPointingRightIcon } from '../../images';

interface BannerProps {
  tagText?: string,
  primaryHeaderText: string,
  secondaryHeaderText?: string,
  bodyText: string,
  icon: {
    alt: string,
    src: string
  },
  buttons: {
    onClick?: () => void,
    href?: string,
    standardButtonStyle: boolean,
    text: string,
    target?: string
  }[],
  bannerStyle: string
}

export const Banner = ({ tagText, primaryHeaderText, secondaryHeaderText, bodyText, icon, buttons, bannerStyle }: BannerProps) => {
  return(
    <div className={`banner-container ${bannerStyle}`}>
      <div className="left-side-container">
        {tagText && <div className="upper-section">
          <p className="tag">{tagText}</p>
          {secondaryHeaderText && <p className="secondary-header">{secondaryHeaderText}</p>}
        </div>}
        <p className="primary-header">{primaryHeaderText}</p>
        <p className="body">{bodyText}</p>
        <div className="buttons-container">
          {buttons.map((button, i) => {
            const { onClick, href, standardButtonStyle, text, target } = button
            const buttonClass = standardButtonStyle ? "quill-button fun primary contained" : "nonstandard-banner-button"
            if(button.onClick) {
              return <button className={`${buttonClass} focus-on-light`} key={`button-${i}`} onClick={onClick}>{text}</button>
            } else {
              return <a className={`${buttonClass} focus-on-light`} href={href} key={`button-${i}`} rel="noopener noreferrer" target={target}>{text} {!standardButtonStyle && <img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} />}</a>
            }
          })}
        </div>
      </div>
      <img alt={icon.alt} className="banner-icon" src={icon.src} />
    </div>
  )
}

export default Banner
