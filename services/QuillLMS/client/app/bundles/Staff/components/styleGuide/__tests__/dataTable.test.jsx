import * as React from 'react';

import { shallow } from 'enzyme';

import { DataTable } from '../../../../Shared/index';

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

const headers2 = [
  {
    name: 'Name',
    attribute: 'name',
    width: '126px'
  },
  {
    name: 'Username',
    attribute: 'username',
    width: '230px'
  }
]

const headers3 = [
  {
    name: 'Name',
    attribute: 'name',
    width: '126px'
  },
  {
    name: 'Activities',
    attribute: 'activities',
    width: '77px',
    isSortable: true
  },
]

const headers4 = [
  {
    name: 'Name',
    attribute: 'name',
    width: '126px'
  },
  {
    name: 'Activities',
    attribute: 'activities',
    width: '77px',
    isSortable: true
  },
  {
    name: 'Actions',
    attribute: 'actions',
    isActions: true
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

const rows2 = [
  {
    name: 'Maya Angelou',
    username: 'maya.angelou@local-writing',
    id: 1
  },
  {
    name: 'Ambrose Bierce',
    username: 'ambrose.bierce@local-writing',
    id: 2
  },
  {
    name: 'George Gordon Byron',
    username: 'georgegordon.byron@local-writing',
    id: 3
  },
  {
    name: 'Elizabeth Carter',
    username: 'elizabeth.carter@local-writing',
    id: 4
  },
  {
    name: 'Anton Chekhov',
    username: 'anton.checkhov@local-writing',
    id: 5
  }
]

const rows3 = [
  {
    name: 'Maya Angelou',
    activities: 15,
    id: 1
  },
  {
    name: 'Ambrose Bierce',
    activities: 14,
    id: 2
  },
  {
    name: 'George Gordon',
    activities: 16,
    id: 3
  },
  {
    name: 'Elizabeth Carter',
    activities: 8,
    id: 4
  },
  {
    name: 'Anton Chekhov',
    activities: 7,
    id: 5
  }
]

const rows4 = rows3.map((row) => {
  const newRow = { ...row }
  newRow.actions = [
    { name: 'Action', action: () => {} }
  ]
  return newRow
})


describe('DataTable component', () => {

  describe('simple case', () => {
    const wrapper = shallow(
      <DataTable headers={headers1} rows={rows1} />
    );

    it('should render a header row', () => {
      expect(wrapper.find('.data-table-headers').exists()).toBe(true);
    })

    it('should render a header for each header in props', () => {
      expect(wrapper.find('.data-table-header').length).toBe(headers1.length)
    })

    it('should render a row for each row in props', () => {
      expect(wrapper.find('.data-table-row').length).toBe(rows1.length)
    })
  })

  describe('with checkboxes', () => {
    const wrapper = shallow(
      <DataTable
        checkAllRows={() => {}}
        checkRow={() => {}}
        headers={headers2}
        rows={rows2}
        showCheckboxes={true}
        uncheckAllRows={() => {}}
        uncheckRow={() => {}}
      />
    )

    it('should render a checkbox for each row, plus the header', () => {
      expect(wrapper.find('.quill-checkbox').length).toBe(rows2.length + 1)
    })
  })

  describe('with sorting', () => {
    const wrapper = shallow(
      <DataTable
        defaultSortAttribute='activities'
        headers={headers4}
        rows={rows3}
      />
    )

    it('should render the rows in ascending order of activities', () => {
      const sortedRows = rows3.sort((a, b) => a.activities - b.activities)
      expect(wrapper.find('.data-table-row-section').first().text()).toBe(sortedRows[0].name)
    })

    it('should render the row in descending order if the state gets changed', () => {
      wrapper.instance().setState({ sortAscending: false, })
      const sortedRows = rows3.sort((a, b) => b.activities - a.activities)
      expect(wrapper.find('.data-table-row-section').first().text()).toBe(sortedRows[0].name)
    })
  })

  describe('with remove icons', () => {
    const wrapper = shallow(
      <DataTable
        headers={headers3}
        removeRow={() => {}}
        rows={rows3}
        showRemoveIcon={true}
      />
    )

    it('should render a header for each header in props, plus one for the remove icon', () => {
      expect(wrapper.find('.data-table-header').length).toBe(headers3.length + 1)
    })

    it('should render a remove icon for each row', () => {
      expect(wrapper.find('.removable').length).toBe(rows3.length)
    })
  })

  describe('with actions', () => {
    const wrapper = shallow(
      <DataTable
        headers={headers4}
        rows={rows4}
        showActions={true}
      />
    )

    it('should render a header for each header in props', () => {
      expect(wrapper.find('.data-table-header').length).toBe(headers4.length)
    })

    it('should render a header with the text Actions', () => {
      expect(wrapper.find('.data-table-header').last().text()).toBe('Actions')
    })

    it('should render an actions section for each row with actions', () => {
      const rowsWithActions = rows4.filter(row => row.actions)
      expect(wrapper.find('.actions-section').length).toBe(rowsWithActions.length)
    })

    it('should render an open actions menu for the selected row', () => {
      wrapper.instance().setState({ rowWithActionsOpen: rows4[0].id, })
      expect(wrapper.find('.actions-menu').exists()).toBe(true)
    })
  })


});
