import * as React from 'react';
import _ from 'underscore';

import TopicSection from './topic_section.jsx';
import HeaderSection from './header_section'
import {
  STUDENT,
  STUDENT_CENTER,
  STUDENT_CENTER_SLUG,
  TEACHER_CENTER ,
  TEACHER_CENTER_SLUG,
  TOPIC,
  ALL,
  SEARCH,
  TEACHER_STORIES,
  GETTING_STARTED,
  WRITING_INSTRUCTION_RESEARCH,
  SUPPORT,
  WEBINARS,
} from './blog_post_constants'

import PreviewCard from '../shared/preview_card.jsx';

export default class BlogPostIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleFilter: window.location.pathname.includes(TOPIC) || props.query ? ALL : TOPIC,
      loading: true,
      blogPostsSortedByMostRead: [...this.props.blogPosts].sort((a, b) => (a.read_count < b.read_count) ? 1 : ((b.read_count < a.read_count) ? -1 : 0))
    };
  }

  filterArticlesBy(filter) {
    this.setState({ articleFilter: filter });
  }

  pageSubtitle() {
    if (this.props.role === STUDENT) {
      return 'Everything you need to know about using Quill'
    }

    switch (this.pageTitle()) {
      case TEACHER_STORIES:
        return 'Read success stories about Quill in the class'
      case GETTING_STARTED:
        return 'Set up your classroom on Quill with guides, videos, and presentations'
      case WRITING_INSTRUCTION_RESEARCH:
        return 'Read and download handpicked materials to teach writing'
      case SUPPORT:
        return 'The most common questions teachers ask about Quill'
      case WEBINARS:
        return 'Join online conferences to learn best practices for how to use Quill with your students'
      case TEACHER_CENTER:
      default:
        return 'Everything you need to know about Quill’s pedagogy and use in the classroom'
    }
  }

  pageTitle() {
    const { role, title, } = this.props
    if (window.location.pathname.includes(TOPIC)) {
      const topicTitle = this.props.title
      return role === STUDENT ? topicTitle.replace('Student ', '') : topicTitle
    } else if (role === STUDENT) {
      return STUDENT_CENTER
    } else {
      return TEACHER_CENTER
    }
  }

  renderAnnouncement() {
    const announcement = this.props.announcement;
    if(announcement) {
      return (
        <a className='announcement' href={announcement.link}>
          <div className='circle' />
          <p>{announcement.text}</p>
          <i className='fas fa-chevron-right' />
        </a>
      )
    }
  }

  renderBasedOnArticleFilter() {
    let response;
    if (this.props.blogPosts.length === 0) {
      response = <h1 className='no-results'>No results found.</h1>
    } else if (this.state.articleFilter === TOPIC) {
      response = this.renderPreviewCardsByTopic();
    } else if (this.state.articleFilter === 'popularity') {
      response = (
        <div id="preview-card-container">
          {this.renderPreviewCardsByPopularity()}
        </div>
      )
    } else {
      response = (
        <div id="preview-card-container">
          {this.renderPreviewCards()}
        </div>
      )
    }
    return <main>{response}</main>
  }

  renderMostReadPost() {
    const mostReadArticle = this.state.blogPostsSortedByMostRead[0];
    if (window.location.pathname.includes(SEARCH)) { return null; }
    const link = mostReadArticle.external_link ? mostReadArticle.external_link : `/teacher-center/${mostReadArticle.slug}`
    return (
      <h3>
        <a href={link}>{mostReadArticle.title}</a>
      </h3>
    )
  }

  renderNavAndSectionHeader() {
    const currentPageIsSearchPage = window.location.pathname.includes(SEARCH);
    if (!currentPageIsSearchPage) {
      return (
        <span />
      )
    // } else if (currentPageIsTopicPage) {
    //   return (
    //     <div className='topic-header'>
    //       <h2>{window.location.pathname.split('/')[3].split('-').map(topic => topic.charAt(0).toUpperCase() + topic.slice(1)).join(' ')}</h2>
    //     </div>
    //   )
    } else {
      return (
        <nav>
          <ul>
            <li>Search Results</li>
          </ul>
        </nav>
      )
    }
  }

  renderPreviewCards() {
    const sectionLink = this.props.role === STUDENT ? STUDENT_CENTER_SLUG : TEACHER_CENTER_SLUG
    return this.props.blogPosts.map(article =>
      (<PreviewCard
        content={article.preview_card_content}
        externalLink={!!article.external_link}
        key={article.title}
        link={article.external_link ? article.external_link : `/${sectionLink}/${article.slug}`}
      />)
    )
  }

  renderPreviewCardsByPopularity() {
    return this.state.blogPostsSortedByMostRead.map(article =>
      (<PreviewCard
        content={article.preview_card_content}
        externalLink={!!article.external_link}
        key={article.title}
        link={article.external_link ? article.external_link : `/${TEACHER_CENTER_SLUG}/${article.slug}`}
      />)
    )
  }


  renderPreviewCardsByTopic() {
    let sections = [];
    const articlesByTopic = _.groupBy(this.props.blogPosts, TOPIC);
    this.props.topics.forEach(topic => {
      const articlesInThisTopic = articlesByTopic[topic.name];
      if (articlesInThisTopic) {
        sections.push(<TopicSection
          articleCount={articlesInThisTopic.length}
          articles={articlesInThisTopic.sort((a, b) => a.order_number - b.order_number)}
          key={topic.name}
          role={this.props.role}
          slug={topic.slug}
          title={topic.name}
        />
      );
      }
    })
    return sections;
  }

  render() {
    if (this.props.blogPosts.length === 0 && !this.props.query) {
      return (<div className="container">
        <div style={{fontSize: '40px', display: 'flex', justifyContent: 'center', height: '60vh', alignItems: 'center', flexDirection: 'column', fontWeight: 'bold'}}>
          Coming Soon!
          <img src="https://assets.quill.org/images/illustrations/empty-state-premium-reports.svg" style={{marginTop: '20px'}} />
        </div>
      </div>)
    } else {
      return (
        <div id="knowledge-center">
          <HeaderSection
            query={this.props.query}
            showCancelSearchButton={!!window.location.href.includes(SEARCH)}
            subtitle={this.pageSubtitle()}
            title={this.pageTitle()}
          />
          {this.renderNavAndSectionHeader()}
          {this.renderAnnouncement()}
          {this.renderBasedOnArticleFilter()}
        </div>
    )};
  }
}
