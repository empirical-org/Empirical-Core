import * as React from 'react'

import * as api from '../../modules/call_api';
import {
  Input,
} from '../../../../Shared/index'

const RenameModal = ({ onSuccess, closeModal, unitId, unitName, }) => {
  const [name, setName] = React.useState(unitName)
  const [errors, setErrors] = React.useState({})
  const [timesSubmitted, setTimesSubmitted] = React.useState(0)

  function handleNameChange(event) {
    setName(event.target.value)
  }

  function renameActivityPack() {
    api.changeActivityPackName(
      unitId,
      name,
      () => onSuccess('Activity pack renamed'),
      (response) => {
        setErrors(response.body.errors)
        setTimesSubmitted(timesSubmitted + 1)
      }
    )
  }

  let saveButtonClass = 'quill-button contained primary medium';
  if (!name.length || unitName === name) {
    saveButtonClass += ' disabled';
  }

  return (
    <div className="modal-container rename-activity-pack-modal-container">
      <div className="modal-background" />
      <div className="rename-activity-pack-modal quill-modal modal-body">
        <div>
          <h3 className="title">Rename your activity pack</h3>
        </div>
        <Input
          className="name"
          error={errors.name}
          handleChange={handleNameChange}
          label="Activity pack name"
          timesSubmitted={timesSubmitted}
          type="text"
          value={name}
        />
        <div className="form-buttons">
          <button className="quill-button outlined secondary medium" onClick={closeModal} type="button">Cancel</button>
          <button className={saveButtonClass} onClick={renameActivityPack} type="button">Save</button>
        </div>
      </div>
    </div>
  )
}

export default RenameModal
