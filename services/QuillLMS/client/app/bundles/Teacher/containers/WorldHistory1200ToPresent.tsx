import * as React from 'react';

import { Tooltip, } from '../../Shared/index'

const chevronLeftImgSrc = `${process.env.CDN_URL}/images/icons/xs/chevron-left.svg`
const headerImgSrc = `${process.env.CDN_URL}/images/pages/content_hub/world_history_1200_to_present@2x.png`
const imageCreditTooltipText = '<p><a href="https://purl.stanford.edu/cr193ys2567" rel="noopener noreferrer" target="_blank">"A New and Accurat Map of the World Drawne according to ye truest Descriptions lastest Discoveries & best observations yt have beene made by English or Strangers."</a> by John Speed (1552-1629), <a href="https://exhibits.stanford.edu/ruderman" target="_blank" rel="noopener noreferrer">The Barry Lawrence Ruderman Map Collection</a>, <a href="https://www.stanford.edu/" target="_blank" rel="noopener noreferrer">Stanford University</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a></p>'

const WorldHistory1200ToPresent = ({}) => {
  return (
    <div className="container content-hub-course-page-container">
      <a className="quill-button medium outlined grey icon focus-on-light" href="/social_studies"><img alt="" src={chevronLeftImgSrc} />View all social studies activities</a>
      <div className="overview">
        <div>
          <h1>World History: 1200 CE - Present</h1>
          <p className="overview-description">World history, or the story of our past, belongs to everyone: it helps us understand where we've come from, how we got here, and where we might go next. In this course, students explore that shared human story beginning with the rise of complex, connected societies and ending with the emergence of the globalized world in which we live today.</p>
          <p className="overview-description">Quill Reading for Evidence activities provide a deep dive into key moments and movements from the period spanning 1200 CE to the present, helping students expand their content knowledge while building core reading and writing skills.</p>
          <a className="quill-button contained medium green focus-on-light" href="">View Teacher Resources</a>
        </div>
        <div>
          <img alt="" src={headerImgSrc} />
          <Tooltip tooltipText={imageCreditTooltipText} tooltipTriggerText="Image credit" tooltipTriggerTextClass="image-attribution-tooltip" />
        </div>
      </div>
    </div>
  )
}

export default WorldHistory1200ToPresent
