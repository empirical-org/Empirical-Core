import * as React from 'react'

import PreviewCard from '../shared/preview_card.jsx'
import { TEACHER_CENTER_SLUG } from '../blog_posts/blog_post_constants.ts'

const TeacherCenter = ({ featuredBlogPosts, }) => {
  if (!(featuredBlogPosts && featuredBlogPosts.length)) return (<span />)
  const previewCards = featuredBlogPosts.map(bp => (
    <PreviewCard
      content={bp.preview_card_content}
      externalLink={!!bp.external_link}
      key={bp.id}
      link={bp.external_link || `/${TEACHER_CENTER_SLUG}/${bp.slug}`}
    />
  ))
  return (<div className='dashboard-section-container'>
    <h3 className='dashboard-header'><span>Teacher Center</span><a href="/teacher-center">View all</a></h3>
    <div id="preview-card-container">
      {previewCards}
    </div>
  </div>)
}

export default TeacherCenter
