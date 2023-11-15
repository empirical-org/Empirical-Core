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
    className: string,
    onClick?: () => void,
    href?: string,
    text: string,
    target?: string
  }[],
  bannerStyle: string
}

export const Banner = ({ tagText, primaryHeaderText, secondaryHeaderText, bodyText, icon, buttons, bannerStyle }: BannerProps) => {
  return(
    <div className={`banner-container ${bannerStyle}`}>
      <div className="left-side-container">
        <div className="upper-section">
          {tagText && <p className="tag">{tagText}</p>}
          {secondaryHeaderText && <p className="secondary-header">{secondaryHeaderText}</p>}
        </div>
        <p className="primary-header">{primaryHeaderText}</p>
        <p className="body">{bodyText}</p>
        <div className="buttons-container">
          {buttons.map(button => {
            const { className, onClick, href, text, target } = button
            const showArrow = className === "nonstandard-banner-button"
            if(button.onClick) {
              return <button className={className} onClick={onClick}>{text}</button>
            } else {
              return <a className={className} href={href} rel="noopener noreferrer" target={target}>{text} {showArrow && <img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} />}</a>
            }
          })}
        </div>
      </div>
      <img alt={icon.alt} className="banner-icon" src={icon.src} />
    </div>
  )
}

export default Banner
