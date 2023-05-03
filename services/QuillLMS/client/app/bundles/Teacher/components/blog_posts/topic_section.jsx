import pluralize from 'pluralize';
import * as React from 'react';

import {
  STUDENT,
  STUDENT_CENTER_SLUG,
  TEACHER_CENTER_SLUG
} from './blog_post_constants';

import PreviewCard from '../shared/preview_card.jsx';

export default class TopicSection extends React.Component {
  displayTitle() {
    const { role, title, } = this.props
    if(role !== STUDENT) {
      return title
    }
    const titleWithoutWordStudent = title.replace('Student ', '')
    return titleWithoutWordStudent.charAt(0).toUpperCase() + titleWithoutWordStudent.slice(1)
  }

  sectionLink() {
    const { role, } = this.props
    return role === STUDENT ? STUDENT_CENTER_SLUG : TEACHER_CENTER_SLUG
  }

  renderArticleCards() {
    const { articles, color, onSearchPage, } = this.props
    const articlesForDisplay = onSearchPage ? articles : articles.slice(0, 3)
    return articlesForDisplay.map(article =>
      (<PreviewCard
        color={color}
        content={article.preview_card_content}
        externalLink={!!article.external_link}
        key={article.id}
        link={article.external_link ? article.external_link : `/${this.sectionLink()}/${article.slug}`}
      />)
    )
  }

  render() {
    const { color, articleCount, slug, onSearchPage, } = this.props
    return (
      <section className={`topic-section ${color}`}>
        <div className='meta'>
          <h1>{this.displayTitle()}</h1>
          <div>
            <h2>{articleCount} {pluralize('article', articleCount)}</h2>
            {!onSearchPage && <a className="quill-button focus-on-light fun contained primary" href={`/${this.sectionLink()}/topic/${slug}`}>Show all</a>}
          </div>
        </div>
        <div id="preview-card-container">
          {this.renderArticleCards()}
        </div>
      </section>
    )
  }
}
