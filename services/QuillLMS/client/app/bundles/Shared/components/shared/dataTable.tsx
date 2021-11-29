import * as React from 'react'
import * as CSS from 'csstype'
import { SortableHandle, } from 'react-sortable-hoc';

import { Tooltip } from './tooltip'
import { SortableList, } from './sortableList'

export const descending = 'desc'
export const ascending = 'asc'

const dataTableHeaderClassName = 'data-table-header'

const left: CSS.TextAlignProperty = "left"
const right: CSS.TextAlignProperty = "right"

const indeterminateSrc = 'https://assets.quill.org/images/icons/indeterminate.svg'
const removeSrc = 'https://assets.quill.org/images/icons/remove.svg'
const moreHorizontalSrc = 'https://assets.quill.org/images/icons/more-horizontal.svg'
const smallWhiteCheckSrc = 'https://assets.quill.org/images/shared/check-small-white.svg'
const arrowSrc = 'https://assets.quill.org/images/icons/icons-arrow.svg'
const reorderSrc = `${process.env.CDN_URL}/images/icons/reorder.svg`

interface DataTableRow {
  id: number|string;
  actions?: Array<{name: string, action: Function}>
  [key:string]: any;
}

interface DataTableHeader {
  width: string;
  name: string;
  attribute: string;
  noTooltip?: boolean;
  rowSectionClassName?: string;
  headerClassName?: string;
  isSortable?: boolean;
}

interface DataTableProps {
  headers: Array<DataTableHeader>;
  rows: Array<DataTableRow>;
  averageFontWidth?: number;
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
  isReorderable?: boolean;
  reorderCallback?: (event: any) => void;
}

interface DataTableState {
  sortAttribute?: string;
  sortAscending?: boolean;
  rowWithActionsOpen?: number|string;
}

export class DataTable extends React.Component<DataTableProps, DataTableState> {
  private selectedActions: any  // eslint-disable-line react/sort-comp
  static defaultProps: { averageFontWidth: number }  // eslint-disable-line react/sort-comp

  constructor(props) {
    super(props)

    this.state = {
      sortAttribute: props.defaultSortAttribute || null,
      sortAscending: props.defaultSortDirection !== descending
    }
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false)
  }

  handleClick = (e) => {
    if (this.selectedActions && !this.selectedActions.contains(e.target)) {
      this.setState({ rowWithActionsOpen: null })
    }
  }

  attributeAlignment(attributeName): CSS.TextAlignProperty {
    const { rows, } = this.props
    const numbersRegex = new RegExp(/^[\d#%\.\$]+$/)
    return rows.every(row => numbersRegex.test(row[attributeName]) || !row[attributeName]) ? right : left
  }

  changeSort = (newSortAttribute) => {
    const { sortAttribute, } = this.state
    if (sortAttribute === newSortAttribute) {
      this.setState(prevState => ({ sortAscending: !prevState.sortAscending }))
    } else {
      this.setState({ sortAttribute: newSortAttribute, })
    }
  }

  sortRows() {
    const { sortAttribute, sortAscending, } = this.state
    const { rows } = this.props
    if (sortAttribute) {
      return rows.sort((a, b) => {
        if (a[sortAttribute] === b[sortAttribute]) { return 0; }
        if (a[sortAttribute] === null || a[sortAttribute] === undefined) { return 1; }
        if (b[sortAttribute] === null || b[sortAttribute] === undefined) { return -1; }
        if (sortAscending) { return a[sortAttribute] < b[sortAttribute] ? -1 : 1 }
        return a[sortAttribute] < b[sortAttribute] ? 1 : -1
      })
    }

    return rows
  }

  clickAction(action, id) {
    action(id)
    this.setState({ rowWithActionsOpen: null })
  }

  renderHeaderCheckbox() {
    const { showCheckboxes, rows, uncheckAllRows, checkAllRows } = this.props

    if (!showCheckboxes) { return }

    const allDisabled = rows.every(row => row.checkDisabled)
    if (allDisabled) {
      return <span className={`quill-checkbox disabled ${dataTableHeaderClassName}`} />
    }

    const allChecked = rows.every(row => row.checked)
    if (allChecked) {
      return (<button className={`quill-checkbox selected ${dataTableHeaderClassName}`} onClick={uncheckAllRows} type="button">
        <img alt="check" src={smallWhiteCheckSrc} />
      </button>)
    }

    const anyChecked = rows.some(row => row.checked)
    if (anyChecked) {
      return (<button className={`quill-checkbox selected ${dataTableHeaderClassName}`} onClick={uncheckAllRows} type="button">
        <img alt="check" src={indeterminateSrc} />
      </button>)
    }

    return <button aria-label="Unchecked checkbox" className={`quill-checkbox unselected ${dataTableHeaderClassName}`} onClick={checkAllRows} type="button" />
  }

  renderHeaderForRemoval() {
    const { showRemoveIcon } = this.props
    if (!showRemoveIcon) { return null }

    return <span className={dataTableHeaderClassName} />
  }

  renderHeaderForOrder() {
    const { isReorderable } = this.props
    if (!isReorderable) { return }

    return <span className={`${dataTableHeaderClassName} reorder-header`}>Order</span>
  }

  renderActionsHeader(header) {
    const { showActions } = this.props
    if (!showActions) { return null }

    return <span className={`${dataTableHeaderClassName} actions-header`}>{header.name || 'Actions'}</span>
  }

  renderRowCheckbox(row) {
    const { showCheckboxes, checkRow, uncheckRow} = this.props

    if (!showCheckboxes) { return null }

    if (row.checked) { return <button className="quill-checkbox selected data-table-row-section" onClick={() => uncheckRow(row.id)} type="button"><img alt="check" src={smallWhiteCheckSrc} /></button> }

    if (row.checkDisabled) { return <span className="quill-checkbox disabled data-table-row-section" /> }

    return <button aria-label="Unchecked checkbox" className="quill-checkbox unselected data-table-row-section" onClick={() => checkRow(row.id)} type="button" />
  }

  renderRowRemoveIcon(row) {
    const { showRemoveIcon, removeRow, } = this.props
    if (showRemoveIcon && row.removable) {
      return <button className="removable data-table-row-section focus-on-light" id={`remove-button-${row.id}`} onClick={() => removeRow(row.id)} type="button"><img alt="x" src={removeSrc} /></button>
    }

    return <span className='removable data-table-row-section' />
  }

  renderActions(row) {
    if (!row.actions) { return }

    const { rowWithActionsOpen } = this.state
    const actionsIsOpen = rowWithActionsOpen === row.id;

    return (<span className="data-table-row-section actions-section">
      {actionsIsOpen ? this.renderOpenActions(row) : this.renderClosedActions(row)}
    </span>)
  }

  renderOpenActions(row) {
    const rowActions = row.actions.map(act => {
      if (act.element) { return act.element }
      return <button className="action focus-on-light" key={act.action} onClick={() => this.clickAction(act.action, row.id)} type="button">{act.name}</button>
    })

    return (<div className="actions-menu-container" ref={node => this.selectedActions = node}>
      <div className="actions-menu">
        {rowActions}
      </div>
    </div>)
  }

  renderClosedActions(row) {
    return (<button
      className="quill-button actions-button focus-on-light"
      onClick={() => this.setState({ rowWithActionsOpen: row.id })}
      type="button"
    >
      <img alt="ellipses" src={moreHorizontalSrc} />
    </button>)
  }

  renderHeader(header) {
    if (header.isActions) { return this.renderActionsHeader(header) }

    const { sortAscending, sortAttribute, } = this.state
    let sortArrow, onClick
    let tabIndex = -1
    let className = `${dataTableHeaderClassName} ${header.headerClassName}`
    let style: React.CSSProperties = { width: `${header.width}`, minWidth: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}` as CSS.TextAlignProperty }
    if (header.isSortable) {
      const sortDirection = sortAscending ? ascending : descending
      onClick = () => this.changeSort(header.sortAttribute || header.attribute)
      sortArrow = [header.attribute, header.sortAttribute].includes(sortAttribute) ? <img alt="arrow" className={`sort-arrow ${sortDirection}`} src={arrowSrc} /> : null
      className+= ' sortable'
      tabIndex = 0
    }
    return (<button
      className={className}
      onClick={onClick}
      style={style as any}
      tabIndex={tabIndex}
      type="button"
    >
      {header.name}
      {sortArrow}
    </button>)
  }

  renderHeaders() {
    const { headers, } = this.props
    const headerItems = headers.map(header => this.renderHeader(header))
    return <div className="data-table-headers">{this.renderHeaderCheckbox()}{this.renderHeaderForOrder()}{headerItems}{this.renderHeaderForRemoval()}</div>
  }

  renderRowSection(row, header) {
    if (header.isActions) { return this.renderActions(row) }
    const { averageFontWidth, } = this.props
    let style: React.CSSProperties = { width: `${header.width}`, minWidth: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}` as CSS.TextAlignProperty }
    const sectionText = row[header.attribute]
    const headerWidthNumber = Number(header.width.slice(0, -2))
    const dataTableRowSectionClassName = `data-table-row-section ${header.rowSectionClassName}`
    const key = `${header.attribute}-${row.id || sectionText}`

    let linkDisplayText
    if (sectionText && sectionText.type === 'a' && sectionText.props.children && sectionText.props.children[1] && sectionText.props.children[1].props) {
      linkDisplayText = sectionText.props.children[1].props.children
    }

    const rowDisplayText = linkDisplayText || sectionText
    if (!header.noTooltip && (String(rowDisplayText).length * averageFontWidth) >= headerWidthNumber) {
      return (<Tooltip
        key={key}
        tooltipText={rowDisplayText}
        tooltipTriggerStyle={style}
        tooltipTriggerText={sectionText}
        tooltipTriggerTextClass={dataTableRowSectionClassName}
        tooltipTriggerTextStyle={style}
      />)
    } else {
      return (<span
        className={dataTableRowSectionClassName}
        key={key}
        style={style as any}
      >
        {sectionText}
      </span>)
    }
  }

  renderRowDragHandle(row) {
    const { isReorderable, } = this.props
    if (!isReorderable) { return }

    const DragHandle = SortableHandle(() => <img alt="Reorder icon" className="reorder-icon focus-on-light" src={reorderSrc} tabIndex={0} />);
    return <span className='reorder-section data-table-row-section'><DragHandle /></span>
  }

  renderRow(row) {
    const { headers, } = this.props
    const rowClassName = `data-table-row ${row.checked ? 'checked' : ''} ${row.className || ''}`
    const rowSections = headers.map(header => this.renderRowSection(row, header))
    const rowContent = <React.Fragment>{this.renderRowCheckbox(row)}{this.renderRowDragHandle(row)}{rowSections}{this.renderRowRemoveIcon(row)}</React.Fragment>

    if (row.link) {
      return <a className={rowClassName} href={row.link} key={String(row.id)}>{rowContent}</a>
    }

    return <div className={rowClassName} key={String(row.id)}>{rowContent}</div>
  }

  renderRows() {
    const { isReorderable, reorderCallback, } = this.props
    const rows = this.sortRows().map(row => this.renderRow(row))
    if (isReorderable) {
      return <div className="data-table-body reorderable"><SortableList data={rows} helperClass="sortable-data-table-row" sortCallback={reorderCallback} useDragHandle={true} /></div>
    }
    return <div className="data-table-body">{rows}</div>
  }

  render() {
    const { className, } = this.props
    return (<div className={`data-table ${className}`}>
      {this.renderHeaders()}
      {this.renderRows()}
    </div>)
  }

}

DataTable.defaultProps = {
  averageFontWidth: 7
}
