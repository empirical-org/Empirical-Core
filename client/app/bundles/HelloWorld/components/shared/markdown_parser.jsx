import React from 'react';
import ReactMarkdown from 'react-markdown';

function LinkRenderer(props) {
  return <a href={props.href} style={{ color: '#027360', }} target="_blank">{props.children}</a>;
}

export default class extends React.Component {

  render() {
    return (
      <ReactMarkdown
        className={`markdown-text ${this.props.className}`}
        source={this.props.markdownText}
        renderers={{ Link: LinkRenderer, }}
      />
  	);
  }
}
