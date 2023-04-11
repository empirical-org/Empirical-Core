import { mount } from 'enzyme';
import React from 'react';

import PremiumCreditsTable from '../premium_credits_table';

const sharedProps = {
  earnedCredits: 0,
  premiumCredits: [],
}

describe('PremiumCreditsTable container', () => {

  it('should render when there are no premium credits', () => {
    const wrapper = mount(<PremiumCreditsTable {...sharedProps} />);
    expect(wrapper).toMatchSnapshot()
  });

  it('should render when there are premium credits', () => {
    const premiumCredits = [{"id":1,"amount":28,"user_id":25,"source_id":2,"source_type":"User","created_at":"2022-02-16T13:31:38.332Z","updated_at":"2022-02-16T13:31:38.332Z","action":null},{"id":2,"amount":-28,"user_id":25,"source_id":6,"source_type":"Subscription","created_at":"2022-02-16T13:37:24.517Z","updated_at":"2022-02-16T13:37:24.517Z","action":"You subscribed to Quill Premium"}]
    const wrapper = mount(<PremiumCreditsTable {...sharedProps} premiumCredits={premiumCredits} />);
    expect(wrapper).toMatchSnapshot()
  })

});
