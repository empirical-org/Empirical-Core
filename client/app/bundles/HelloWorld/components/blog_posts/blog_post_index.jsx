import React from 'react';
import ArticleCard from './article_card.jsx';
import TopicSection from './topic_section.jsx';
import _ from 'underscore';

// todo: replace this with this.props.blogPost
const articles = [
  {
    title: 'How I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Golden Retriever',
    topic: 'dogs'
  },
  {
    title: '3455How I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Golden Retriever',
    topic: 'dogs'
  },
  {
    title: '34634How I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Golden Retriever',
    topic: 'dogs'
  },
  {
    title: '43534How I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Golden Retriever',
    topic: 'dogs'
  },
  {
    title: 'bHow I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Meow Meow',
    topic: 'cats'
  },
  {
    title: 'cHow I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Tabby Kitty',
    topic: 'cats'
  },
  {
    title: 'dHow I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Golden Retriever',
    topic: 'dogs'
  },
  {
    title: 'oink How I taught Quill Lessons to my 5th grade class',
    description: 'You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to. You can now add co-teachers to your classes. Co-teachers can manage classes Every time students take a writing exercise on Quill.org–a writing instruction platformYou can now add co-teachers to.',
    image: 'http://via.placeholder.com/500x200',
    author: 'Wilbur & Hamlet',
    topic: 'pigs'
  },
]


export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleFilter: 'all',
      loading: true
    };
  }

  filterArticlesBy(filter) {
    this.setState({ articleFilter: filter });
  }

  renderArticleCards() {
    // todo use spread operator
    return articles.map(article =>
      <ArticleCard
        key={article.title}
        title={article.title}
        description={article.description}
        image={article.image}
        author={article.author}
      />
    )
  }

  renderArticleCardsByTopic() {
    let sections = [];
    const articlesByTopic = _.groupBy(articles, "topic");
    for(let topic in articlesByTopic) {
      var articlesInThisTopic = articlesByTopic[topic];
      sections.push(<TopicSection
          key={topic}
          title={topic}
          articles={articlesInThisTopic}
          articleCount={articlesInThisTopic.length}
        />
      );
    }
    return sections;
  }

  renderBasedOnArticleFilter() {
    let response;
    if(this.state.articleFilter === 'topic') {
      response = this.renderArticleCardsByTopic();
    } else if(this.state.articleFilter === 'popularity') {
      response = <h1>most read</h1>
    } else {
      response = (
        <div id="article-container">
          {this.renderArticleCards()}
        </div>
      )
    }
    return <main>{response}</main>
  }

  render() {
    return (
      <div id="knowledge-center">
        <header>
          <div className='container'>
            <h1>Knowledge Center</h1>
            <h2>Everything you need to know about Quill's pedgagogy and use in the classroom</h2>
            <div className='width-422'>
              <input type="text" placeholder="Search for posts" />
              <h3 className='most-read-post'>Most Read Post:</h3>
              <h3><a href="#">TODO: put the actual post here</a></h3>
            </div>
          </div>
        </header>
        <nav>
          <ul>
            <li className={this.state.articleFilter === 'all' ? 'active' : null} onClick={() => this.filterArticlesBy('all')}>All Articles</li>
            <li className={this.state.articleFilter === 'topic' ? 'active' : null} onClick={() => this.filterArticlesBy('topic')}>Topics</li>
            <li className={this.state.articleFilter === 'popularity' ? 'active' : null} onClick={() => this.filterArticlesBy('popularity')}>Most Read</li>
          </ul>
        </nav>
        {this.renderBasedOnArticleFilter()}
      </div>
    );
  }
}
