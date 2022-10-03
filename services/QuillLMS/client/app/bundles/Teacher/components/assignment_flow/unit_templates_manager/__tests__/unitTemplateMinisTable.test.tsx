import * as React from 'react';
import { mount } from 'enzyme';

import UnitTemplateMinisTable from '../unitTemplateMinisTable';
import { activityPack } from '../../../../../../test_data/activityPack';

const mockProps = {
  unitTemplates: [activityPack]
}

describe('UnitTemplateMinisTable component', () => {
  it('should render activity_info has html', ()=> {
    const wrapper = mount(
      <UnitTemplateMinisTable {...mockProps} />
    );
    expect(wrapper).toMatchSnapshot();
  })
});
