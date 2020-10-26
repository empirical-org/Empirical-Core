import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'
import ContentPartnerFilters from '../content_partner_filters'

function filterActivities(ignoredKey=null) { return activities }

describe('ContentPartnerFilters component', () => {

  it('should render when there are no content partner filters', () => {
    const wrapper = mount(<ContentPartnerFilters
      activities={activities}
      contentPartnerFilters={[]}
      filterActivities={filterActivities}
      handleContentPartnerFilterChange={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when there are some content partner filters', () => {
    const wrapper = mount(<ContentPartnerFilters
      activities={activities}
      contentPartnerFilters={[1, 2, 3]}
      filterActivities={filterActivities}
      handleContentPartnerFilterChange={() => {}}
    />)
    expect(wrapper).toMatchSnapshot();
  });

})
