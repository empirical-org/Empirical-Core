import * as React from 'react'

import { Tooltip } from '../../../../Shared/index'

const renameSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-rename.svg`
const shareActivitySrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-share.svg`
const deleteActivityPackSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/pages/my_activities/delete_activity_pack_icon.svg`
const closeActivityPackSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/pages/my_activities/close_activity_pack_icon.svg`
const openActivityPackSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/pages/my_activities/open_activity_pack_icon.svg`

const ActivityPackUpdateButtons = ({
  handleClickShareActivityPack,
  handleClickShowRename,
  handleClickShowRemove,
  handleClickShowReopenUnit,
  handleClickShowCloseUnit,
  isOpen
}) => {
  const shareButton = (
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShareActivityPack} type="button">
      <img alt="Share icon" src={shareActivitySrc} />
      <span>Share activity pack</span>
    </button>
  )

  const renameButton = (
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowRename} type="button">
      <img alt="Rename icon" src={renameSrc} />
      <span>Rename activity pack</span>
    </button>
  )

  const closeButton = (
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowCloseUnit} type="button">
      <img alt="" src={closeActivityPackSrc} />
      <span>Close activity pack</span>
    </button>
  )

  const closeElement = (
    <Tooltip
      tooltipText="Closing an activity pack hides it from students. You can still access it in your reports."
      tooltipTriggerText={closeButton}
    />
  )

  const reopenButton = (
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowReopenUnit} type="button">
      <img alt="" src={openActivityPackSrc} />
      <span>Reopen activity pack</span>
    </button>
  )

  const reopenElement = (
    <Tooltip
      tooltipText="Reopening an activity pack makes it visible to students."
      tooltipTriggerText={reopenButton}
    />
  )

  const deleteButton = (
    <button className="interactive-wrapper focus-on-light" onClick={handleClickShowRemove} type="button">
      <img alt="" src={deleteActivityPackSrc} />
      <span>Delete activity pack</span>
    </button>
  )

  const deleteElement = (
    <Tooltip
      tooltipText="Deleting an activity pack is permanent and removes it from your reports."
      tooltipTriggerText={deleteButton}
    />
  )

  return (
    <div className="right-side">
      {isOpen && shareButton}
      {renameButton}
      {isOpen ? closeElement : reopenElement}
      {deleteElement}
    </div>
  )
}

export default ActivityPackUpdateButtons
