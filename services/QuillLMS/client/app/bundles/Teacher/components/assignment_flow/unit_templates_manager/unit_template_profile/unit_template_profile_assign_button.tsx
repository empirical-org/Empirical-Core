import * as React from 'react';
import { Activity } from '../../../../../../interfaces/activityPack';

import { EVIDENCE } from '../../../../../Shared';

interface DataInterface {
  activities: Activity[],
  activity_info: string,
  created_at: number,
  diagnostics_recommended_by: Activity[]
  flag: string,
  grades: string[],
  id: number
  name: string,
  non_authenticated: boolean,
  number_of_standards: number,
  order_number: number,
  readability: string,
  time: number,
  type: {
    name: string,
    primary_color: string
  }
  unit_template_category: {
    primary_color: string,
    secondary_color: string,
    name: string,
    id: number
  }
}
interface UnitTemplateProfileDisclaimerPropsInterface {
  data: DataInterface
}
export const UnitTemplateProfileDisclaimer = ({ data }: UnitTemplateProfileDisclaimerPropsInterface) => {

  function isEvidenceActivityPack() {
    if(!data || !data.activities) { return false }

    const { activities } = data;
    return activities.some(activity => {
      const { classification } = activity;
      const { key } = classification;
      return key === EVIDENCE;
    });
  }

  const showWarning = isEvidenceActivityPack();

  return(
    <section className="evidence-warning-container">
      {showWarning && <section className="evidence-warning">
        <p className="header">Activity Difficulty: Designed for 8th-12th Grade</p>
        <p className="text">Quill Reading for Evidence activities are designed for 8th-12th grade students or students reading at a Lexile level between 950-1250.</p>
      </section>}
      <p className="time"><i className="far fa-clock" />Estimated Time: {data.time} mins</p>
    </section>
  );
}

export default UnitTemplateProfileDisclaimer
