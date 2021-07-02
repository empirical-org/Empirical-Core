import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import Navigation from './navigation';

import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { fetchActivities } from '../../utils/comprehension/activityAPIs';
import { DataTable, Error, Spinner } from '../../../Shared/index';
import { handleHasAppSetting } from "../../../Shared/utils/appSettingAPIs";

const Activities = ({ location, match }) => {

  // cache activity data for updates
  const { data: activitiesData } = useQuery("activities", fetchActivities);

  const [hasAppSetting, setHasAppSetting] = React.useState<boolean>(false);
  handleHasAppSetting(hasAppSetting, setHasAppSetting, 'foo')

  const formattedRows = activitiesData && activitiesData.activities && activitiesData.activities.map((activity: ActivityInterface) => {
    const { id, title} = activity;
    const activityLink = (<Link to={`/activities/${id}`}>{title}</Link>);
    return {
      id,
      title: activityLink
    }
  });

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
    { name: "Title", attribute:"title", width: "900px" }
  ];

  return(<React.Fragment>
    <Navigation location={location} match={match} />
    {hasAppSetting && <div>App setting is enabled.</div>}
    <div className="activities-container">
      <DataTable
        className="activities-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    </div>
  </React.Fragment>);
}

export default Activities
