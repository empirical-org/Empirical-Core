import React from 'react';
import PreviewCard from '../components/shared/preview_card.jsx';
import HeaderSection from '../components/blog_posts/header_section'

export default (props) => {
  const articles = props.blogPosts.length > 0 ? props.blogPosts.map(article =>
    <PreviewCard
      key={article.title}
      content={article.preview_card_content}
      link={article.external_link ? article.external_link : `/teacher-center/${article.slug}`}
      externalLink={!!article.external_link}
    />
  ) : null
  const content = articles ? <div id="preview-card-container">{articles}</div>
  : <div style={{fontSize: '30px', display: 'flex', justifyContent: 'center', height: '60vh', alignItems: 'center', flexDirection: 'column', fontWeight: 'bold'}}>
        Coming Soon!
        <img style={{marginTop: '20px'}} src="https://assets.quill.org/images/illustrations/empty-state-premium-reports.svg"/>
      </div>
    return <div className="announcements-page">
      <HeaderSection title="Announcements" subtitle="See what's new with Quill"/>
      {content}
    </div>
}
