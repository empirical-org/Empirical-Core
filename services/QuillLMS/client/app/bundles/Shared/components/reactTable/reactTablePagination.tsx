// forked from https://github.com/TanStack/react-table/blob/v6/src/pagination.js 4/12/22

import * as React from 'react'

const defaultButton = props => (
  <button type="button" {...props} className="-btn">
    {props.children}
  </button>
)

export default class ReactTablePagination extends React.Component {
  static defaultProps = {
    NextComponent: defaultButton,
    nextText: 'Next',
    ofText: 'of',
    pageText: 'Page',
    PreviousComponent: defaultButton,
    previousText: 'Previous',
    renderCurrentPage: page => <span className="-currentPage">{page + 1}</span>,
    renderPageJump: ({
      onChange, value, onBlur, onKeyPress, inputType, pageJumpText,
    }) => (
      <div className="-pageJump">
        <input
          aria-label={pageJumpText}
          onBlur={onBlur}
          onChange={onChange}
          onKeyPress={onKeyPress}
          type={inputType}
          value={value}
        />
      </div>
    ),
    renderPageSizeOptions: ({
      pageSize,
      pageSizeOptions,
      rowsSelectorText,
      onPageSizeChange,
      rowsText,
    }) => (
      <span className="select-wrap -pageSizeOptions">
        <select
          aria-label={rowsSelectorText}
          onChange={e => onPageSizeChange(Number(e.target.value))}
          value={pageSize}
        >
          {pageSizeOptions.map((option, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <option key={i} value={option}>
              {`${option} ${rowsText}`}
            </option>
          ))}
        </select>
      </span>
    ),
    renderTotalPagesCount: pages => <span className="-totalPages">{pages || 1}</span>,
    showPageJump: true,
  }

  constructor (props) {
    super(props)

    this.getSafePage = this.getSafePage.bind(this)
    this.changePage = this.changePage.bind(this)
    this.applyPage = this.applyPage.bind(this)

    this.state = {
      page: props.page,
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.page !== this.props.page || prevState.page !== this.state.page) {
      // this is probably safe because we only update when old/new props/state.page are different
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        page: this.props.page,
      })
    }
    /* when the last page from new props is smaller
     than the current page in the page box,
     the current page needs to be the last page. */
    if (this.props.pages !== prevProps.pages && this.props.pages <= this.state.page) {
      this.setState({
        page: this.props.pages - 1,
      })
    }
  }

  getSafePage (page) {
    if (Number.isNaN(page)) {
      page = this.props.page
    }
    const safePage = Math.min(Math.max(page, 0), this.props.pages - 1)
    return safePage
  }

  changePage (page) {
    page = this.getSafePage(page)
    this.setState({ page })
    if (this.props.page !== page) {
      this.props.onPageChange(page)
    }
  }

  applyPage (e) {
    if (e) {
      e.preventDefault()
    }
    const page = this.state.page
    this.changePage(page === '' ? this.props.page : page)
  }

  getPageJumpProperties () {
    return {
      onKeyPress: e => {
        if (e.which === 13 || e.keyCode === 13) {
          this.applyPage()
        }
      },
      onBlur: this.applyPage,
      value: this.state.page === '' ? '' : this.state.page + 1,
      onChange: e => {
        const val = e.target.value
        const page = val - 1
        this.changePage(page)
      },
      inputType: this.state.page === '' ? 'text' : 'number',
      pageJumpText: this.props.pageJumpText,
    }
  }

  render () {
    const {
      pages,
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      PreviousComponent,
      NextComponent,
      renderPageJump,
      renderCurrentPage,
      renderTotalPagesCount,
      renderPageSizeOptions,
      previousText,
      pageText,
      style,
      rowsSelectorText,
      rowsText,
      ofText,
      pages,
      nextText,
    } = this.props

    return (
      <div className={`${className} -pagination`} style={style}>
        <div className="-previous">
          <PreviousComponent
            disabled={!canPrevious || this.state.page < 1}
            onClick={() => {
              if (!canPrevious) return
              this.changePage(page - 1)
            }}
          >
            {previousText}
          </PreviousComponent>
        </div>
        <div className="-center">
          <span className="-pageInfo">
            {pageText}{' '}
            {showPageJump ? renderPageJump(this.getPageJumpProperties()) : renderCurrentPage(page)}{' '}
            {ofText} {renderTotalPagesCount(pages)}
          </span>
          {showPageSizeOptions &&
          renderPageSizeOptions({
            pageSize,
            rowsSelectorText,
            pageSizeOptions,
            onPageSizeChange,
            rowsText,
          })}
        </div>
        <div className="-next">
          <NextComponent
            disabled={!canNext || this.state.page >= pages - 1}
            onClick={() => {
              if (!canNext) return
              this.changePage(page + 1)
            }}
          >
            {nextText}
          </NextComponent>
        </div>
      </div>
    )
  }
}
