import React from 'react';
import pluralize from 'pluralize'
import PreviewCard from '../shared/preview_card.jsx';

export default class TopicSection extends React.Component {
  displayTitle() {
    const { role, title, } = this.props
    if (role !== 'student') { return title }
    const titleWithoutWordStudent = this.props.title.replace('Student ', '')
    return titleWithoutWordStudent.charAt(0).toUpperCase() + titleWithoutWordStudent.slice(1)
  }

  sectionLink() {
    return this.props.role === 'student' ? 'student-center' : 'teacher-center'
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

  topicIcon() {
    switch (this.props.title) {
      case 'Getting started':
        return <img src="https://assets.quill.org/images/teacher_center/gettingstarted-gray.svg" />
      case "What's new?":
        return <img src="https://assets.quill.org/images/teacher_center/announcement-gray.svg" />
      case 'Teacher stories':
        return <img src="https://assets.quill.org/images/teacher_center/casestudies-gray.svg" />
      case 'Writing instruction research':
        return <img src="https://assets.quill.org/images/teacher_center/research-gray.svg" />
      case 'In the news':
        return <img src="https://assets.quill.org/images/teacher_center/inthepress-gray.svg" />
      default:
        return ''
    }
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
