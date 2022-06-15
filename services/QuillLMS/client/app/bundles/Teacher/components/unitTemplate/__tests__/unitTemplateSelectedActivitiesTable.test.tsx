import * as React from 'react';
import { shallow } from 'enzyme';

import { UnitTemplateSelectedActivitiesTable } from '../unitTemplateSelectedActivitiesTable';

describe('UnitTemplateSelectedActivitiesTable component', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <UnitTemplateSelectedActivitiesTable
        activities={[]}
        handleRemoveActivity={jest.fn}
        selectedActivities={[]}
        updateOrder={jest.fn}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
