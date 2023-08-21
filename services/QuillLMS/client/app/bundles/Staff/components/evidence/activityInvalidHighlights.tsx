import * as React from "react";
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { Spinner, } from '../../../Shared/index';
import { getCheckIcon, } from "../../helpers/evidence/renderHelpers";
import { fetchInvalidHighlights, } from '../../utils/evidence/activityAPIs';

const ActivityInvalidHighlights = ({ activityId }) => {

  const { data: invalidHighlights } = useQuery({
    queryKey: ['invalidHighlight', activityId],
    queryFn: fetchInvalidHighlights
  })

  if (!invalidHighlights) {
    return (
      <span></span>
    )
  }

  return (
    <Link to={`/activities/${activityId}`}>
      {getCheckIcon(!(invalidHighlights.invalid_highlights && invalidHighlights.invalid_highlights.length))}
    </Link>
  )
}

export default ActivityInvalidHighlights
