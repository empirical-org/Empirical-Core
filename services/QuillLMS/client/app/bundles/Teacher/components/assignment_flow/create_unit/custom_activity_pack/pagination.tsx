import * as React from 'react';

import { Activity } from './interfaces'
import { calculateNumberOfPages, lowerBound, upperBound, } from './sharedFunctions'

const expandSrc = `${process.env.CDN_URL}/images/shared/expand.svg`

interface PaginationProps {
  activities: Activity[],
  currentPage: number,
  setCurrentPage: (currentPage: number) => void
}

interface PageButtonProps {
  currentPage: number,
  buttonNumber: number,
  setCurrentPage: (pageNumber: number) => void
}

const PageButton = ({ currentPage, buttonNumber, setCurrentPage, }: PageButtonProps) => {
  let className = 'pagination-button focus-on-light'
  className += currentPage === buttonNumber ? ' active' : ''

  function handleClick() { setCurrentPage(buttonNumber) }

  return <button className={className} onClick={handleClick} type="button">{buttonNumber}</button>
}

const Pagination = ({ activities, currentPage, setCurrentPage, }: PaginationProps) => {
  const numberOfPages = calculateNumberOfPages(activities)
  if (numberOfPages < 2) { return <span /> }

  function handleLeftArrowClick() { setCurrentPage(currentPage - 1) }
  function handleRightArrowClick() { setCurrentPage(currentPage + 1) }

  const leftArrow = currentPage > 1 ? <button className="pagination-button focus-on-light left-arrow" onClick={handleLeftArrowClick} type="button"><img alt="Arrow pointing left" src={expandSrc} /></button> : null
  const rightArrow = currentPage < numberOfPages ? <button className="pagination-button focus-on-light right-arrow" onClick={handleRightArrowClick} type="button"><img alt="Arrow pointing right" src={expandSrc} /></button> : null

  const pageButtons = []
  let lastWasEllipses = false
  for (let i = 1; i <= numberOfPages; i++) {
    const pageButton = <PageButton buttonNumber={i} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    const thereAreFewerThanEightPages = numberOfPages < 8
    const firstOrLastPage = [1, numberOfPages].includes(i)
    const currentPageIsOneOfTheFirstFivePages = currentPage < 5 && i < 6
    const currentPageIsOneOfTheLastFivePages = currentPage > numberOfPages - 4 && i > numberOfPages - 5
    const adjacentToCurrentPage = [currentPage - 1, currentPage, currentPage + 1].includes(i)
    if (thereAreFewerThanEightPages || firstOrLastPage || adjacentToCurrentPage || currentPageIsOneOfTheFirstFivePages || currentPageIsOneOfTheLastFivePages) {
      pageButtons.push(pageButton)
      lastWasEllipses = false
    } else if (!lastWasEllipses) {
      pageButtons.push(<div className="pagination-button ellipses-button">...</div>)
      lastWasEllipses = true
    }
  }

  const paginationRow = (<div className="pagination-row">
    {leftArrow}
    {pageButtons}
    {rightArrow}
  </div>)

  const lowestDisplayedNumber = lowerBound(currentPage) + 1
  const highestDisplayedNumber = upperBound(currentPage) > activities.length ? activities.length : upperBound(currentPage)

  return (<section className="pagination-section">
    {paginationRow}
    <p>{lowestDisplayedNumber}-{highestDisplayedNumber} of {activities.length}</p>
  </section>)
}

export default Pagination
