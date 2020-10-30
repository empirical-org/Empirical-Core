import * as React from 'react';
import stripHtml from "string-strip-html";

interface PromptProps {
  style: object;
  elements: {
    props: {
      children: string;
      style: object;
    }
   }[];
}

const formattedElement = ({ string, style, element }) => {
  if(string.startsWith('<em>')) {
    return <em style={style}>{stripHtml(string)}</em>;
  } else if(string.startsWith('<strong>')) {
    return <strong style={style}>{stripHtml(string)}</strong>;
  } else if(string.startsWith('<u>')) {
    return <u style={style}>{stripHtml(string)}</u>;
  }
  return element;
}

const Prompt = (props: PromptProps) => {
  const { elements, style } = props;
  const filteredElements = elements && elements.map(element => {
    const { props } = element;
    const { children, style } = props;
    if(typeof children !== 'string') {
      return element;
    }
    return formattedElement({ string: children, style, element });
  });
  return(
    <div style={style} >
      {filteredElements}
    </div>
  );
}

export { Prompt }
