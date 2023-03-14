import React from 'react';
import ReactMarkdown from 'react-markdown';

const PreviewCard = (props) =>(
  <a className={`preview-card-link ${props.color ? props.color : 'green'}`} href={props.link} target={props.externalLink ? "_blank" : "_self"}>
    <ReactMarkdown className="preview-card" source={props.content} />
    <a className="quill-button fun contained primary focus-on-light" href={props.link} rel="noopener noreferrer" target={props.externalLink ? "_blank" : "_self"}>Read</a>
  </a>
)


export default PreviewCard
