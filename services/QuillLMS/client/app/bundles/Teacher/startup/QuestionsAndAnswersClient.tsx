import React from 'react';
import QuestionsAndAnswers from '../containers/QuestionsAndAnswers';
import { QuestionsAndAnswersProps } from '../containers/QuestionsAndAnswers';

const QuestionsAndAnswersSection = (props: QuestionsAndAnswersProps) => (
  <QuestionsAndAnswers {...props} />
);

export default QuestionsAndAnswersSection;
