import React from 'react';
import pluralize from 'pluralize'
import ArticleCard from './article_card.jsx';

export default class extends React.Component {
  renderArticleCards() {
    return this.props.articles.slice(0, 3).map(article =>
      <ArticleCard
        key={article.title}
        title={article.title}
        description={article.description}
        image={article.image}
        author={article.author}
      />
    )
  }

  render() {
    return (
      <section>
        <div className='meta'>
          <h1>{this.props.title}</h1>
          <h2>{this.props.articleCount} {pluralize('article', this.props.articleCount)}</h2>
          <a onClick={() => {alert('todo')}}>Show All</a>
        </div>
        <div id="article-container">
          {this.renderArticleCards()}
        </div>
      </section>
    )
  }
}
