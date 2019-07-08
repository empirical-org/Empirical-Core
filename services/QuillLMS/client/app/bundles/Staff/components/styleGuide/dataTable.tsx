import * as React from 'react'

export const descending = 'desc'
export const ascending = 'asc'

interface DataTableRow {
  [key:string]: any;
}

interface DataTableHeader {
  width: string;
  name: string;
  attribute: string;
}

interface DataTableProps {
  defaultSortAttribute?: string;
  defaultSortDirection?: string;
  headers: Array<DataTableHeader>;
  rows: Array<DataTableRow>;
}

interface DataTableState {
  sortAttribute?: string;
  sortDirection?: string;
}


export class DataTable extends React.Component<DataTableProps, DataTableState> {
  constructor(props) {
    super(props)

    this.state = {
      sortAttribute: props.defaultSortAttribute || null,
      sortDirection: props.defaultSortDirection || descending
    }
  }

  attributeAlignment(attributeName) {
    const numbersRegex = new RegExp(/^[\d#%\.\$]+$/)
    return this.props.rows.every(row => numbersRegex.test(row[attributeName])) ? 'right' : 'left'
  }

  renderHeaders() {
    const headers = this.props.headers.map(header => {
      return <span
        className="data-table-header"
        style={{ width: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}`}}
        >
          {header.name}
        </span>
    })
    return <div className="data-table-headers">{headers}</div>
  }

  renderRows() {
    const headers = this.props.headers
    const rows = this.props.rows.map(row => {
      const rowSections = headers.map(header => (
        <span
          className="data-table-row-section"
          style={{ width: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}`}}
        >
          {row[header.attribute]}
        </span>
      ))
      return <div className="data-table-row">{rowSections}</div>
    })
    return <div className="data-table-body">{rows}</div>
  }

  render() {
    return <div className="data-table">
      {this.renderHeaders()}
      {this.renderRows()}
    </div>
  }

}
