import * as React from 'react'
import * as CSS from 'csstype'

import { Tooltip } from 'quill-component-library/dist/componentLibrary'

import { DataTableHeader, DataTableRow } from './dataTable'

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

interface DataTableRowProps {
  headers: Array<DataTableHeader>;
  row: DataTableRow;
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

export class DataTableRowComponent extends React.Component<DataTableRowProps, DataTableRowState> {
  private selectedStudentActions: any

  attributeAlignment(attributeName): CSS.TextAlignProperty {
    const numbersRegex = new RegExp(/^[\d#%\.\$]+$/)
    return this.props.rows.every(row => numbersRegex.test(row[attributeName]) || !row[attributeName]) ? right : left
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

  render() {
    const { headers, row } = this.props
    const rowClassName = `data-table-row ${row.checked ? 'checked' : ''}`
    const rowSections = headers.map(header => {
      let style: React.CSSProperties = { width: `${header.width}`, minWidth: `${header.width}`, textAlign: `${this.props.attributeAlignment(header.attribute)}` as CSS.TextAlignProperty }
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
  }

}
