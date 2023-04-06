import * as React from 'react';

interface Element {
  props: {
    children: string;
    style: object;
  }
};

interface PromptProps {
  style: object;
  elements: Element[];
}

const getElementObject = (htmlText: string, style: object) => {
  return {
    text: htmlText,
    style: style
  }
}

const getFormattedElementsArray = (elements: Element[]) => {

  let formattedElements = [];
  let htmlText = '';

  if(!elements) {
    return;
  }
  elements.map((element: Element, i: number) => {
    const { props } = element;
    // children is the html string
    const { children, style } = props;
    const nextElementIsInput = elements[i+1] && typeof elements[i+1].props.children !== 'string';

    if(children && typeof children === 'string' && nextElementIsInput) {
      htmlText += children;
      const elementObject = getElementObject(htmlText, style);
      formattedElements.push(elementObject);
      htmlText = '';
      // empty span element, add for spacing
    } else if(!children && nextElementIsInput) {
      const elementObject = getElementObject(htmlText, style);
      formattedElements.push(elementObject);
      htmlText = '';
      formattedElements.push(<span style={style} />)
    } else if(typeof children !== 'string') {
      formattedElements.push(element);
    } else if(typeof children === 'string' && i === elements.length - 1) {
      htmlText += children;
      const elementObject = getElementObject(htmlText, style);
      formattedElements.push(elementObject);
    } else {
      htmlText += `${children} `;
    }
  });

  return formattedElements.map((element, i) => {
    if(element.text || element.text === '') {
      return <span dangerouslySetInnerHTML={{__html: element.text}} key={i} style={element.style} />
    }
    return element;
  });
}

const Prompt = (props: PromptProps) => {
  const { elements, style } = props;
  const formattedElements = getFormattedElementsArray(elements);

  return (
    <div style={style} >
      {formattedElements}
    </div>
  );
}

export { Prompt };

