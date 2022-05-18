import * as React from 'react';
import { mount } from 'enzyme';

import { UnitTemplateProfileAssignButton } from '../unit_template_profile_assign_button';
import { activityPack, evidenceActivity } from '../../../../../../../test_data/activityPack';

const mockProps = {
  data: activityPack
}
describe('UnitTemplateProfileDescription component', () => {
  let component = mount(
    <UnitTemplateProfileAssignButton {...mockProps} />
  );
  it('should match snapshot', ()=> {
    expect(component).toMatchSnapshot();
  })
  it('should show login and signup buttons if non_authenticated is true', ()=> {
    expect(component.find('.login-or-signup-buttons').length).toEqual(0);
    mockProps.data.non_authenticated = true;
    component = mount(<UnitTemplateProfileAssignButton {...mockProps} />);
    expect(component.find('.login-or-signup-buttons').length).toEqual(1);
  })
  it('should show Evidence warning if at least one Evidence activity is present', ()=> {
    expect(component.find('.evidence-warning').length).toEqual(0);
    mockProps.data.activities.push(evidenceActivity);
    component = mount(<UnitTemplateProfileAssignButton {...mockProps} />);
    expect(component.find('.evidence-warning').length).toEqual(1);
  })
});
