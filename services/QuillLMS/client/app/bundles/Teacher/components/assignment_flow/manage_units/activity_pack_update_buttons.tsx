import * as React from 'react'

const renameSrc = `${process.env.CDN_URL}/images/icons/icons-rename.svg`
const removeInCircleSrc = `${process.env.CDN_URL}/images/icons/remove-in-circle.svg`

const ActivityPackUpdateButtons = ({
  handleClickShowRename,
  handleClickShowRemove
}) => (
  <div className="right-side">
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowRename} type="button">
      <img alt="Rename icon" src={renameSrc} />
      <span>Rename activity pack</span>
    </button>
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowRemove} type="button">
      <img alt="Remove icon" src={removeInCircleSrc} />
      <span>Delete activity pack</span>
    </button>
  </div>
)

export default ActivityPackUpdateButtons
