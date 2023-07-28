import * as React from 'react';

import { requestPut } from '../../../../modules/request/index';
import pusherInitializer from '../../../../modules/pusherInitializer'
import ButtonLoadingIndicator from '../shared/button_loading_indicator';
import { providerLookup } from './providerHelpers'

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface ImportProviderClassroomStudentsModalProps {
  classroom: any;
  close: () => void;
  onSuccess: (snackbarCopy: string) => void;
  provider: string
  user: any
}

const ImportProviderClassroomStudentsModal = ({ close, classroom, onSuccess, provider, user }: ImportProviderClassroomStudentsModalProps) => {
  const providerTitle = providerLookup[provider].title
  const providerClassName = providerLookup[provider].className
  const importStudentsPath = `/${providerClassName}_integration/teachers/import_students`
  const importStudentsEventName = `${providerClassName}-classroom-students-imported`

  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);

  const handleImportStudents = () => {
    setWaiting(true)

    pusherInitializer(user.id, importStudentsEventName, () => onSuccess('Class re-synced'))
    requestPut(importStudentsPath, { classroom_id: classroom.id })
  }

  const handleToggleCheckbox = () => {
    setTermsAccepted(!termsAccepted)
  }

  const submitButtonClass = () => {
    const buttonClass = 'quill-button contained primary medium';

    if (termsAccepted) { return buttonClass }

    return `${buttonClass} disabled`
  }

  const renderCheckbox = () => {
    if (termsAccepted) {
      return (
        <div className="quill-checkbox selected" onClick={handleToggleCheckbox}>
          <img alt="check" src={smallWhiteCheckSrc} />
        </div>
      )
    } else {
      return <div className="quill-checkbox unselected" onClick={handleToggleCheckbox} />
    }
  }

  const renderCheckboxes = () => {
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {renderCheckbox()}
          <span>
            I understand that newly imported students have access to the activities that have already been assigned to the entire class.
          </span>
        </div>
      </div>
    )
  }

  const renderImportButton = () => {
    if (waiting) {
      return (
        <button className={submitButtonClass()} type="button">
          <ButtonLoadingIndicator />
        </button>
      )
    } else {
      return (
        <button className={submitButtonClass()} onClick={handleImportStudents} type="button">
          Import students
        </button>
      )
    }
  }

  return (
    <div className="modal-container import-provider-classroom-students-modal-container">
      <div className="modal-background" />
      <div className="import-provider-classroom-students-modal quill-modal modal-body">
        <div>
          <h3 className="title">Import students from {providerTitle}</h3>
        </div>
        <p>You are about to import students from the class {classroom.name}.</p>
        {renderCheckboxes()}
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={close} type="button">
          Cancel
          </button>
          {renderImportButton()}
        </div>
      </div>
    </div>
  )
}

export default ImportProviderClassroomStudentsModal
