import * as React from 'react'

import { smallWhiteCheckIcon, indeterminateCheckIcon, } from '../../../Shared/index'

const AdminTable = ({ schoolAdmins, selectedAdminIds, setSelectedAdminIds, }) => {
  function selectAdmin(id) {
    const newAdminIds = Array.from(new Set(selectedAdminIds.concat([id])))
    setSelectedAdminIds(newAdminIds)
  }

  function unselectAdmin(id) {
    const newAdminIds = selectedAdminIds.filter(k => k !== id)
    setSelectedAdminIds(newAdminIds)
  }

  function selectAllAdminIds() { setSelectedAdminIds(schoolAdmins.map(sa => sa.id)) }

  function unselectAllAdminIds() { setSelectedAdminIds([]) }

  function renderCheckbox(admin) {
    const {id, name, } = admin

    if (selectedAdminIds.includes(id)) {
      return (
        <button aria-label={`Unselect ${name}`} className="focus-on-light quill-checkbox selected" onClick={() => unselectAdmin(id)} type="button">
          <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
        </button>
      )
    }

    return <button aria-label={`Select ${name}`} className="focus-on-light quill-checkbox unselected" onClick={() => selectAdmin(id)} type="button" />
  }

  function renderTopLevelCheckbox() {
    if (selectedAdminIds.length === 0) {
      return <button aria-label="Select all admins" className="focus-on-light quill-checkbox unselected" onClick={selectAllAdminIds} type="button" />
    } else if (schoolAdmins.length === selectedAdminIds.length) {
      return (
        <button aria-label="Unselect all admins" className="focus-on-light quill-checkbox selected" onClick={unselectAllAdminIds} type="button">
          <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
        </button>
      )
    } else {
      return (
        <button aria-label="Unselect all admins" className="focus-on-light quill-checkbox selected" onClick={unselectAllAdminIds} type="button">
          <img alt={indeterminateCheckIcon.alt} src={indeterminateCheckIcon.src} />
        </button>
      )
    }
  }

  return (
    <div className="admin-selection-table">
      <div className="admin-selection-row top-row">
        {renderTopLevelCheckbox()}
        <div>Select all</div>
      </div>
      {schoolAdmins.map(sa => (
        <div className="admin-selection-row" key={sa.id}>
          {renderCheckbox(sa)}
          <div>
            <span className="name">{sa.name}</span>
            <span className="email">{sa.email}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminTable
