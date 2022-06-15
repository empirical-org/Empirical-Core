import * as React from 'react';
import { shallow } from 'enzyme';

import { UnitTemplateSelectedActivitiesTable } from '../unitTemplateSelectedActivitiesTable';

describe('UnitTemplate component', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <UnitTemplateSelectedActivitiesTable
        activities={[]}
        selectedActivities={[]}
        handleRemoveActivity={jest.fn}
        updateOrder={jest.fn}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
