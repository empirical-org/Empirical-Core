import * as React from 'react';
import { shallow } from 'enzyme';

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
