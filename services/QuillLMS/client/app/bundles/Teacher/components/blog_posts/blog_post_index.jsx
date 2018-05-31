import React from 'react';
import TopicSection from './topic_section.jsx';
import PreviewCard from '../shared/preview_card.jsx';
import HeaderSection from './header_section'
import _ from 'underscore';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleFilter: window.location.pathname.includes('topic') || props.query ? 'all' : 'topic',
      loading: true,
      blogPostsSortedByMostRead: [...this.props.blogPosts].sort((a, b) => (a.read_count < b.read_count) ? 1 : ((b.read_count < a.read_count) ? -1 : 0))
    };
  }

  filterArticlesBy(filter) {
    this.setState({ articleFilter: filter });
  }

  pageTitle() {
    if (window.location.pathname.includes('topic')) {
      return window.location.pathname.split('/')[3].split('-').map(topic => topic.charAt(0).toUpperCase() + topic.slice(1)).join(' ')
    } else {
      return 'Teacher Center'
    }
  }

  pageSubtitle() {
    switch (this.pageTitle()) {
      case 'Teacher Stories':
        return 'Read success stories about Quill in the class'
      case 'Getting Started':
        return 'Set up your classroom on Quill with guides, videos, and presentations'
      case 'Writing Instruction Research':
        return 'Read and download handpicked materials to teach writing'
      case 'Support':
        return 'The most common questions teachers ask about Quill'
      case 'Webinars':
        return 'Join online conferences to learn best practices for how to use Quill with your students'
      case 'Teacher Center':
      default:
        return 'Everything you need to know about Quill’s pedagogy and use in the classroom'
    }
  }

  renderPreviewCards() {
    return this.props.blogPosts.map(article =>
      <PreviewCard
        key={article.title}
        content={article.preview_card_content}
        link={article.external_link ? article.external_link : `/teacher-center/${article.slug}`}
        externalLink={!!article.external_link}
      />
    )
  }

  renderPreviewCardsByPopularity() {
    return this.state.blogPostsSortedByMostRead.map(article =>
      <PreviewCard
        key={article.title}
        content={article.preview_card_content}
        link={article.external_link ? article.external_link : `/teacher-center/${article.slug}`}
        externalLink={!!article.external_link}
      />
    )
  }

  renderPreviewCardsByTopic() {
    let sections = [];
    const articlesByTopic = _.groupBy(this.props.blogPosts, "topic");
    this.props.topics.forEach(topic => {
      const articlesInThisTopic = articlesByTopic[topic];
      if (articlesInThisTopic) {
        sections.push(<TopicSection
          key={topic}
          title={topic}
          articles={articlesInThisTopic.sort((a, b) => a.order_number - b.order_number)}
          articleCount={articlesInThisTopic.length}
        />
      );
      }
  })
    return sections;
  }

  renderBasedOnArticleFilter() {
    let response;
    if (this.props.blogPosts.length === 0) {
      response = <h1 className='no-results'>No results found.</h1>
    } else if (this.state.articleFilter === 'topic') {
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

  renderAnnouncement() {
    const announcement = this.props.announcement;
    if(announcement) {
      return (
        <a className='announcement' href={announcement.link}>
          <div className='circle'></div>
          <p>{announcement.text}</p>
          <i className='fa fa-chevron-right'></i>
        </a>
      )
    }
  }

  renderNavAndSectionHeader() {
    const currentPageIsSearchPage = window.location.pathname.includes('search');
    if (!currentPageIsSearchPage) {
      return (
        <span/>
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


  renderMostReadPost() {
    const mostReadArticle = this.state.blogPostsSortedByMostRead[0];
    if (window.location.pathname.includes('search')) { return null; }
    const link = mostReadArticle.external_link ? mostReadArticle.external_link : `/teacher-center/${mostReadArticle.slug}`
    return (
      <h3>
        <a href={link}>{mostReadArticle.title}</a>
      </h3>
    )
  }

  render() {
    if (this.props.blogPosts.length === 0 && !this.props.query) {
      return <div className="container">
        <div style={{fontSize: '40px', display: 'flex', justifyContent: 'center', height: '60vh', alignItems: 'center', flexDirection: 'column', fontWeight: 'bold'}}>
          Coming Soon!
          <img style={{marginTop: '20px'}} src="https://assets.quill.org/images/illustrations/empty-state-premium-reports.svg"/>
        </div>
      </div>
    } else {
      return (
        <div id="knowledge-center">
          <HeaderSection
            title={this.pageTitle()}
            subtitle={this.pageSubtitle()}
            query={this.props.query}
            showCancelSearchButton={!!window.location.href.includes('search')}
          />
        {this.renderNavAndSectionHeader()}
        {this.renderAnnouncement()}
        {this.renderBasedOnArticleFilter()}
      </div>
    )};
  }
}
