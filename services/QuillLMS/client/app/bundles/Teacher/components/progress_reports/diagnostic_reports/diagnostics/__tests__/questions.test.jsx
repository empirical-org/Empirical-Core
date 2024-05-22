import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
  dummyLocationData,
  dummyMatchData,
  passedQuestionsWithNoStudentData,
  passedQuestionsWithStudentData,
  passedSkillGroupSummariesWithStudentDataForQuestionsPage,
  passedSkillGroupSummariesWithNoStudentDataForQuestionsPage,
} from './test_data'

import { Questions, } from '../questions'

describe('Questions component', () => {
  it('should render when there is no student data', () => {
    const { asFragment, } = render(<Questions
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedQuestions={passedQuestionsWithNoStudentData}
      passedSkillGroupSummaries={passedSkillGroupSummariesWithNoStudentDataForQuestionsPage}
    />)
    expect(asFragment()).toMatchSnapshot()
  })

  it('should render when there is student data', () => {
    const { asFragment, } = render(<Questions
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedQuestions={passedQuestionsWithStudentData}
      passedSkillGroupSummaries={passedSkillGroupSummariesWithStudentDataForQuestionsPage}
    />)
    expect(asFragment()).toMatchSnapshot()
  })
})
