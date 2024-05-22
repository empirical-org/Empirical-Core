import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    id: 1,
    removable: true
  },
  {
    name: 'Ambrose Bierce',
    activities: 14,
    id: 2,
    removable: true
  },
  {
    name: 'George Gordon',
    activities: 16,
    id: 3,
    removable: true
  },
  {
    name: 'Elizabeth Carter',
    activities: 8,
    id: 4,
    removable: true
  },
  {
    name: 'Anton Chekhov',
    activities: 7,
    id: 5,
    removable: true
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
    test('should render a header for each header in props', () => {
      render(<DataTable headers={headers1} rows={rows1} />);
      expect(screen.getAllByRole('columnheader')).toHaveLength(headers1.length);
    });

    test('should render a row for each row in props', () => {
      render(<DataTable headers={headers1} rows={rows1} />);
      expect(screen.getAllByRole('row')).toHaveLength(rows1.length + 1); // +1 for header row
    });
  });

  describe('with checkboxes', () => {
    test('should render a checkbox for each row, plus the header', () => {
      render(
        <DataTable
          checkAllRows={() => {}}
          checkRow={() => {}}
          headers={headers2}
          rows={rows2}
          showCheckboxes={true}
          uncheckAllRows={() => {}}
          uncheckRow={() => {}}
        />
      );
      expect(screen.getAllByLabelText(/checkbox/i)).toHaveLength(rows2.length + 1); // we don't use the aria role checkbox for these because they have a third, indeterminate state
    });
  });

  describe('with sorting', () => {
    test('should render the rows in ascending order of activities', () => {
      render(<DataTable defaultSortAttribute='activities' headers={headers3} rows={rows3} />);
      const firstRowText = screen.getAllByRole('row')[1].textContent;
      expect(firstRowText.includes(rows3[0].name)).toBe(true);
    });

    test('should render the row in descending order if the state gets changed', async () => {
      const { container } = render(<DataTable defaultSortAttribute='activities' headers={headers3} rows={rows3} />);
      const header = screen.getAllByRole('columnheader')[1];
      await userEvent.click(header); // Click to sort in descending
      const sortedRows = [...rows3].sort((a, b) => b.activities - a.activities);
      const firstRowText = container.querySelectorAll('.data-table-row')[0].textContent;
      expect(firstRowText.includes(sortedRows[sortedRows.length - 1].name)).toBe(true);
    });
  });

  describe('with remove icons', () => {
    test('should render a header for each header in props, plus one for the remove icon', () => {
      render(<DataTable headers={headers3} removeRow={() => {}} rows={rows3} showRemoveIcon={true} />);
      expect(screen.getAllByRole('columnheader')).toHaveLength(headers3.length + 1);
    });

    test('should render a remove icon for each row', () => {
      render(<DataTable headers={headers3} removeRow={() => {}} rows={rows3} showRemoveIcon={true} />);
      expect(screen.getAllByRole('button', { name: /remove/i })).toHaveLength(rows3.length);
    });
  });

  describe('with actions', () => {
    test('should render a header for each header in props', () => {
      render(<DataTable headers={headers4} rows={rows4} showActions={true} />);
      expect(screen.getAllByRole('columnheader')).toHaveLength(headers4.length);
    });

    test('should render a header with the text Actions', () => {
      render(<DataTable headers={headers4} rows={rows4} showActions={true} />);
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    test('should render an actions section for each row with actions', () => {
      render(<DataTable headers={headers4} rows={rows4} showActions={true} />);
      const actionsButtons = screen.getAllByRole('button', { name: /actions/i });
      expect(actionsButtons).toHaveLength(rows4.filter(row => row.actions).length);
    });

    test('should render an open actions menu for the selected row', async () => {
      render(<DataTable headers={headers4} rows={rows4} showActions={true} />);
      await userEvent.click(screen.getAllByRole('button', { name: /actions/i })[0]);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });

});
