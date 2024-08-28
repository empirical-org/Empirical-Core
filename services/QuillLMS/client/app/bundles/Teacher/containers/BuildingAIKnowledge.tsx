import * as React from 'react';

import CoursePage from './CoursePage'
import { Tooltip, } from '../../Shared/index'

const chevronLeftImgSrc = `${process.env.CDN_URL}/images/icons/xs/chevron-left.svg`
const headerImgSrc = `${process.env.CDN_URL}/images/pages/content_hub/building_ai_knowledge@2x.png`

const imageCreditTooltipText = '<p><a href="https://commons.wikimedia.org/wiki/File:DALL-E_3_-_advanced_artificial_intelligence.png" rel="noopener noreferrer" target="_blank">"DALL-E 3 - advanced artificial intelligence"</a> by Alenoach is in the <a href="https://wiki.creativecommons.org/wiki/Public_domain" rel="noopener noreferrer" target="_blank">Public Domain</a></p>'

const LOCAL_STORAGE_KEY = 'buildingAIKnowledgeExpandedUnitTemplateIds'

const SLUG = 'building-ai-knowledge'

const BuildingAIKnowledge = ({ backlinkPath, }) => {
  const contentPage = backlinkPath || window.location.href.split(SLUG)[0]
  const contentPageLink = <a className="quill-button medium outlined grey icon focus-on-light" href={contentPage}><img alt="" src={chevronLeftImgSrc} />View all interdisciplinary science activities</a>

  const overviewSection = (
    <div className="overview">
      <div>
        <h1>Building AI Knowledge</h1>
        <p className="overview-description">In recent years, significant advancements have been made in artificial intelligence, and now it's expected to play an integral part in everyday life in the near future. Quill's Building AI Knowledge activities aim to provide teachers and students with an understanding of how AI works and to explain what skills and knowledge are needed to thrive in an AI-driven world.</p>
        <p className="overview-description">Quill Reading for Evidence activities are designed to engage students in learning about AI by exploring how it might impact their lives and the world around them. Students read a mix of stories that explore both the potential promises and pitfalls of AI. One of the main goals of this offering is to show students that AI is not just something that exists in the world; it is something that humans create. The young people reading these articles will have the opportunity to shape the future of AI, either by working with technology directly or by being informed citizens who influence laws.</p>
      </div>
      <div>
        <img alt="" src={headerImgSrc} />
        <Tooltip tooltipText={imageCreditTooltipText} tooltipTriggerText="Image credit" tooltipTriggerTextClass="image-attribution-tooltip" />
      </div>
    </div>
  )

  const partnerSection = (
    <div className="partner-section">
      <h2>Paired with aiEDU for deeper learning</h2>
      <p>Quill.org & aiEDU, two nonprofit organizations dedicated to building foundational AI literacy, have partnered to curate a suite of resources from each organization that can be paired together to build student knowledge of AI. Each Quill activity can be paired with an aiEDU activity, which range from in-depth, 2-3 hour activities to 5-minute snapshot discussion items. Want to learn more? Visit <a href="www.aiedu.org" rel="noopener noreferrer" target="_blank">www.aiedu.org</a>!</p>
      <a className="quill-button medium outlined grey focus-on-light" href={contentPage}>Learn more about Quill's interdisciplinary science activities</a>
    </div>
  )

  return (
    <CoursePage
      contentPageLink={contentPageLink}
      localStorageKey={LOCAL_STORAGE_KEY}
      overviewSection={overviewSection}
      partnerSection={partnerSection}
      unitTemplatePath='/teachers/progress_reports/building_ai_knowledge_unit_templates'
    />

  )
}

export default BuildingAIKnowledge
