import * as React from 'react';
import { shallow } from 'enzyme';
import ComprehensionLanding from '../ComprehensionLanding';

describe('ComprehensionLanding component', () => {
  const container = shallow(<ComprehensionLanding />);

  it('should render ComprehensionLanding', () => {
    expect(container).toMatchSnapshot();
  });
});
