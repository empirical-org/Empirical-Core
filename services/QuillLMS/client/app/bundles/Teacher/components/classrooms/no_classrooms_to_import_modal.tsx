import * as React from 'react';
const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty_class.svg`

import { providerConfigLookup } from './providerHelpers'

import { Tooltip, helpIcon, } from '../../../Shared/index'

interface NoClassroomsToImportModalProps {
  allProviderClassrooms: Array<any>;
  close: () => void;
  provider: 'Canvas' | 'Clever' | 'Google';
}

const AVERAGE_TOOLTIP_ITEM_HEIGHT = 40 // update when CSS changes -- currently 22px line height + 16px <br />, plus a little more so the tooltip doesn't actually touch the bottom of the screen

const NoClassroomsToImportModal = ({ close, provider, allProviderClassrooms }: NoClassroomsToImportModalProps) => {
  const providerTitle = providerConfigLookup[provider].title

  const unownedClassrooms = allProviderClassrooms.filter(classroom => !classroom.is_owner)
  const importedAndArchivedClassrooms = allProviderClassrooms.filter(classroom => classroom.archived && classroom.alreadyImported)

  let notSeeingClassesSection

  if (unownedClassrooms.length || importedAndArchivedClassrooms.length) {
    const importedAndArchivedClassroomsSection = importedAndArchivedClassrooms.length ? (
      <p>
        You have&nbsp;<b>{importedAndArchivedClassrooms.length} synced Google Classroom{importedAndArchivedClassrooms.length > 1 ? 's' : ''} <a href="/teachers/classrooms/archived">archived in Quill</a></b>
        <Tooltip
          averageItemHeight={AVERAGE_TOOLTIP_ITEM_HEIGHT}
          tooltipText={importedAndArchivedClassrooms.map(c => c.name)}
          tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
        />
      </p>
    ) : null

    const unownedClassroomsSection = unownedClassrooms.length ? (
      <p>
        There {unownedClassrooms.length > 1 ? 'are' : 'is'}&nbsp;<b>{unownedClassrooms.length} Google Classroom{unownedClassrooms.length > 1 ? 's' : ''}</b>&nbsp;you have access to, but don&#39;t own
        <Tooltip
          averageItemHeight={AVERAGE_TOOLTIP_ITEM_HEIGHT}
          tooltipText={unownedClassrooms.map(c => c.name)}
          tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
        />
      </p>
    ) : null

    notSeeingClassesSection = (
      <div className="not-seeing-classes-section">
        <h4>Not seeing classes?</h4>
        {importedAndArchivedClassroomsSection}
        {unownedClassroomsSection}
      </div>
    )

  }

  return (
    <div className='modal-container provider-classrooms-empty-modal-container'>
      <div className='modal-background' />
      <div className='provider-classrooms-empty-modal quill-modal modal-body'>
        <div>
          <h3 className="title">Create classrooms in {providerTitle}</h3>
        </div>
        <div className="explanation">
          <img alt="empty class" src={emptyClassSrc} />
          <p>No classes are available to import yet. Go to {providerTitle} and create classes to import them into Quill.</p>
        </div>
        {notSeeingClassesSection}
        <div className="form-buttons">
          <button className="quill-button contained primary medium" onClick={close} type="button">Close</button>
        </div>
      </div>
    </div>
  )
}

export default NoClassroomsToImportModal
