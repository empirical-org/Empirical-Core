import * as React from 'react'
import { Link, } from 'react-router-dom';

import { INTEGRATIONS, SECTION_NAME_TO_ICON_URL, iconLinkBase, } from './shared'

export const integrationTiles = [
  {
    name: 'Canvas',
    link: '/teachers/premium_hub/integrations/canvas',
    icon: `${iconLinkBase}/canvas.svg`,
    description: 'Make teaching at your school even more effective with our seamless Canvas integration.',
  },
  {
    name: 'Google Classroom',
    link: '/teachers/premium_hub/integrations/google',
    icon: `${iconLinkBase}/google-classroom.svg`,
    description: 'Make teaching at your school even more effective with our seamless Google Classroom integration.',
  },
  {
    name: 'Clever',
    link: '/teachers/premium_hub/integrations/clever',
    icon: `${iconLinkBase}/clever.svg`,
    description: 'Make teaching at your school even more effective with our seamless Clever integration.',
  }
]

const IntegrationsSection = () => {
  const tiles = integrationTiles.map(tile => {
    return (
      <div className="tile" key={tile.name}>
        <div>
          <h3>{tile.name}</h3>
          <p>{tile.description}</p>
        </div>
        <div className="link-and-image">
          <Link className="quill-button focus-on-light outlined secondary medium" to={tile.link}>Learn more</Link>
          <img alt="" src={tile.icon} />
        </div>
      </div>
    )
  })

  return (
    <section className="overview-section-wrapper integrations">
      <h2>
        <img alt="" src={SECTION_NAME_TO_ICON_URL[INTEGRATIONS]} />
        <span>{INTEGRATIONS}</span>
      </h2>
      <div className="overview-section">
        <div className="overview-section-content">
          {tiles}
        </div>
      </div>
    </section>
  )
}

export default IntegrationsSection
