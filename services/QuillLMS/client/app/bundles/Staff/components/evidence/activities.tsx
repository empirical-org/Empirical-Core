import * as React from "react";
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import Navigation from './navigation';
import ActivityInvalidHighlights from './activityInvalidHighlights'

import { DataTable, Error, FlagDropdown, Spinner, DropdownInput, } from '../../../Shared/index';
import { renderErrorsContainer, renderColorCodedAiType, } from "../../helpers/evidence/renderHelpers";
import { ActivityInterface } from '../../interfaces/evidenceInterfaces';
import { fetchActivities, } from '../../utils/evidence/activityAPIs';
import { AI_TYPES, } from '../../../../constants/evidence'
import { flagOptions, } from '../../../../constants/flagOptions'

const ALL_FLAGS = 'All Flags'
const ALL_TYPES = 'All Types'
const AI_TYPES_FOR_DROPDOWN = [ALL_TYPES].concat(AI_TYPES)

const Activities = ({ location, match }) => {

  // cache activity data for updates
  const { data: activitiesData } = useQuery("activities", fetchActivities);
  const [errors, setErrors] = React.useState<string[]>([])
  const [flag, setFlag] = React.useState<string>('alpha')
  const [aiType, setAIType] = React.useState<string>(ALL_TYPES)

  const filteredActivities = activitiesData?.activities?.filter(act => (flag === ALL_FLAGS || act.flag === flag) && (aiType === ALL_TYPES || act.ai_type === aiType)) || []

  const formattedRows = filteredActivities.map((activity: ActivityInterface) => {
    const { id, title, notes, ai_type, } = activity;
    const activityInternalNameLink = (<Link to={`/activities/${id}`}>{notes}</Link>);
    const activityLink = (<Link to={`/activities/${id}`}>{title}</Link>);
    const highlightLabel = (
      <ActivityInvalidHighlights activityId={id} />
    );
    return {
      id,
      title: activityLink,
      notes: activityInternalNameLink,
      valid_highlights: highlightLabel,
      ai_type: renderColorCodedAiType(ai_type),
      activityNameForSort: title,
      internalNameForSort: notes,
    }
  });

  function onFlagChange(e) { setFlag(e.value) }

  function onAITypeChange(e) { setAIType(e.value) }

  if(!activitiesData) {
    return(
      <React.Fragment>
        <Navigation location={location} match={match} />
        <div className="loading-spinner-container">
          <Spinner />
        </div>
      </React.Fragment>
    );
  }

  if(activitiesData.error) {
    return(
      <div className="error-container">
        <Error error={`${activitiesData.error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Activity ID", attribute:"id", width: "80px", rowSectionClassName: 'center-content', headerClassName: 'center-content', isSortable: true, },
    { name: "Type", attribute: "ai_type", width: "60px", noTooltip: true, rowSectionClassName: 'center-content', },
    { name: "Internal Name", attribute:"notes", width: "250px", isSortable: true, sortAttribute: 'internalNameForSort', },
    { name: "Activity Name", attribute:"title", width: "660px", isSortable: true, sortAttribute: 'activityNameForSort', },
    { name: "Highlight Validation", attribute:"valid_highlights", width: "60px", noTooltip: true, rowSectionClassName: 'center-content', headerClassName: 'center-content' }
  ];

  const aiTypeOptions = AI_TYPES_FOR_DROPDOWN.map(type => ({ value: type, label: type, }))
  const flagOptionsForDropdown = [{ label: ALL_FLAGS, value: ALL_FLAGS, }].concat(flagOptions)

  return(
    <React.Fragment>
      <Navigation location={location} match={match} />
      {errors && renderErrorsContainer(false, errors)}
      <div className="activities-container">
        <div className="dropdowns-container">
          <DropdownInput
            handleChange={onFlagChange}
            label='Flag'
            options={flagOptionsForDropdown}
            value={flagOptionsForDropdown.find(f => f.value === flag)}
          />
          <DropdownInput
            handleChange={onAITypeChange}
            label='AI Type'
            options={aiTypeOptions}
            value={aiTypeOptions.find(t => t.value === aiType)}
          />
        </div>
        <DataTable
          className="activities-table"
          defaultSortAttribute="id"
          defaultSortDirection='desc'
          headers={dataTableFields}
          rows={formattedRows ? formattedRows : []}
        />
      </div>
    </React.Fragment>
  );
}

export default Activities
