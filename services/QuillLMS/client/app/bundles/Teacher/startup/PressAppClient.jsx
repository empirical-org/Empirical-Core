import React from 'react';
import HeaderSection from '../components/blog_posts/header_section';
import PreviewCard from '../components/shared/preview_card.jsx';

export default (props) => {
  const articles = props.blogPosts.length > 0 ? props.blogPosts.map(article =>
    (<PreviewCard
      content={article.preview_card_content}
      externalLink={!!article.external_link}
      key={article.title}
      link={article.external_link ? article.external_link : `/teacher_resources/${article.slug}`}
    />)
  ) : null
  const content = articles ? <div id="preview-card-container">{articles}</div>
    : (<div style={{fontSize: '30px', display: 'flex', justifyContent: 'center', height: '60vh', alignItems: 'center', flexDirection: 'column', fontWeight: 'bold'}}>
        Coming Soon!
      <img alt="" src="https://assets.quill.org/images/illustrations/empty-state-premium-reports.svg" style={{marginTop: '20px'}} />
    </div>)
  return (
    <div className="press-page">
      <HeaderSection subtitle="Read articles that feature Quill" title="In the news" />
      {content}
    </div>
  )

}
