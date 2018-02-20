import React from 'react';
import ReactMarkdown from 'react-markdown';

export default class extends React.Component {
  render() {
    return (
      <a href={this.props.link}>
        <ReactMarkdown source={this.props.content} className='preview-card' />
      </a>
    )
  }
}
