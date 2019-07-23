import * as React from 'react';

import { shallow } from 'enzyme';

import { DataTable } from '../../../src/components/shared/index'

const headers1 = [
  {
    name: 'Name',
    attribute: 'name',
    width: '126px'
  },
  {
    name: 'Activities',
    attribute: 'activities',
    width: '53px'
  },
  {
    name: 'Questions',
    attribute: 'questions',
    width: '53px'
  },
  {
    name: 'Score',
    attribute: 'score',
    width: '36px'
  }
]

const rows1 = [
  {
    name: 'Maya Angelou',
    activities: 15,
    questions: 108,
    score: '97%',
    id: 1
  },
  {
    name: 'Ambrose Bierce',
    activities: 14,
    questions: 92,
    score: '82%',
    id: 2
  },
  {
    name: 'George Gordon Byron',
    activities: 16,
    questions: 116,
    score: '93%',
    id: 3
  },
  {
    name: 'Elizabeth Carter',
    activities: 8,
    questions: 78,
    score: '94%',
    id: 4
  },
  {
    name: 'Anton Chekhov',
    activities: 7,
    questions: 72,
    score: '87%',
    id: 5
  }
]

describe('DataTable component', () => {

  describe('simple case', () => {
    const wrapper = shallow(
      <DataTable headers={headers1} row={rows1} />
    );

    it('should render a header row', () => {
      expect(wrapper.find(StudentOptions).exists()).toBe(true);
    })
  })


  })

});
