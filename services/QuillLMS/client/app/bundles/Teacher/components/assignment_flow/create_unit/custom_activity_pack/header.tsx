import * as React from 'react';
import { SortableHandle, } from 'react-sortable-hoc';

import { Activity } from './interfaces'
import ActivityRow from './activity_row'

import { Snackbar, defaultSnackbarTimeout, SortableList, } from '../../../../../Shared/index'

const reorderSrc = `${process.env.CDN_URL}/images/icons/reorder.svg`

interface AssignButtonProps {
  selectedActivities: Activity[],
  handleClickContinue: (event: any) => void,
  saveButtonEnabled: boolean,
  isStaff: boolean
}

interface HeaderProps {
  handleClickContinue: (event: any) => void,
  selectedActivities: Activity[],
  setSelectedActivities: (selectedActivities: Activity[]) => void,
  toggleActivitySelection: (activity: Activity, isSelected: boolean) => void,
  saveButtonEnabled: boolean,
  isStaff: boolean,
  gradeLevelFilters: number[]
}

const AssignButton = ({ selectedActivities, handleClickContinue, saveButtonEnabled, isStaff, }: AssignButtonProps) => {
  let action = handleClickContinue
  let buttonClass = 'quill-button contained primary medium focus-on-light';
  const buttonCopy = isStaff ? 'Save' : 'Assign'
  if (isStaff) {
    if (!saveButtonEnabled) {
      buttonClass += ' disabled';
      action = null
    }
  } else if (!(selectedActivities && selectedActivities.length)) {
    buttonClass += ' disabled';
    action = null
  }
  return <button className={buttonClass} onClick={action} type="button">{buttonCopy}</button>
}

const Header = ({ handleClickContinue, selectedActivities, setSelectedActivities, toggleActivitySelection, saveButtonEnabled, isStaff, gradeLevelFilters, }: HeaderProps) => {
  const [showActivities, setShowActivities] = React.useState(false)
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  let action = handleClickContinue

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  React.useEffect(() => {
    if (!selectedActivities.length && showActivities) {
      setShowActivities(false)
    }
  }, [selectedActivities])

  function toggleShowActivities() { setShowActivities(!showActivities)}

  function sortCallback(sortInfo) {
    const newOrder = sortInfo.map(item => item.key);
    const newOrderedActivities = newOrder.map((key, i) => selectedActivities.find(a => a.id === Number(key)))
    setSelectedActivities(newOrderedActivities)
  }

  let headerContent = <h1>Choose activities</h1>
  let className = ''
  if (selectedActivities.length) {
    className = 'has-selected-activities'
    const text = selectedActivities.length > 1 ? `${selectedActivities.length} activities selected` : '1 activity selected'
    const buttonCopy = showActivities ? 'Hide' : 'View'
    const numberOfActivitiesForMobile = showActivities ? '' : <span className="number-of-activities">({selectedActivities.length})</span>
    headerContent = (<div>
      <h1>{text}</h1>
      <button className="focus-on-light quill-button medium secondary outlined" onClick={toggleShowActivities} type="button">{buttonCopy}{numberOfActivitiesForMobile}</button>
    </div>)
  }

  let selectedActivitySection

  if (showActivities) {
    const selectedActivityRows = selectedActivities.map((a, i) => {
      const className = `selected-activity-row ${i === selectedActivities.length - 1 && 'is-last'}`
      // using a div as the outer element instead of a button here because something about default button behavior overrides the keypress handling by sortablehandle
      const DragHandle = SortableHandle(() => <div className="focus-on-light" role="button" tabIndex={0}><img alt="Reorder icon" className="reorder-icon" src={reorderSrc} /></div>);
      return (
        <section className={className} key={a.id}>
          <DragHandle />
          <ActivityRow
            activity={a}
            gradeLevelFilters={gradeLevelFilters}
            isSelected={true}
            setShowSnackbar={setShowSnackbar}
            showCheckbox={false}
            showRemoveButton={true}
            toggleActivitySelection={toggleActivitySelection}
          />
        </section>
      )
    })
    selectedActivitySection = <SortableList data={selectedActivityRows} helperClass="sortable-selected-activity-row" sortCallback={sortCallback} useDragHandle={true} />
  }


  return (
    <header className={className}>
      <Snackbar text="Activity removed" visible={showSnackbar} />
      <div className="header-content">
        {headerContent}
        <AssignButton handleClickContinue={handleClickContinue} isStaff={isStaff} saveButtonEnabled={saveButtonEnabled} selectedActivities={selectedActivities} />
      </div>
      {selectedActivitySection}
    </header>
  )
}

export default Header
