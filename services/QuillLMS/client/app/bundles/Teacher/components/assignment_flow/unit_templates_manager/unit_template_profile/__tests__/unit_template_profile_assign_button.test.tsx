import * as React from 'react';
import { mount } from 'enzyme';

import { UnitTemplateProfileDisclaimer } from '../unit_template_profile_assign_button';
import { activityPack, evidenceActivity } from '../../../../../../../test_data/activityPack';

const mockProps = {
  data: activityPack
}
describe('UnitTemplateProfileDescription component', () => {
  let component = mount(
    <UnitTemplateProfileDisclaimer {...mockProps} />
  );
  it('should match snapshot', ()=> {
    expect(component).toMatchSnapshot();
  })
  it('should show Evidence warning if at least one Evidence activity is present', ()=> {
    expect(component.find('.evidence-warning').length).toEqual(0);
    mockProps.data.activities.push(evidenceActivity);
    component = mount(<UnitTemplateProfileDisclaimer {...mockProps} />);
    expect(component.find('.evidence-warning').length).toEqual(1);
  })
});
