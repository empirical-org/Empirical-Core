import * as React from 'react';

interface BannerProps {
  tagText?: string,
  primaryHeaderText: string,
  secondaryHeaderText?: string,
  bodyText: string|JSX.Element,
  closeAria?: string,
  closeIconSrc?: string,
  handleCloseCard?: () => void,
  icon?: {
    alt: string,
    src: string
  },
  buttons: {
    className?: string
    onClick?: () => void,
    href?: string,
    text: string,
    target?: string
  }[],
  bannerStyle?: string
  bannerColor?: string
}

export const PostNavigationBanner = ({ tagText, primaryHeaderText, secondaryHeaderText, bodyText, icon, buttons, bannerStyle, bannerColor, closeIconSrc, handleCloseCard, closeAria }: BannerProps) => {
  const color = bannerColor ? bannerColor : 'green'
  const isPremium = bannerStyle && bannerStyle.includes('premium')
  const focusClass = bannerStyle && bannerStyle.includes('dark-mode') ? 'focus-on-dark' : 'focus-on-light'

  if(bannerStyle && bannerStyle.includes('minimal')) {
    return(
      <div className={`banner-container ${bannerStyle} ${color}`}>
        <div className="left-side-container">
          {tagText && <p className="tag">{tagText}</p>}
          <p className="primary-header">{primaryHeaderText}</p>
          <p className="body">{bodyText}</p>
        </div>
        <div className="buttons-container">
          {buttons.map((button, i) => {
            const { className, onClick, href, text, target } = button
            let buttonClass = `quill-button ${isPremium ? '' : color} `
            if(className) {
              buttonClass += className
            } else {
              buttonClass += "small contained"
            }
            if(button.onClick) {
              return <button className={`${buttonClass} ${focusClass}`} key={`button-${i}`} onClick={onClick}>{text}</button>
            } else {
              return <a className={`${buttonClass} ${focusClass}`} href={href} key={`button-${i}`} rel="noopener noreferrer" target={target}>{text}</a>
            }
          })}
        </div>
      </div>
    )
  }
  return(
    <div className={`banner-container ${bannerStyle} ${color}`}>
      <div className="left-side-container">
        {(tagText || secondaryHeaderText) && <div className="upper-section">
          {tagText && <p className="tag">{tagText}</p>}
          {secondaryHeaderText && <p className="secondary-header">{secondaryHeaderText}</p>}
        </div>}
        <p className="primary-header">{primaryHeaderText}</p>
        <p className="body">{bodyText}</p>
        <div className="buttons-container">
          {buttons.map((button, i) => {
            const { className, onClick, href, text, target } = button
            let buttonClass = `quill-button ${isPremium ? '' : color} `
            if (className) {
              buttonClass += className
            } else {
              buttonClass += "small contained"
            }
            if(button.onClick) {
              return <button className={`${buttonClass} ${focusClass}`} key={`button-${i}`} onClick={onClick}>{text}</button>
            } else {
              return <a className={`${buttonClass} ${focusClass}`} href={href} key={`button-${i}`} rel="noopener noreferrer" target={target}>{text}</a>
            }
          })}
        </div>
      </div>
      <img alt={icon.alt} className="banner-icon" src={icon.src} />
      {handleCloseCard && <button aria-label={closeAria} className="interactive-wrapper close-button" onClick={handleCloseCard} type="button"><img alt="" src={closeIconSrc} /></button>}
    </div>
  )
}

export default PostNavigationBanner
