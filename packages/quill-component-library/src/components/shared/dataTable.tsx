import * as React from 'react'
import * as CSS from 'csstype'

import { Tooltip } from './tooltip'

export const descending = 'desc'
export const ascending = 'asc'

const dataTableHeaderClassName = 'data-table-header'

const left: CSS.TextAlignProperty = "left"
const right: CSS.TextAlignProperty = "right"

const indeterminateSrc = 'https://assets.quill.org/images/icons/indeterminate.svg'
const removeSrc = 'https://assets.quill.org/images/icons/remove.svg'
const moreHorizontalSrc = 'https://assets.quill.org/images/icons/more-horizontal.svg'
const smallWhiteCheckSrc = 'https://assets.quill.org/images/shared/check-small-white.svg'
const arrowSrc = 'https://assets.quill.org/images/shared/arrow.svg'

interface DataTableRow {
  id: number|string;
  actions?: Array<{name: string, action: Function}>
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
  showRemoveIcon?: boolean;
  showActions?: boolean;
  removeRow?: (event: any) => void;
  checkRow?: (event: any) => void;
  uncheckRow?: (event: any) => void;
  uncheckAllRows?: (event: any) => void;
  checkAllRows?: (event: any) => void;
}

interface DataTableState {
  sortAttribute?: string;
  sortAscending?: boolean;
  rowWithActionsOpen?: number|string;
}

export class DataTable extends React.Component<DataTableProps, DataTableState> {
  private selectedStudentActions: any

  constructor(props) {
    super(props)

    this.state = {
      sortAttribute: props.defaultSortAttribute || null,
      sortAscending: props.defaultSortDirection !== descending
    }

    this.changeSortDirection = this.changeSortDirection.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick(e) {
    if (this.selectedStudentActions) {
      this.setState({ rowWithActionsOpen: null })
    }
  }

  attributeAlignment(attributeName): CSS.TextAlignProperty {
    const numbersRegex = new RegExp(/^[\d#%\.\$]+$/)
    return this.props.rows.every(row => numbersRegex.test(row[attributeName]) || !row[attributeName]) ? right : left
  }

  changeSortDirection() {
    this.setState({ sortAscending: !this.state.sortAscending })
  }

  sortRows() {
    const { sortAttribute, sortAscending, } = this.state
    const { rows } = this.props
    if (sortAttribute) {
      return sortAscending ? rows.sort((a, b) => a[sortAttribute] - b[sortAttribute]) : rows.sort((a, b) => b[sortAttribute] - a[sortAttribute])
    } else {
      return rows
    }
  }

  renderHeaderCheckbox() {
    const { showCheckboxes, rows, uncheckAllRows, checkAllRows } = this.props
    if (showCheckboxes) {
      const anyChecked = rows.some(row => row.checked)
      if (anyChecked) {
        return <span className={`quill-checkbox selected ${dataTableHeaderClassName}`}>
          <img src={indeterminateSrc} alt="check" onClick={uncheckAllRows}/>
        </span>
      } else {
        return <span className={`quill-checkbox unselected ${dataTableHeaderClassName}`} onClick={checkAllRows} />
      }
    }
  }

  renderHeaderForRemoval() {
    const { showRemoveIcon } = this.props
    if (showRemoveIcon) {
      return <span className={dataTableHeaderClassName} />
    }
  }

  renderActionsHeader() {
    const { showActions } = this.props
    if (showActions) {
      return <span className={`${dataTableHeaderClassName} actions-header`}>Actions</span>
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

  renderRowRemoveIcon(row) {
    if (this.props.showRemoveIcon) {
      return <span className="removable data-table-row-section" onClick={() => this.props.removeRow(row.id)}><img src={removeSrc} alt="x" /></span>
    }
  }

  renderActions(row) {
    if (row.actions) {
      const { rowWithActionsOpen } = this.state
      let content
      if (rowWithActionsOpen === row.id) {
        const rowActions = row.actions.map(act => <span onClick={() => act.action(row.id)}>{act.name}</span>)
        content = <div className="actions-menu-container" ref={node => this.selectedStudentActions = node}>
          <div className="actions-menu">
            {rowActions}
          </div>
        </div>
      } else {
        content = <button
          className="quill-button actions-button"
          onClick={() => this.setState({ rowWithActionsOpen: row.id })}
        >
          <img src={moreHorizontalSrc} alt="ellipses" />
        </button>
      }
      return <span className="data-table-row-section actions-section">{content}</span>
    }
  }

  renderHeaders() {
    const headers = this.props.headers.map(header => {
      let sortArrow, onClick
      let className = dataTableHeaderClassName
      let style: React.CSSProperties = { width: `${header.width}`, minWidth: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}` as CSS.TextAlignProperty }
      if (header.isSortable) {
        const sortDirection = this.state.sortAscending ? ascending : descending
        onClick = this.changeSortDirection
        sortArrow = <img className={`sort-arrow ${sortDirection}`} src={arrowSrc} />
        className+= ' sortable'
      }
      return <span
        onClick={onClick}
        className={className}
        style={style as any}
        >
          {sortArrow}
          {header.name}
        </span>
    })
    return <div className="data-table-headers">{this.renderHeaderCheckbox()}{headers}{this.renderHeaderForRemoval()}{this.renderActionsHeader()}</div>
  }

  renderRows() {
    const headers = this.props.headers
    const rows = this.sortRows().map(row => {
      const rowClassName = `data-table-row ${row.checked ? 'checked' : ''}`
      const rowSections = headers.map(header => {
        let style: React.CSSProperties = { width: `${header.width}`, minWidth: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}` as CSS.TextAlignProperty }
        const sectionText = row[header.attribute]
        const headerWidthNumber = Number(header.width.slice(0, -2))
        if ((String(sectionText).length * 7) >= headerWidthNumber) {
          return <Tooltip
            tooltipTriggerTextClass="data-table-row-section"
            tooltipTriggerText={sectionText}
            tooltipText={sectionText}
            tooltipTriggerStyle={style}
            tooltipTriggerTextStyle={style}
          />
        } else {
          return <span
            className="data-table-row-section"
            style={style as any}
          >
            {sectionText}
          </span>
        }
      })
      return <div className={rowClassName} key={String(row.id)}>{this.renderRowCheckbox(row)}{rowSections}{this.renderRowRemoveIcon(row)}{this.renderActions(row)}</div>
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
