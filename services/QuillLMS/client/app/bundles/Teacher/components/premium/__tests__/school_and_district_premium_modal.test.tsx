import { mount } from 'enzyme';
import * as React from 'react';

import SchoolAndDistrictPremiumModal from '../school_and_district_premium_modal';

const starterProps = {
  "eligibleSchools": [
    {
      "id": 101608,
      "name": "Santa Fe High School",
    }
  ],
  "customerEmail": "emilia+usertesting@quill.org",
  "stripeSchoolPlan": {
    "plan": {
      "display_name": "School Premium",
      "price_in_dollars": 1800,
      "stripe_price_id": "price_1Kda6ZBuKMgoObiu0cd4WQZw"
    }
  },
  "userIsSignedIn": true
}

describe('SchoolAndDistrictPremiumModal component', () => {

  it('should render stage one when the user is signed in', () => {
    const wrapper = mount(<SchoolAndDistrictPremiumModal {...starterProps} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render stage one when the user is not signed in', () => {
    const wrapper = mount(<SchoolAndDistrictPremiumModal {...starterProps} userIsSignedIn={false} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render stage one when the user is signed in', () => {
    const wrapper = mount(<SchoolAndDistrictPremiumModal {...starterProps} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render stage two when the user has no associated schools', () => {
    const wrapper = mount(<SchoolAndDistrictPremiumModal {...starterProps} eligibleSchools={[]} startAtStageTwo={true} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render stage two when the user has more than one associated school', () => {
    const eligibleSchools = starterProps.eligibleSchools.concat([{id: 1, name: 'Additional School'}])
    const wrapper = mount(<SchoolAndDistrictPremiumModal {...starterProps} eligibleSchools={eligibleSchools} startAtStageTwo={true} />);
    expect(wrapper).toMatchSnapshot()
  });

});
