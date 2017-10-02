import React from 'react';
import { shallow } from 'enzyme';

import ResultsPage from '../ResultsPage.jsx';

import ResultsIcon from '../../components/activities/results_page/results_icon.jsx'
import StudentResultsTables from '../../components/activities/results_page/student_results_tables.jsx'

describe('ResultsPage container', () => {

  const wrapperNotAnonymous = shallow(
    <ResultsPage
      activityName='Cool Activity'
      percentage={94}
      activityType='type'
      results={{foo: 'bar'}}
    />
  );

  const wrapperAnonymous = shallow(<ResultsPage anonymous={true} />);

  it('should render ResultsIcon component with correct percentage and activity type', () => {
    expect(wrapperNotAnonymous.find(ResultsIcon).exists()).toBe(true);
    expect(wrapperNotAnonymous.find(ResultsIcon).props().percentage).toBe(94);
    expect(wrapperNotAnonymous.find(ResultsIcon).props().activityType).toBe('type');
  });

  it('should render a header message with the correct activity name', () => {
    expect(wrapperNotAnonymous.find('h3').text()).toMatch('You completed the activity: Cool Activity');
  });

  it('should render a sign up button if the session is anonymous', () => {
    expect(wrapperAnonymous.find('a').props().href).toBe('/account/new');
    expect(wrapperAnonymous.find('a').text()).toMatch('Sign Up');
  });

  it('should render a back to dashboard button if session is not anonymous', () => {
    expect(wrapperNotAnonymous.find('a').props().href).toBe('/profile');
    expect(wrapperNotAnonymous.find('a').text()).toMatch('Back to Your Dashboard');
  });

  it('should render StudentResultsTables component with correct results', () => {
    expect(wrapperNotAnonymous.find(StudentResultsTables).exists()).toBe(true);
    expect(wrapperNotAnonymous.find(StudentResultsTables).props().results.foo).toBe('bar');
  });

});
