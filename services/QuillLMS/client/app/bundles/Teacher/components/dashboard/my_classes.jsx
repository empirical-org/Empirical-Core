import React from 'react'
import * as moment from 'moment'

import ClassMini from './class_mini.jsx'
import AddOrSyncClassroomsMini from './add_or_sync_classrooms_mini.jsx'
import BulkArchiveClassesBanner from '../shared/bulk_archive_classes_banner'

const MyClasses = ({ classList, user, onSuccess, }) => {
  const minis = classList.map(classObj => <ClassMini classObj={classObj} key={classObj.code} />)

  return (
    <div className='dashboard-section-container'>
      <h3 className='dashboard-header'>My Classes</h3>
      <BulkArchiveClassesBanner classes={classList} onSuccess={onSuccess} />
      <div className='row'>
        {minis}
        <AddOrSyncClassroomsMini user={user} />
      </div>
    </div>
  );
}

export default MyClasses
