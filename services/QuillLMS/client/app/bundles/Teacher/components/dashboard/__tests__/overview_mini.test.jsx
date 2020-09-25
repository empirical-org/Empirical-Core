import React from 'react';
import { shallow } from 'enzyme';

import OverviewMini from '../overview_mini';
import LoadingIndicator from '../../shared/loading_indicator';

describe('OverviewMini component', () => {

  it('should show keys with results', () => {
    const wrapper = shallow(
      <OverviewMini overviewObj={{
        header: 'I am a header',
        results: [
          {name: 'Cool Activity', score: 50},
          {name: 'Another Activity', score: 97}
        ]
      }}
      />
    );
    expect(wrapper.find('td').at(0).text()).toMatch('Cool Activity');
    expect(wrapper.find('td').at(1).text()).toMatch('50%');
    expect(wrapper.find('td').at(2).text()).toMatch('Another Activity');
    expect(wrapper.find('td').at(3).text()).toMatch('97%');
  });

  it('button should show appropriate message and link', () => {
    const wrapperStudent = shallow(
      <OverviewMini overviewObj={{
        results: {},
        header: 'This text includes the word student.'
      }}
      />
    );
    expect(wrapperStudent.find('button').text()).toBe('View All Student Results');
    expect(wrapperStudent.find('a').prop('href')).toBe('/teachers/progress_reports/concepts/students');

    const wrapperConcept = shallow(
      <OverviewMini overviewObj={{
        results: {},
        header: 'This text includes the word concept.'
      }}
      />
    );
    expect(wrapperConcept.find('button').text()).toBe('View All Concept Results');
    expect(wrapperConcept.find('a').prop('href')).toBe('/teachers/progress_reports/concepts/students');
  });

  it('should render header text', () => {
    const wrapper = shallow(
      <OverviewMini overviewObj={{header: 'I am Groot', results: 'some stuff here'}} />
    );
    expect(wrapper.find('h4').text()).toBe('I am Groot');
  });

});
