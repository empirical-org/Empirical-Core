import * as React from 'react';
import { connectToolIcon, diagnosticToolIcon, grammarToolIcon, lessonsToolIcon, proofreaderToolIcon, evidenceToolIcon } from "../../Shared";

export const getIconForActivityClassification = (activityClassificationId: number) => {
  let imgAlt: string = '';
  let imgSrc: string = '';
  switch(Number(activityClassificationId)) {
    case 5:
      imgAlt = connectToolIcon.alt;
      imgSrc = connectToolIcon.src;
      break;
    case 4:
      imgAlt = diagnosticToolIcon.alt;
      imgSrc = diagnosticToolIcon.src;
      break;
    case 2:
      imgAlt = grammarToolIcon.alt;
      imgSrc = grammarToolIcon.src;
      break;
    case 6:
      imgAlt = lessonsToolIcon.alt;
      imgSrc = lessonsToolIcon.src;
      break;
    case 1:
      imgAlt = proofreaderToolIcon.alt;
      imgSrc = proofreaderToolIcon.src;
      break;
    case 9:
      imgAlt = evidenceToolIcon.alt;
      imgSrc = evidenceToolIcon.src;
      break;
  }

  return <img alt={imgAlt} src={imgSrc} />;
}
