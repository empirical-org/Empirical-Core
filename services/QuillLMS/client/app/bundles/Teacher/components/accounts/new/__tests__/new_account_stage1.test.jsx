import React from 'react';
import { shallow } from 'enzyme';

import NewAccountStage1 from '../new_account_stage1';

describe('NewAccountStage1 component', () => {

  it('should render ', () => {
    const wrapper = shallow(
      <NewAccountStage1 selectRole={() => null} />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
