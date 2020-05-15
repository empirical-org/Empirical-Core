import * as React from "react";
import { promptStems } from '../constants/comprehension';
const quillCheckmark = `${process.env.QUILL_CDN_URL}/images/icons/check-circle-small.svg`;

export const getPromptsIcons = (prompts) => {
  const icons = {};
  prompts.forEach(prompt => {
    const { conjunction } = prompt;
    if(promptStems.includes(conjunction)) {
      icons[conjunction] = (<img alt="quill-circle-checkmark" src={quillCheckmark} />)
    } else {
      icons[conjunction] = (<div />);
    }
  });
  return icons;
}
