import * as React from 'react';
import { shallow } from 'enzyme';

import { PremiumFeatures } from '../premiumFeatures';

describe('PremiumFeatures component', () => {
  const component = shallow(<PremiumFeatures handleClick={jest.fn} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
