import * as React from 'react'

export const descending = 'desc'
export const ascending = 'asc'

const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface DataTableRow {
  id: number|string;
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
  showCheckboxes?: boolean;
  checkRow?: Function;
  uncheckRow?: Function;
  uncheckAllRows?: Function;
  checkAllRows?: Function;
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

    this.renderHeaderCheckbox = this.renderHeaderCheckbox.bind(this)
    this.renderRowCheckbox = this.renderRowCheckbox.bind(this)
  }

  attributeAlignment(attributeName) {
    const numbersRegex = new RegExp(/^[\d#%\.\$]+$/)
    return this.props.rows.every(row => numbersRegex.test(row[attributeName])) ? 'right' : 'left'
  }

  renderHeaderCheckbox() {
    const { showCheckboxes, rows, uncheckAllRows, checkAllRows } = this.props
    if (showCheckboxes) {
      const anyChecked = rows.some(row => row.checked)
      if (anyChecked) {
        return <span className="quill-checkbox selected data-table-header">
          <img src={indeterminateSrc} alt="check" onClick={uncheckAllRows}/>
        </span>
      } else {
        return <span className="quill-checkbox unselected data-table-header" onClick={checkAllRows} />
      }
    }
  }

  renderRowCheckbox(row) {
    if (this.props.showCheckboxes) {
      if (row.checked) {
        return <span className="quill-checkbox selected data-table-row-section" onClick={() => this.props.uncheckRow(row.id)}><img src={smallWhiteCheckSrc} alt="check" /></span>
      } else {
        return <span className="quill-checkbox unselected data-table-row-section" onClick={() => this.props.checkRow(row.id)} />
      }
    }
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
    return <div className="data-table-headers">{this.renderHeaderCheckbox()}{headers}</div>
  }

  renderRows() {
    const headers = this.props.headers
    const rows = this.props.rows.map(row => {
      const rowClassName = `data-table-row ${row.checked ? 'checked' : ''}`
      const rowSections = headers.map(header => (
        <span
          className="data-table-row-section"
          style={{ width: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}`}}
        >
          {row[header.attribute]}
        </span>
      ))
      return <div className={rowClassName}>{this.renderRowCheckbox(row)}{rowSections}</div>
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
