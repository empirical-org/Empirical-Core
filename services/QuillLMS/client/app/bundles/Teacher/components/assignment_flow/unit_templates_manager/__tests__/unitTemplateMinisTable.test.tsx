import { mount } from 'enzyme';
import * as React from 'react';

import { activityPack } from '../../../../../../test_data/activityPack';
import UnitTemplateMinisTable from '../unitTemplateMinisTable';

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
