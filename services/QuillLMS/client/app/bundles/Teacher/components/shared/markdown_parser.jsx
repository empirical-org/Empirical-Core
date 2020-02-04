import React from 'react';
import ReactMarkdown from 'react-markdown';

const LinkRenderer = ({ href, children, }) => {
  return <a href={href} rel="noopener noreferrer" style={{ color: '#027360', }} target="_blank">{children}</a>;
}

const MarkdownParser = ({ className, markdownText}) => (
  <ReactMarkdown
    className={`markdown-text ${className}`}
    renderers={{ Link: LinkRenderer, }}
    source={markdownText}
  />
)

export default MarkdownParser
