import * as React from 'react'
import { DataTable } from './dataTable'
// import { DataTable, defaultDataTableTimeout } from 'quill-component-library/dist/componentLibrary'

const headers = [
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

const rows = [
  {
    name: 'Maya Angelou',
    activities: 15,
    questions: 108,
    score: '97%'
  },
  {
    name: 'Ambrose Bierce',
    activities: 14,
    questions: 92,
    score: '82%'
  },
  {
    name: 'George Gordon Byron',
    activities: 16,
    questions: 116,
    score: '93%'
  },
  {
    name: 'Elizabeth Carter',
    activities: 8,
    questions: 78,
    score: '94%'
  },
  {
    name: 'Anton Chekhov',
    activities: 7,
    questions: 72,
    score: '87%'
  }
]

class DataTables extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return <div id="data-tables">
      <h2 className="style-guide-h2">Data Tables</h2>
      <div className="element-container">
        <div>
          <h4 className="style-guide-h4">Data table</h4>
          <pre>
{`        <div className="data-tables-container">
          <DataTable
            rows={JSON.stringify(rows)}
            headers={JSON.stringify(headers)}
          />
        </div>
`}
          </pre>
          <div className="data-tables-container">
            <DataTable
              rows={rows}
              headers={headers}
            />
          </div>
        </div>
      </div>
    </div>
  }

}

export default DataTables
