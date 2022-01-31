import * as React from 'react';

import { sortOptions } from './shared'

const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

interface MobileSortMenuProps {
  showMobileSortMenu: boolean,
  setShowMobileSortMenu: (show: boolean) => void,
  setSort: (sort: string) => void
}

const MobileSortMenu = ({
  showMobileSortMenu,
  setShowMobileSortMenu,
  setSort
}: MobileSortMenuProps) => {
  if (!showMobileSortMenu) { return <span /> }
  function closeMobileSortMenu() { setShowMobileSortMenu(false) }

  function handleClickSortOption(e) {
    setSort(e.target.value)
    closeMobileSortMenu()
  }

  const options = sortOptions.map(opt => <button id={opt.key} key={opt.key} onClick={handleClickSortOption} type="button" value={opt.value}>{opt.label}</button>)

  return (
    <section className="mobile-sort-menu">
      <div className="top-section">
        <button className="interactive-wrapper focus-on-light" onClick={closeMobileSortMenu} type="button">
          <img alt="Close icon" src={closeIconSrc} />
        Close
        </button>
      </div>
      <div className="sort-options">
        <h2>Sort by</h2>
        {options}
      </div>
    </section>
  )
}

export default MobileSortMenu
