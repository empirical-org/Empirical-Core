import * as React from 'react';
import pluralize from 'pluralize'

import PreviewCard from '../shared/preview_card.jsx';
import {
  STUDENT,
  STUDENT_CENTER_SLUG,
  TEACHER_CENTER_SLUG,
  GETTING_STARTED,
  WHATS_NEW,
  TEACHER_STORIES,
  WRITING_INSTRUCTION_RESEARCH,
  IN_THE_NEWS,
  USING_QUILL_FOR_READING_COMPREHENSION
} from './blog_post_constants'

export default class TopicSection extends React.Component {
  displayTitle() {
    const { role, title, } = this.props
    if (role !== STUDENT && title === USING_QUILL_FOR_READING_COMPREHENSION) {
      return title.replace('quill', 'Quill')
    } else if(role !== STUDENT) {
      return title
    }
    const titleWithoutWordStudent = this.props.title.replace('Student ', '')
    return titleWithoutWordStudent.charAt(0).toUpperCase() + titleWithoutWordStudent.slice(1)
  }

  sectionLink() {
    return this.props.role === STUDENT ? STUDENT_CENTER_SLUG : TEACHER_CENTER_SLUG
  }

  topicIcon() {
    switch (this.props.title) {
      case GETTING_STARTED:
        return <img alt="" src="https://assets.quill.org/images/teacher_center/gettingstarted-gray.svg" />
      case WHATS_NEW:
        return <img alt="" src="https://assets.quill.org/images/teacher_center/announcement-gray.svg" />
      case TEACHER_STORIES:
        return <img alt="" src="https://assets.quill.org/images/teacher_center/casestudies-gray.svg" />
      case WRITING_INSTRUCTION_RESEARCH:
        return <img alt="" src="https://assets.quill.org/images/teacher_center/research-gray.svg" />
      case IN_THE_NEWS:
        return <img alt="" src="https://assets.quill.org/images/teacher_center/inthepress-gray.svg" />
      default:
        return ''
    }
  }

  renderArticleCards() {
    return this.props.articles.slice(0, 3).map(article =>
      (<PreviewCard
        content={article.preview_card_content}
        externalLink={!!article.external_link}
        link={article.external_link ? article.external_link : `/${this.sectionLink()}/${article.slug}`}
      />)
    )
  }

  render() {
    return (
      <section>
        <div className='meta'>
          <h1>{this.topicIcon()}{this.displayTitle()}</h1>
          <h2>{this.props.articleCount} {pluralize('article', this.props.articleCount)}</h2>
          <a href={`/${this.sectionLink()}/topic/${this.props.slug}`}>Show All</a>
        </div>
        <div id="preview-card-container">
          {this.renderArticleCards()}
        </div>
      </section>
    )
  }
}
