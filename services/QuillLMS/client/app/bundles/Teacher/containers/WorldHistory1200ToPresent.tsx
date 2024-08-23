import * as React from 'react';

import CoursePage from './CoursePage'
import { Tooltip, } from '../../Shared/index'

const chevronLeftImgSrc = `${process.env.CDN_URL}/images/icons/xs/chevron-left.svg`
const headerImgSrc = `${process.env.CDN_URL}/images/pages/content_hub/world_history_1200_to_present@2x.png`

const imageCreditTooltipText = '<p><a href="https://purl.stanford.edu/cr193ys2567" rel="noopener noreferrer" target="_blank">"A New and Accurat Map of the World Drawne according to ye truest Descriptions lastest Discoveries & best observations yt have beene made by English or Strangers."</a> by John Speed (1552-1629), <a href="https://exhibits.stanford.edu/ruderman" rel="noopener noreferrer" target="_blank">The Barry Lawrence Ruderman Map Collection</a>, <a href="https://www.stanford.edu/" rel="noopener noreferrer" target="_blank">Stanford University</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0" rel="noopener noreferrer" target="_blank">CC BY-NC-SA 4.0</a></p>'

const LOCAL_STORAGE_KEY = 'worldHistory1200ToPresentExpandedUnitTemplateIds'

const SLUG = 'world-history-1200-to-present'

const WorldHistory1200ToPresent = ({ backlinkPath, }) => {
  const contentPage = backlinkPath || window.location.href.split(SLUG)[0]
  const contentPageLink = <a className="quill-button medium outlined grey icon focus-on-light" href={contentPage}><img alt="" src={chevronLeftImgSrc} />View all social studies activities</a>

  const overviewSection = (
    <div className="overview">
      <div>
        <h1>World History: 1200 CE - Present</h1>
        <p className="overview-description">World history, or the story of our past, belongs to everyone: it helps us understand where we&#39;ve come from, how we got here, and where we might go next. In this course, students explore that shared human story beginning with the rise of complex, connected societies and ending with the emergence of the globalized world in which we live today.</p>
        <p className="overview-description">Quill Reading for Evidence activities provide a deep dive into key moments and movements from the period spanning 1200 CE to the present, helping students expand their content knowledge while building core reading and writing skills.</p>
      </div>
      <div>
        <img alt="" src={headerImgSrc} />
        <Tooltip tooltipText={imageCreditTooltipText} tooltipTriggerText="Image credit" tooltipTriggerTextClass="image-attribution-tooltip" />
      </div>
    </div>
  )

  const partnerSection = (
    <div className="partner-section">
      <h2>Paired with the OER Project for deeper learning</h2>
      <p>OER Project provides open educational resources to empower teachers to better serve their students through innovative curricula and teaching tools. Currently, OER Project offers three complete social studies courses: Big History Project (BHP), World History Project (WHP), and World History AP (WH AP). Each course includes primary and secondary source readings, videos, and learning activities, along with scaffolded supports like leveled texts. <a href="https://www.oerproject.com/World-History?WT.mc_id=00_00_2024__course-WHP_OER-QUILL_&WT.tsrc=OERQUILL" rel="noopener noreferrer" target="_blank">Learn more about OER Project’s World History Project</a>.</p>
      <a className="quill-button medium outlined grey focus-on-light" href={contentPage}>Learn More About Quill’s Social Studies Activities</a>
    </div>
  )

  return (
    <CoursePage
      contentPageLink={contentPageLink}
      localStorageKey={LOCAL_STORAGE_KEY}
      overviewSection={overviewSection}
      partnerSection={partnerSection}
      unitTemplatePath='/teachers/progress_reports/world_history_1200_to_present_unit_templates'
    />
  )
}

export default WorldHistory1200ToPresent
