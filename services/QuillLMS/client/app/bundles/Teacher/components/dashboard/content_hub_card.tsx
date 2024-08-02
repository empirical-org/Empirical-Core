import * as React from 'react'

export const WORLD_HISTORY = 'worldHistory'
export const AI_KNOWLEDGE = 'aiKnowledge'

const cardData = {
  [WORLD_HISTORY]: {
    title: 'World History Activities',
    content: (
      <div className="content">
        <h3>Who is it for?</h3>
        <p>High school world history and ELA teachers who want to supplement their curriculum with a deep dive into essential world history topics and themes.</p>
        <h3>Pair with OER Project for deeper learning</h3>
        <p>Each activity has a free paired activity from OER Project that can be used in tandem with Quill activities.</p>
      </div>
    ),
    logo: <img alt="Quill logo plus OER Project logo" src={`${process.env.CDN_URL}/images/pages/dashboard/quill-and-oer-logo.svg`} />,
    href: '/assign/social-studies'
  },
  [AI_KNOWLEDGE]: {
    title: 'AI Knowledge Activities',
    content: (
      <div className="content">
        <h3>Who is it for?</h3>
        <p>8-12 Computer Science, ELA, or General Education teachers who want to introduce nonfiction articles about AI and its impact on society to their classrooms.</p>
        <h3>Pair with aiEDU for deeper learning</h3>
        <p>Each activity has a free paired activity from our partner nonprofit aiEDU that can be used in tandem with Quill activities.</p>
      </div>
    ),
    logo: <img alt="Quill logo plus aiEDU: The AI Education Project logo" src={`${process.env.CDN_URL}/images/pages/dashboard/quill-and-ai-edu-logo.svg`} />,
    href: '/assign/interdisciplinary-science'
  }
}

const ContentHubCard = ({ contentHub, }) => {
  const { title, content, logo, href, } = cardData[contentHub]
  return (
    <section className="content-hub-card">
      <a href={href}>
        <h2>{title}<span className="gold-new-tag">NEW</span></h2>
        {content}
        <div className="logo-container">
          {logo}
        </div>
      </a>
    </section>
  )
}

export default ContentHubCard
