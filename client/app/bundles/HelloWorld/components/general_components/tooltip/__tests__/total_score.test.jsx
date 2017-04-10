import React from 'react';
import { shallow } from 'enzyme';

import TotalScore from '../total_score';

describe('TotalScore component', () => {

  it('should show diagnostic message', () => {
    expect(shallow(<TotalScore diagnostic={true}/>).text()).toMatch('100% Complete');
  });

  it('should show total score percentage', () => {
    expect(shallow(<TotalScore percentage='94%' />).text()).toMatch('Total Score: 94%');
  });

});
