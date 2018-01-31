import React from 'react';
import pluralize from 'pluralize'
import PreviewCard from '../shared/preview_card.jsx';

export default class extends React.Component {
  renderArticleCards() {
    return this.props.articles.slice(0, 3).map(article =>
      <PreviewCard content={article.preview_card_content} />
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
