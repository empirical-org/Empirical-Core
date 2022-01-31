import React from 'react';
import ReactMarkdown from 'react-markdown';

const PreviewCard = (props) =>(
  <a className='preview-card-link' href={props.link} target={props.externalLink ? "_blank" : "_self"}>
    <ReactMarkdown className="preview-card" source={props.content} />
  </a>
)


export default PreviewCard
