import React from 'react';
import ReactMarkdown from 'react-markdown';

const PreviewCard = (props) =>(
    <a className='preview-card-link' target={props.externalLink ? "_blank" : "_self"} href={props.link}>
      <ReactMarkdown source={props.content} className="preview-card" />
    </a>
  )


export default PreviewCard
