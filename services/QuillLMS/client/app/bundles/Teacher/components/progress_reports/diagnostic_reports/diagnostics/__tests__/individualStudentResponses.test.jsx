import * as React from 'react';
import { render, screen } from '@testing-library/react';

import {
  dummyLocationData,
  dummyMatchData,
  individualStudentPostTestConceptResults,
  individualStudentPostTestSkillGroupResults,
  individualStudentPreTestConceptResults,
  individualStudentPreTestSkillGroupResults
} from './test_data'

import { IndividualStudentResponses, } from '../individualStudentResponses'

describe('IndividualStudentResponses component', () => {
  it('should render for a pre-test', () => {
    const { asFragment, } = render(<IndividualStudentResponses
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedConceptResults={individualStudentPreTestConceptResults}
      passedSkillGroupResults={individualStudentPreTestSkillGroupResults}
    />)
    expect(asFragment()).toMatchSnapshot();
  })

  it('should render for a post-test', () => {
    const { asFragment, } = render(<IndividualStudentResponses
      location={dummyLocationData}
      match={dummyMatchData}
      mobileNavigation={<span />}
      passedConceptResults={individualStudentPostTestConceptResults}
      passedSkillGroupResults={individualStudentPostTestSkillGroupResults}
    />)
    expect(asFragment()).toMatchSnapshot();
  })

})
