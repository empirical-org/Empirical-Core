import { mount } from 'enzyme';
import React from 'react';

import ResultsPage from '../ResultsPage.jsx';

import ResultsIcon from '../../components/activities/results_page/results_icon.jsx';

describe('ResultsPage container', () => {

  const integrationPartnerName = 'Integration Partner'
  const integrationPartnerSessionId = 'blahblah'

  const resultCategoryNames = {
    NEARLY_PROFICIENT: 'Nearly proficient',
    NOT_YET_PROFICIENT: 'Not yet proficient',
    PROFICIENT: 'Proficient'
  }

  const sharedProps = {
    activityName: 'Cool Activity',
    activityType: 'type',
    percentage: 0.76,
    resultCategoryNames,
    results: {
      'Nearly proficient': ['Parallel Structure'],
      'Not yet proficient': ['Punctuation'],
      'Proficient': ['Regular Past Participles', 'Commas in Lists', 'Capitalize Geographic Names']
    }
  }

  const wrapperNotAnonymous = mount(<ResultsPage {...sharedProps} />);

  const wrapperAnonymous = mount(<ResultsPage {...sharedProps} anonymous={true} />);

  const wrapperIntegration = mount(<ResultsPage {...sharedProps} integrationPartnerName={integrationPartnerName} integrationPartnerSessionId={integrationPartnerSessionId} />);

  describe('not anonymous', () => {
    it('should render', () => {
      expect(wrapperNotAnonymous).toMatchSnapshot()
    })

    it('should render ResultsIcon component with correct percentage and activity type', () => {
      expect(wrapperNotAnonymous.find(ResultsIcon).exists()).toBe(true);
      expect(wrapperNotAnonymous.find(ResultsIcon).props().percentage).toBe(0.76);
      expect(wrapperNotAnonymous.find(ResultsIcon).props().activityType).toBe('type');
    });

    it('should render a header message with the correct activity name', () => {
      expect(wrapperNotAnonymous.find('h2').first().text()).toMatch('Results for Cool Activity');
    });

    it('should render a back to dashboard button if session is not anonymous', () => {
      expect(wrapperNotAnonymous.find('a.primary.contained').props().href).toBe('/');
      expect(wrapperNotAnonymous.find('a.primary.contained').text()).toMatch('Back to your dashboard');
    });

    it('should render a replayButtonSection if the percentage is less than 0.8', () => {
      expect(wrapperNotAnonymous.find('.replay-button-container').length).toBe(1)
    })

    it('should not render a replayButtonSection if the percentage is equal to or greater than 0.8', () => {
      const proficientWrapper = mount(<ResultsPage {...sharedProps} percentage={0.8} />);
      expect(proficientWrapper.find('.replay-button-container').length).toBe(0)
    })
  })

  describe('anonymous', () => {
    it('should render', () => {
      expect(wrapperAnonymous).toMatchSnapshot()
    })

    it('should render a sign up button if the session is anonymous', () => {
      expect(wrapperAnonymous.find('a.primary.contained').props().href).toBe('/account/new');
      expect(wrapperAnonymous.find('a.primary.contained').text()).toMatch('Sign up');
    });

    it('should not render a replayButtonSection', () => {
      expect(wrapperAnonymous.find('.replay-button-container').length).toBe(0)
    })

  })

  describe('integration', () => {
    it('should render', () => {
      expect(wrapperIntegration).toMatchSnapshot()
    })

    it('should render a back to dashboard button if session is not anonymous', () => {
      expect(wrapperIntegration.find('a.primary.contained').props().href).toBe(`/${integrationPartnerName}?session_id=${integrationPartnerSessionId}`);
      expect(wrapperIntegration.find('a.primary.contained').text()).toMatch('Back to activity list');
    });

    it('should not render a replayButtonSection', () => {
      expect(wrapperIntegration.find('.replay-button-container').length).toBe(0)
    })
  })
});
