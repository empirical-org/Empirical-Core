import React from 'react';
import ReactMarkdown from 'react-markdown';

const PreviewCard = (props) => {
  const color = props.color || 'green'

  return (
    <a className={`preview-card-link ${color}`} href={props.link} rel="noopener noreferrer" target={props.externalLink ? "_blank" : "_self"}>
      <ReactMarkdown className="preview-card" source={props.content} />
      <span className={`quill-button small contained focus-on-light ${color}`}>Read</span>
    </a>
  )
}


export default PreviewCard
