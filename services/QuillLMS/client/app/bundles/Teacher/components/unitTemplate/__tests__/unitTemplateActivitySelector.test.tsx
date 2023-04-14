import { shallow } from 'enzyme';
import * as React from 'react';

import { UnitTemplateActivitySelector } from '../unitTemplateActivitySelector';

describe('UnitTemplateActivitySelector component', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <UnitTemplateActivitySelector
        parentActivities={[]}
        setParentActivities={jest.fn}
        toggleParentActivity={jest.fn}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
