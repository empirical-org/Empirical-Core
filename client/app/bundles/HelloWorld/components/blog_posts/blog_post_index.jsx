import React from 'react';
import TopicSection from './topic_section.jsx';
import PreviewCard from '../shared/preview_card.jsx';
import _ from 'underscore';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleFilter: 'all',
      loading: true,
      blogPostsSortedByMostRead: [...this.props.blogPosts].sort((a, b) => (a.read_count < b.read_count) ? 1 : ((b.read_count < a.read_count) ? -1 : 0))
    };
  }

  filterArticlesBy(filter) {
    this.setState({ articleFilter: filter });
  }

  renderPreviewCards() {
    return this.props.blogPosts.map(article =>
      <PreviewCard key={article.title} content={article.preview_card_content} link={article.external_link ? article.external_link : `/teacher_resources/${article.slug}`} />
    )
  }

  renderPreviewCardsByPopularity() {
    return this.state.blogPostsSortedByMostRead.map(article =>
      <PreviewCard key={article.title} content={article.preview_card_content} link={article.external_link ? article.external_link : `/teacher_resources/${article.slug}`} />
    )
  }

  renderPreviewCardsByTopic() {
    let sections = [];
    const articlesByTopic = _.groupBy(this.props.blogPosts, "topic");
    for(let topic in articlesByTopic) {
      var articlesInThisTopic = articlesByTopic[topic];
      sections.push(<TopicSection
          key={topic}
          title={topic}
          articles={articlesInThisTopic.sort(a => a.order_number)}
          articleCount={articlesInThisTopic.length}
        />
      );
    }
    return sections;
  }

  renderBasedOnArticleFilter() {
    let response;
    if(this.props.blogPosts.length === 0) {
      response = <h1 className='no-results'>No results found.</h1>
    } else if(this.state.articleFilter === 'topic') {
      response = this.renderPreviewCardsByTopic();
    } else if(this.state.articleFilter === 'popularity') {
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
    const currentPageIsTopicPage = window.location.pathname.includes('topic');
    const currentPageIsSearchPage = window.location.pathname.includes('search');
    if(!currentPageIsTopicPage && !currentPageIsSearchPage) {
      return (
        <nav>
          <ul>
            <li className={this.state.articleFilter === 'all' ? 'active' : null} onClick={() => this.filterArticlesBy('all')}>All Articles</li>
            <li className={this.state.articleFilter === 'topic' ? 'active' : null} onClick={() => this.filterArticlesBy('topic')}>Topics</li>
            <li className={this.state.articleFilter === 'popularity' ? 'active' : null} onClick={() => this.filterArticlesBy('popularity')}>Most Read</li>
          </ul>
        </nav>
      )
    } else if(currentPageIsTopicPage) {
      return (
        <div className='topic-header'>
          <a href='/teacher_resources'><i className='fa fa-chevron-left' />Back to All Topics</a>
          <h2>{window.location.pathname.split('/')[3].split('_').map(topic => topic.charAt(0).toUpperCase() + topic.slice(1)).join(' ')}</h2>
        </div>
      )
    } else if(currentPageIsSearchPage) {
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
    if(window.location.pathname.includes('search')) { return null; }
    const link = mostReadArticle.external_link ? mostReadArticle.external_link : `/teacher_resources/${mostReadArticle.slug}`
    return (
      <h3>
        <a href={link}>{mostReadArticle.title}</a>
      </h3>
    )
  }

  render() {
    if (this.props.blogPosts.length === 0) {
      return <div className="container">
        <div style={{fontSize: '40px', display: 'flex', justifyContent: 'center', height: '60vh', alignItems: 'center', flexDirection: 'column', fontWeight: 'bold'}}>
          Coming Soon!
          <img style={{marginTop: '20px'}} src="https://assets.quill.org/images/illustrations/empty-state-premium-reports.svg"/>
        </div>
      </div>
    } else {
      return (
        <div id="knowledge-center">
          <header>
            <div className='container'>
              <h1>Knowledge Center</h1>
              <h2>Everything you need to know about Quill's pedgagogy and use in the classroom</h2>
              <form className='width-422' action={`${process.env.DEFAULT_URL}/teacher_resources/search`}>
              <input type='text' placeholder='Search for posts' name='query' defaultValue={this.props.query ? this.props.query : null} />
              {window.location.pathname.includes('search') ? null : <h3 className='most-read-post'>Most Read Post:</h3>}
              {this.renderMostReadPost()}
            </form>
          </div>
        </header>
        {this.renderNavAndSectionHeader()}
        {this.renderAnnouncement()}
        {this.renderBasedOnArticleFilter()}
      </div>
    )};
  }
}
