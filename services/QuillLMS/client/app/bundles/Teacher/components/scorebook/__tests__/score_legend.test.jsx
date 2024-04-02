import { shallow } from 'enzyme';
import React from 'react';

import ScoreLegend from '../score_legend.jsx';

describe('ScoreLegend component', () => {

  it('should render', () => {
    const wrapper = shallow(<ScoreLegend />)
    expect(wrapper).toMatchSnapshot();
  });

})
