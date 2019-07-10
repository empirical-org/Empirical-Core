import * as React from 'react'

import { Tooltip } from './tooltip'

export const descending = 'desc'
export const ascending = 'asc'

const indeterminateSrc = `${process.env.CDN_URL}/images/icons/indeterminate.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`
const arrowSrc = `${process.env.CDN_URL}/images/shared/arrow.svg`

interface DataTableRow {
  id: number|string;
  [key:string]: any;
}

interface DataTableHeader {
  width: string;
  name: string;
  attribute: string;
  isSortable?: boolean;
}

interface DataTableProps {
  headers: Array<DataTableHeader>;
  rows: Array<DataTableRow>;
  className?: string;
  defaultSortAttribute?: string;
  defaultSortDirection?: string;
  showCheckboxes?: boolean;
  checkRow?: (event: any) => void;
  uncheckRow?: (event: any) => void;
  uncheckAllRows?: (event: any) => void;
  checkAllRows?: (event: any) => void;
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

    this.changeSortDirection = this.changeSortDirection.bind(this)
  }

  attributeAlignment(attributeName) {
    const numbersRegex = new RegExp(/^[\d#%\.\$]+$/)
    return this.props.rows.every(row => numbersRegex.test(row[attributeName])) ? 'right' : 'left'
  }

  changeSortDirection() {
    if (this.state.sortDirection === descending) {
      this.setState({ sortDirection: ascending })
    } else {
      this.setState({ sortDirection: descending })
    }
  }

  sortRows() {
    const { sortAttribute, sortDirection, } = this.state
    const { rows } = this.props
    if (sortAttribute) {
      const sortedRows = rows.sort((a, b) => a[sortAttribute] - b[sortAttribute])
      return sortDirection === descending ? sortedRows : sortedRows.reverse()
    } else {
      return rows
    }
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
      let sortArrow, onClick
      let style: { width: string, textAlign: string, color?: string, cursor?: string } = { width: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}`}
      if (header.isSortable) {
        onClick = this.changeSortDirection
        sortArrow = <img className={`sort-arrow ${this.state.sortDirection}`} onClick={this.changeSortDirection} src={arrowSrc} />
        style.color = '#000'
        style.cursor = 'pointer'
      }
      return <span
        onClick={onClick}
        className="data-table-header"
        style={style}
        >
          {sortArrow}
          {header.name}
        </span>
    })
    return <div className="data-table-headers">{this.renderHeaderCheckbox()}{headers}</div>
  }

  renderRows() {
    const headers = this.props.headers
    const rows = this.sortRows().map(row => {
      const rowClassName = `data-table-row ${row.checked ? 'checked' : ''}`
      const rowSections = headers.map(header => {
        const style: { width: string, textAlign: string, marginRight?: string } = { width: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}`}
        const sectionText = row[header.attribute]
        const headerWidthNumber = Number(header.width.slice(0, -2))
        if ((String(sectionText).length * 7) >= headerWidthNumber) {
          style.marginRight = '24px'
          const tooltipTriggerTextStyle = { ...style, display: 'inline-block' }
          return <Tooltip
            tooltipTriggerTextClass="data-table-row-section"
            tooltipTriggerText={sectionText}
            tooltipText={sectionText}
            tooltipTriggerStyle={style}
            tooltipTriggerTextStyle={tooltipTriggerTextStyle}
          />
        } else {
          return <span
            className="data-table-row-section"
            style={style}
          >
            {sectionText}
          </span>
        }
      })
      return <div className={rowClassName}>{this.renderRowCheckbox(row)}{rowSections}</div>
    })
    return <div className="data-table-body">{rows}</div>
  }

  render() {
    return <div className={`data-table ${this.props.className}`}>
      {this.renderHeaders()}
      {this.renderRows()}
    </div>
  }

}
