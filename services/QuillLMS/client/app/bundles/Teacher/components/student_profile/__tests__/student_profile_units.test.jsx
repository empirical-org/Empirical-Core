import React from 'react';
import { mount, } from 'enzyme';

import { activities } from './test_data'

import StudentProfileUnits from '../student_profile_units';
import StudentProfileUnit, { LOCKED, UNLOCKED, } from '../student_profile_unit';
import { TO_DO_ACTIVITIES, COMPLETED_ACTIVITIES, } from '../../../../../constants/student_profile'

describe('StudentProfileUnits component', () => {

  it('should render <StudentProfileUnit /> components with correct props', () => {
    const wrapper = mount(
      <StudentProfileUnits
        data={[
          {unit_id: 1, unit_name: 'Same ID', staggered_release_unit_status: UNLOCKED, },
          {unit_id: 1, unit_name: 'Same ID', staggered_release_unit_status: UNLOCKED, },
          {unit_id: 2, unit_name: 'Different', staggered_release_unit_status: LOCKED,},
        ]}
      />
    );
    expect(wrapper.find(StudentProfileUnit).length).toBe(2);
    expect(wrapper.find(StudentProfileUnit).at(0).props().data.incomplete[0].unit_name).toBe('Same ID');
    expect(wrapper.find(StudentProfileUnit).at(0).props().data.incomplete[1].unit_name).toBe('Same ID');
    expect(wrapper.find(StudentProfileUnit).at(0).props().unitName).toBe('Same ID');
    expect(wrapper.find(StudentProfileUnit).at(0).props().data.incomplete[0].staggered_release_unit_status).toBe(UNLOCKED);
    expect(wrapper.find(StudentProfileUnit).at(0).props().data.incomplete[1].staggered_release_unit_status).toBe(UNLOCKED);
    expect(wrapper.find(StudentProfileUnit).at(0).props().staggeredReleaseStatus).toBe(UNLOCKED);
    expect(wrapper.find(StudentProfileUnit).at(1).props().data.incomplete[0].unit_name).toBe('Different');
    expect(wrapper.find(StudentProfileUnit).at(1).props().unitName).toBe(LOCKED);
    expect(wrapper.find(StudentProfileUnit).at(1).props().data.incomplete[0].staggered_release_unit_status).toBe(LOCKED);
    expect(wrapper.find(StudentProfileUnit).at(1).props().staggeredReleaseStatus).toBe(LOCKED);
  });

  it('should render only incomplete activities if the active tab is to-do activities', () => {
    const incompleteActivities = activities.filter(act => !act.max_percentage)
    const uniqueUnitIds = Array.from(new Set(incompleteActivities.map(act => act.unit_id)))

    const wrapper = mount(<StudentProfileUnits
      activeClassworkTab={TO_DO_ACTIVITIES}
      data={activities}
      teacherName="Emilia F"
    />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(StudentProfileUnit).length).toBe(uniqueUnitIds.length)
    expect(wrapper.find('.data-table-row').length).toBe(incompleteActivities.length)
  })

  it('should render only completed activities if the active tab is completed activities', () => {
    const completeActivities = activities.filter(act => act.max_percentage)
    const uniqueUnitIds = Array.from(new Set(completeActivities.map(act => act.unit_id)))

    const wrapper = mount(<StudentProfileUnits
      activeClassworkTab={COMPLETED_ACTIVITIES}
      data={activities}
      teacherName="Emilia F"
    />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(StudentProfileUnit).length).toBe(uniqueUnitIds.length)
    expect(wrapper.find('.data-table-row').length).toBe(completeActivities.length)
  })

  it('should render the pinned activity bar if there is a pinned activity', () => {
    const wrapper = mount(<StudentProfileUnits
      activeClassworkTab={TO_DO_ACTIVITIES}
      data={activities}
      teacherName="Emilia F"
    />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.pinned-activity').length).toBe(1)
  })

  it('should render the pinned activity modal if there is a pinned activity', () => {
    const wrapper = mount(<StudentProfileUnits
      activeClassworkTab={TO_DO_ACTIVITIES}
      data={activities}
      teacherName="Emilia F"
    />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.pinned-activity-modal').length).toBe(1)
  })

  it('should not render the pinned activity modal if there is no pinned activity', () => {
    const wrapper = mount(<StudentProfileUnits
      activeClassworkTab={TO_DO_ACTIVITIES}
      data={activities.filter(act => !act.pinned)}
      teacherName="Emilia F"
    />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.pinned-activity').length).toBe(0)
  })

  it('should not render the pinned activity modal if there is no pinned activity', () => {
    const wrapper = mount(<StudentProfileUnits
      activeClassworkTab={TO_DO_ACTIVITIES}
      data={activities.filter(act => !act.pinned)}
      teacherName="Emilia F"
    />)

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.pinned-activity-modal').length).toBe(0)
  })

});
