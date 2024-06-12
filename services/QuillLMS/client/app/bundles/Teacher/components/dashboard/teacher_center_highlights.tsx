import * as React from 'react'

import { TEACHER_CENTER_SLUG } from '../blog_posts/blog_post_constants'

const Highlight = ({ blogPost, }) => {
  const link = blogPost.external_link || `/${TEACHER_CENTER_SLUG}/${blogPost.slug}`
  return (
    <a className="highlight focus-on-light" href={link} rel="noopener noreferrer" target="_blank">
      <h3>{blogPost.title}</h3>
      <span>{blogPost.topic}</span>
    </a>
  )
}

const TeacherCenterHighlights = ({ featuredBlogPosts, }) => {
  return (
    <section className="teacher-center-highlights">
      <h2>Teacher Center Highlights</h2>
      {featuredBlogPosts.map(bp => <Highlight blogPost={bp} key={bp.id} />)}
      <div className="see-all-resources-container">
        <a className="quill-button focus-on-light outlined extra-small grey" href={`/${TEACHER_CENTER_SLUG}`} rel="noopener noreferrer" target="_blank">See all resources</a>
      </div>
    </section>
  )
}

export default TeacherCenterHighlights
