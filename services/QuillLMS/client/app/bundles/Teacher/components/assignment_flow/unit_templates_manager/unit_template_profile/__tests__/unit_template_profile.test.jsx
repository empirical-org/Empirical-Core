import React from 'react';
import { shallow } from 'enzyme';
import $ from 'jquery'

import response from '../../../../../../../test_data/unit_template_profile'
import { UnitTemplateProfile } from '../unit_template_profile.tsx'
import LoadingIndicator from '../../../../shared/loading_indicator'
import UnitTemplateProfileDescription from '../unit_template_profile_description'
import UnitTemplateProfileShareButtons from '../unit_template_profile_share_buttons';

const props = {
  history: {
    length: 50,
    action: "POP",
    location: {
      pathname: "/assign/featured-activity-packs/34",
      search: "",
      hash: ""
    }
  },
  location: {
    pathname: "/assign/featured-activity-packs/34",
    search: "",
    hash: ""
  },
  match: {
    path: "/assign/featured-activity-packs/:activityPackId",
    url: "/assign/featured-activity-packs/34",
    isExact: true,
    params: {
      activityPackId: "34"
    }
  }
}

describe('UnitTemplateProfile component', () => {

  describe('the loading indicator', () => {
    it('should render a loading indicator by default', () => {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
    });

    it('should render a loading indicator if the state is loading', () => {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      wrapper.setState({ loading: true });
      expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
    });

    it('should not render a loading indicator if the state is not loading', () => {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      wrapper.setState({ loading: false, data: {non_authenticated: false}});
      expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
    });
  })

  describe('when the state is not loading', () => {
    it('should render UnitTemplateDescription', ()=> {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      wrapper.setState({ loading: false, data: {non_authenticated: false}});
      expect(wrapper.find(UnitTemplateProfileDescription)).toHaveLength(1);
    })
    it('should render UnitTemplateProfileShareButtons if flag is not private', ()=> {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      wrapper.setState({ loading: false, data: {flag: "production"}});
      expect(wrapper.find(UnitTemplateProfileShareButtons)).toHaveLength(1);
    })
    it('should not render UnitTemplateProfileShareButtons if flag is private', ()=> {
      const wrapper = shallow(
        <UnitTemplateProfile {...props} />
      );
      wrapper.setState({ loading: false, data: {flag: "private"}});
      expect(wrapper.find(UnitTemplateProfileShareButtons)).toHaveLength(0);
    })
  })

  describe('displayUnit', () => {

    const wrapper = shallow(
      <UnitTemplateProfile {...props} />
    );
    wrapper.instance().displayUnit(response)
    it('should set state.loading to be false', () => {
      expect(wrapper.state('loading')).toBe(false)
    })
    it('should set state.data to be response.data', () => {
      expect(wrapper.state('data')).toEqual(response.data)
    })

  })
});
