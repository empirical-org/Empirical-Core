import React from 'react';

export default class extends React.Component {
  render() {
    return (
      <div className='article-card'>
        <img className='article-card-image' src={this.props.image} />
        <div className='article-card-body'>
          <h3>{this.props.title}</h3>
          <div className='ellipsis-hack-container'>
            <p>{this.props.description}</p>
            <p>&hellip;</p>
          </div>
          <p className='author'>by {this.props.author}</p>
        </div>
      </div>
    )
  }
}
