import { mount } from 'enzyme';
import * as React from 'react';

import ActivitySurvey from '../../../components/activitySlides/activitySurvey';

describe('ActivitySurvey Component', () => {
  const mockProps = { sessionID: '', saveActivitySurveyResponse: () => {}, setSubmittedActivitySurvey: () => {}  }
  let component = mount(<ActivitySurvey {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
