import * as React from "react";
import { ActivityInterface } from '../../interfaces/evidenceInterfaces'
const quillCheckmark = `/images/green_check.svg`;
const quillX = '/images/red_x.svg';

export const getCheckIcon = (value: boolean) => {
  if(value) {
    return (<img alt="quill-circle-checkmark" src={quillCheckmark} />)
  } else {
    return (<img alt="quill-circle-checkmark" src={quillX} />);
  }
}

export const renderIDorUID = (idOrRuleId: string | number, type: string) => {
  return(
    <section className="label-status-container">
      <p id="label-status-label">{type}</p>
      <p id="label-status">{idOrRuleId}</p>
    </section>
  );
}

export function renderErrorsContainer(formErrorsPresent: boolean, requestErrors: string[]) {
  if(formErrorsPresent) {
    return(
      <div className="error-message-container">
        <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
      </div>
    );
  }
  return(
    <div className="error-message-container">
      {requestErrors.map((error, i) => {
        return <p className="all-errors-message" key={i}>{error}</p>
      })}
    </div>
  )
}

export const renderHeader = (activityData: {activity: ActivityInterface}, header: string, hideActivityName?: boolean) => {
  if(!activityData) { return }
  if(!activityData.activity) { return }
  const { activity } = activityData;
  const { title, notes } = activity;
  return(
    <section className="comprehension-page-header-container">
      <h2>{header}</h2>
      {!hideActivityName &&
        <React.Fragment>
          <h3>{title}</h3>
          <h4>{notes}</h4>
        </React.Fragment>
      }
    </section>
  );
}
