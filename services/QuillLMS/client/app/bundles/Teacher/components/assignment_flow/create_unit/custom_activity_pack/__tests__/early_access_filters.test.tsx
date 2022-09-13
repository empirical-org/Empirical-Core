import * as React from 'react'
import { mount } from 'enzyme';

import { activities } from './data'

import EarlyAccessFilters from '../early_access_filters'
import { EVIDENCE_BETA1, EVIDENCE_BETA2, } from '../../../../../../../constants/flagOptions'

function filterActivities(ignoredKey=null) { return activities }

describe('AarlyAccessFilters component', () => {
  const props = {
    activities,
    earlyAccessFilters: [],
    filterActivities,
    handleEarlyAccessFilterChange: (earlyAccessFilters: string[]) => {}
  }

  it('should render when the flagset is evidence beta 1', () => {
    const wrapper = mount(<EarlyAccessFilters {...props} flagset={EVIDENCE_BETA1} />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when the flagset is evidence beta 2', () => {
    const wrapper = mount(<EarlyAccessFilters {...props} flagset={EVIDENCE_BETA2} />)
    expect(wrapper).toMatchSnapshot();
  });

})
