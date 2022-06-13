import * as React from 'react';

import { Input, DropdownInput } from '../../../../Shared';
import { renderErrorsContainer, renderIDorUID } from '../../../helpers/evidence/renderHelpers';
import { PARENT_ACTIVITY_ID, TITLE, NOTES, flagOptions } from '../../../../../constants/evidence';

export const UpperFormSection = ({
  activity,
  activityTitle,
  activityNotes,
  activityFlag,
  errors,
  formErrorsPresent,
  handleSetActivityFlag,
  handleSetActivityNotes,
  handleSetActivityTitle,
  handleSubmitActivity,
  parentActivityId,
  requestErrors,
  showErrorsContainer
}) => {
  return(
    <React.Fragment>
      <Input
        className="title-input"
        error={errors[TITLE]}
        handleChange={handleSetActivityTitle}
        label="Activity Name"
        value={activityTitle}
      />
      <Input
        className="name-input"
        error={errors[NOTES]}
        handleChange={handleSetActivityNotes}
        label="Internal Name"
        value={activityNotes}
      />
      <div className="button-and-id-container">
        {parentActivityId && renderIDorUID(parentActivityId, PARENT_ACTIVITY_ID)}
        {activity.id && <a className="quill-button fun secondary outlined focus-on-light" href={`/evidence/#/play?uid=${activity.id}&skipToPrompts=true`} rel="noopener noreferrer" target="_blank">Play Test Activity</a>}
        {activity.id && <a className="quill-button fun secondary outlined focus-on-light" href={`/evidence/#/play?uid=${activity.id}`} rel="noopener noreferrer" target="_blank">Play Student Activity</a>}
        <button className="quill-button fun primary contained focus-on-light" id="activity-submit-button" onClick={handleSubmitActivity} type="submit">Save</button>
      </div>
      <DropdownInput
        className="flag-input"
        handleChange={handleSetActivityFlag}
        label="Activity Flag"
        options={flagOptions}
        value={flagOptions.find(opt => opt.value === activityFlag)}
      />
      {showErrorsContainer && renderErrorsContainer(formErrorsPresent, requestErrors)}
    </React.Fragment>
  );
}

export default UpperFormSection;
