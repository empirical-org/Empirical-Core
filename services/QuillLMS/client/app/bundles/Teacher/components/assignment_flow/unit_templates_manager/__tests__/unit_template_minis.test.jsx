import React from 'react';
import { shallow } from 'enzyme';

import UnitTemplateMinis from '../unit_template_minis';

const sharedProps = {
  types: [{name: "Diagnostic", id: "diagnostic"}],
  displayedModels: [
    {
      id: 20,
      name: "Sentence Structure Diagnostic",
      time: 30,
      order_number: 0,
      created_at: 0,
      number_of_standards: 1,
      activity_info: "test activity",
      author: {
        name: "author",
        avatar_url: "avatar"
      },
      unit_template_category: {
        primary_color: "#00c2a2",
        secondary_color: "#027360",
        name: "Diagnostic",
        id: 9
      },
      activities: [],
      type: {
        name: "Diagnostic",
        primary_color: "#ea9a1a"
      },
      grades: ['1','2']
    }
  ],
  data: {
    categories: [
      { primary_color: "#00c2a2",
        secondary_color: "#027360",
        name: "Diagnostic",
        id: 9}
    ],
    stage: "index",
    models: [
      {
        id: 20,
        name: "Sentence Structure Diagnostic",
        time: 30,
        order_number: 0,
        created_at: 0,
        number_of_standards: 1,
        activity_info: "test activity",
        author: {
          name: "author",
          avatar_url: "avatar"
        },
        unit_template_category: {
          primary_color: "#00c2a2",
          secondary_color: "#027360",
          name: "Diagnostic",
          id: 9
        },
        activities: [],
        type: {
          name: "Diagnostic",
          primary_color: "#ea9a1a"
        },
        grades: ['1','2']
      }
    ]
  }
}

describe('UnitTemplateMinis component', () => {

  it('should render without createYourOwn mini when teacher not signed in', () => {
    const wrapper = shallow(<UnitTemplateMinis {...sharedProps} signedInTeacher={false} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('UnitTemplateMini').findWhere(n => n.prop('data').id === 'createYourOwn')).toHaveLength(0)
  });

  it('should show createYourOwn mini when teacher is signed in', () => {
    const wrapper = shallow(<UnitTemplateMinis {...sharedProps} signedInTeacher={true} />)
    expect(wrapper.find('UnitTemplateMini').findWhere(n => n.prop('data').id === 'createYourOwn')).toHaveLength(1)
  })
  it('should render dropdowns when on mobile', () => {
    const wrapper = shallow(<UnitTemplateMinis {...sharedProps} signedInTeacher={true} />)
    wrapper.setState({ onMobile: true });
    expect(wrapper).toMatchSnapshot();
  })

});
