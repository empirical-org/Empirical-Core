import React from 'react';
import { shallow } from 'enzyme';

import PremiumPricingGuide from '../PremiumPricingGuide.jsx';

describe('PremiumPricingGuide container', () => {
  beforeEach(() => {
    const div = document.createElement('div');
    div.setAttribute('id', 'current-user-id');
    div.setAttribute('content', false);
    document.body.appendChild(div);
  });

  it('should render', () => {
    expect(shallow(<PremiumPricingGuide diagnosticActivityCount={9} independentPracticeActivityCount={400} lessonsActivityCount={50} />)).toMatchSnapshot();
  });

});
