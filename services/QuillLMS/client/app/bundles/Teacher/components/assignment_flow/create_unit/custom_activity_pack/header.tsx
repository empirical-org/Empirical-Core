import * as React from 'react';
import { SortableHandle, } from 'react-sortable-hoc';

import { Activity } from './interfaces'
import ActivityRow from './activity_row'

import SortableList from '../../../shared/sortableList'

const reorderSrc = `${process.env.CDN_URL}/images/icons/reorder.svg`

interface AssignButtonProps {
  selectedActivities: Activity[],
  handleClickContinue: (event: any) => void
}

interface HeaderProps {
  handleClickContinue: (event: any) => void,
  selectedActivities: Activity[],
  setSelectedActivities: (selectedActivities: Activity[]) => void,
  toggleActivitySelection: (activity: Activity, isSelected: boolean) => void
}

const AssignButton = ({ selectedActivities, handleClickContinue, }: AssignButtonProps) => {
  let buttonClass = 'quill-button contained primary medium focus-on-light';
  let action = handleClickContinue
  if (!(selectedActivities && selectedActivities.length)) {
    buttonClass += ' disabled';
    action = null
  }
  return <button className={buttonClass} onClick={action} type="button">Assign</button>
}

const Header = ({ handleClickContinue, selectedActivities, setSelectedActivities, toggleActivitySelection, }: HeaderProps) => {
  const [showActivities, setShowActivities] = React.useState(false)

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
      const DragHandle = SortableHandle(() => <img alt="Reorder icon" className="reorder-icon focus-on-light" src={reorderSrc} tabIndex={0} />);
      return (<section className={className} key={a.id}>
        <DragHandle />
        <ActivityRow activity={a} isSelected={true} showCheckbox={false} showRemoveButton={true} toggleActivitySelection={toggleActivitySelection} />
      </section>)
    })
    selectedActivitySection = <SortableList data={selectedActivityRows} helperClass="sortable-selected-activity-row" sortCallback={sortCallback} useDragHandle={true} />
  }

  return (<header className={className}>
    <div className="header-content">
      {headerContent}
      <AssignButton handleClickContinue={handleClickContinue} selectedActivities={selectedActivities} />
    </div>
    {selectedActivitySection}
  </header>)
}

export default Header
