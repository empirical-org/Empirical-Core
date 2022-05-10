import * as React from 'react';
import { Activity } from '../../../../../../interfaces/activityPack';

import { requestPost, } from '../../../../../../modules/request';
import { UNIT_TEMPLATE_NAME, } from '../../assignmentFlowConstants';

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
interface UnitTemplateProfileAssignButtonPropsInterface {
  data: DataInterface
}
export const UnitTemplateProfileAssignButton = ({ data }: UnitTemplateProfileAssignButtonPropsInterface) => {

  function saveAnonymousAssignmentValues(redirect) {
    window.localStorage.setItem(UNIT_TEMPLATE_NAME, data.name)
    requestPost(
      '/session/set_post_auth_redirect',
      { post_auth_redirect: window.location.href },
      () => window.location.href = redirect
    );
  }

  function handleClickLogIn() { saveAnonymousAssignmentValues('/session/new') }

  function handleClickSignUp() { saveAnonymousAssignmentValues('/account/new') }

  function propsSpecificComponent() {
    if (!data.non_authenticated) { return }

    return (
      <div className="login-or-signup-container light-gray-bordered-box">
        <strong>Log in or sign-up to assign</strong>
        <div className="login-or-signup-buttons">
          <button className="quill-button medium secondary outlined" onClick={handleClickLogIn}>Log in</button>
          <button className="quill-button medium primary contained" onClick={handleClickSignUp}>Sign up</button>
        </div>
      </div>
    )
  };

  function isEvidenceActivityPack(data: DataInterface) {
    if(!data.activities) { return false }

    const { activities } = data;
    return activities.some(activity => {
      const { classification } = activity;
      const { name } = classification;
      return name === "Quill Reading for Evidence";
    });
  }

  const showWarning = isEvidenceActivityPack(data);
  return(
    <div>
      {propsSpecificComponent()}
      {showWarning && <div className="evidence-warning">
        <p className="header">Activity Difficulty: Designed for 8th-12th Grade</p>
        <p className="text">Quill Reading for Evidence activities are designed for 8th-12 grade students or students reading at a Lexile level between 950-1250.</p>
      </div>}
      <p className="time"><i className="far fa-clock" />Estimated Time: {data.time} mins</p>
    </div>
  );
}

export default UnitTemplateProfileAssignButton
