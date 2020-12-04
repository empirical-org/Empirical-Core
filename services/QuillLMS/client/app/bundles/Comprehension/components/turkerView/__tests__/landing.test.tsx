import * as React from 'react';
import { shallow } from 'enzyme';

import { TurkLanding } from '../landing';

describe('TurkLanding Component', () => {
  const component = shallow(<TurkLanding handleStartActivity={jest.fn} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
