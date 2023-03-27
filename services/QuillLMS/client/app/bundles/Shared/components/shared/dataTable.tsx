import * as CSS from 'csstype';
import * as React from 'react';
import { SortableHandle } from 'react-sortable-hoc';

import { SortableList } from './sortableList';
import { Tooltip } from './tooltip';

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
const reorderSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/reorder.svg`

interface DataTableRow {
  id: number|string;
  className?: string;
  actions?: Array<{name: string, action: Function}>
  [key:string]: any;
}

interface DataTableHeader {
  width: string;
  name: string | React.ReactElement;
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

  componentDidMount() {
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

    if (attributeName === 'username') { return left }

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
      return <th aria-label="Disabled checkbox" className={`quill-checkbox disabled ${dataTableHeaderClassName}`} scope="col" />
    }

    const allChecked = rows.every(row => row.checked)
    if (allChecked) {
      return (
        <th className={dataTableHeaderClassName} scope="col">
          <button className="quill-checkbox selected" onClick={uncheckAllRows} type="button">
            <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
          </button>
        </th>
      )
    }

    const anyChecked = rows.some(row => row.checked)
    if (anyChecked) {
      return (
        <th className={dataTableHeaderClassName} scope="col">
          <button className="quill-checkbox selected" onClick={uncheckAllRows} type="button">
            <img alt="Checked checkbox" src={indeterminateSrc} />
          </button>
        </th>
      )
    }

    return (
      <th className={dataTableHeaderClassName} scope="col">
        <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={checkAllRows} type="button" />
      </th>
    )
  }

  renderHeaderForRemoval() {
    const { showRemoveIcon } = this.props
    if (!showRemoveIcon) { return null }

    return <th aria-label="Header for remove column" className={dataTableHeaderClassName} scope="col" />
  }

  renderHeaderForOrder() {
    const { isReorderable } = this.props
    if (!isReorderable) { return }

    return <th className={`${dataTableHeaderClassName} reorder-header`} scope="col">Order</th>
  }

  renderActionsHeader(header) {
    const { showActions } = this.props
    if (!showActions) { return null }

    return <th className={`${dataTableHeaderClassName} actions-header`} scope="col">{header.name || 'Actions'}</th>
  }

  renderRowCheckbox(row) {
    const { showCheckboxes, checkRow, uncheckRow} = this.props

    if (!showCheckboxes) { return null }

    if (row.checked) { return <td><button className="quill-checkbox selected data-table-row-section" onClick={() => uncheckRow(row.id)} type="button"><img alt="check" src={smallWhiteCheckSrc} /></button></td> }

    if (row.checkDisabled) { return <td className="quill-checkbox disabled data-table-row-section" /> }

    return <td><button aria-label="Unchecked checkbox" className="quill-checkbox unselected data-table-row-section" onClick={() => checkRow(row.id)} type="button" /></td>
  }

  renderRowRemoveIcon(row) {
    const { showRemoveIcon, removeRow, } = this.props

    if (!showRemoveIcon) { return }

    if (row.removable) {
      return <td><button className="removable data-table-row-section focus-on-light" id={`remove-button-${row.id}`} onClick={() => removeRow(row.id)} type="button"><img alt="x" src={removeSrc} /></button></td>
    }

    return <td className='removable data-table-row-section' />
  }

  renderActions(row) {
    if (!row.actions) { return }

    const { rowWithActionsOpen } = this.state
    const actionsIsOpen = rowWithActionsOpen === row.id;

    return (
      <td className="data-table-row-section actions-section">
        {actionsIsOpen ? this.renderOpenActions(row) : this.renderClosedActions(row)}
      </td>
    )
  }

  renderOpenActions(row) {
    const rowActions = row.actions.map(act => {
      if (act.element) { return act.element }
      return <button className="action focus-on-light" key={act.action} onClick={() => this.clickAction(act.action, row.id)} type="button">{act.name}</button>
    })

    return (
      <div className="actions-menu-container" ref={node => this.selectedActions = node}>
        <div className="actions-menu">
          {rowActions}
        </div>
      </div>
    )
  }

  renderClosedActions(row) {
    return (
      <button
        className="quill-button actions-button focus-on-light"
        onClick={() => this.setState({ rowWithActionsOpen: row.id })}
        type="button"
      >
        <img alt="ellipses" src={moreHorizontalSrc} />
      </button>
    )
  }

  renderHeader(header) {
    if (header.isActions) { return this.renderActionsHeader(header) }

    const { sortAscending, sortAttribute, } = this.state
    let className = `${dataTableHeaderClassName} ${header.headerClassName}`
    let style: React.CSSProperties = { width: `${header.width}`, minWidth: `${header.width}`, textAlign: `${this.attributeAlignment(header.attribute)}` as CSS.TextAlignProperty }
    let headerContent = header.name
    if (header.isSortable) {
      const sortDirection = sortAscending ? ascending : descending
      const onClick = () => this.changeSort(header.sortAttribute || header.attribute)
      const sortArrow = [header.attribute, header.sortAttribute].includes(sortAttribute) ? <img alt="arrow" className={`sort-arrow ${sortDirection}`} src={arrowSrc} /> : null
      className+= ' sortable'
      headerContent = <button className="interactive-wrapper focus-on-light" onClick={onClick} type="button">{header.name}{sortArrow}</button>
    }

    return (
      <th
        className={className}
        scope="col"
        style={style as any}
      >
        {headerContent}
      </th>
    )
  }

  renderHeaders() {
    const { headers, } = this.props
    const headerItems = headers.map(header => this.renderHeader(header))
    return <tr className="data-table-headers">{this.renderHeaderCheckbox()}{this.renderHeaderForOrder()}{headerItems}{this.renderHeaderForRemoval()}</tr>
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
    } else if(sectionText && sectionText.type && sectionText.type.displayName === 'Link' && sectionText.props && sectionText.props.children) {
      linkDisplayText = sectionText.props.children
    }

    const rowDisplayText = linkDisplayText || sectionText

    if (!header.noTooltip && (String(rowDisplayText).length * averageFontWidth) >= headerWidthNumber) {
      return (
        <td>
          <Tooltip
            key={key}
            tooltipText={rowDisplayText}
            tooltipTriggerStyle={style}
            tooltipTriggerText={sectionText}
            tooltipTriggerTextClass={dataTableRowSectionClassName}
            tooltipTriggerTextStyle={style}
          />
        </td>
      )
    } else {
      return (
        <td
          className={dataTableRowSectionClassName}
          key={key}
          style={style as any}
        >
          {sectionText}
        </td>
      )
    }
  }

  renderRowDragHandle(row) {
    const { isReorderable, } = this.props
    if (!isReorderable) { return }

    // using a div as the outer element instead of a button here because something about default button behavior overrides the keypress handling by sortablehandle
    const DragHandle = SortableHandle(() => <div className="focus-on-light" role="button" tabIndex={0}><img alt="Reorder icon" className="reorder-icon" src={reorderSrc} /></div>);
    return <span className='reorder-section data-table-row-section'><DragHandle /></span>
  }

  renderRow(row) {
    const { headers, } = this.props
    const rowClassName = `data-table-row ${row.checked ? 'checked' : ''} ${row.className || ''}`
    const rowSections = headers.map(header => this.renderRowSection(row, header))
    const rowContent = <React.Fragment>{this.renderRowCheckbox(row)}{this.renderRowDragHandle(row)}{rowSections}{this.renderRowRemoveIcon(row)}</React.Fragment>

    if (row.link) {
      return <tr><a className={rowClassName} href={row.link} key={String(row.id)}>{rowContent}</a></tr>
    }

    return <tr className={rowClassName} key={String(row.id)}>{rowContent}</tr>
  }

  renderRows() {
    const { isReorderable, reorderCallback, } = this.props
    const rows = this.sortRows().map(row => this.renderRow(row))
    if (isReorderable) {
      return <tbody className="data-table-body reorderable"><SortableList data={rows} helperClass="sortable-data-table-row" sortCallback={reorderCallback} useDragHandle={true} /></tbody>
    }
    return <tbody className="data-table-body">{rows}</tbody>
  }

  render() {
    const { className, } = this.props
    return (
      <table className={`data-table ${className}`}>
        {this.renderHeaders()}
        {this.renderRows()}
      </table>
    )
  }

}

DataTable.defaultProps = {
  averageFontWidth: 7
}
