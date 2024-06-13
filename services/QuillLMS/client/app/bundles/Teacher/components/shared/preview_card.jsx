import React from 'react';
import ReactMarkdown from 'react-markdown';

const PreviewCard = (props) =>(
  <a className={`preview-card-link ${props.color ? props.color : 'green'}`} href={props.link} rel="noopener noreferrer" target={props.externalLink ? "_blank" : "_self"}>
    <ReactMarkdown className="preview-card" source={props.content} />
    <span className="quill-button-archived fun contained primary focus-on-light">Read</span>
  </a>
)


export default PreviewCard
