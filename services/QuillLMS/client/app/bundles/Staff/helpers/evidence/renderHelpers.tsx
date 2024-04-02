import * as React from "react";
import { Link } from 'react-router-dom';

import { RULE_TYPE_TO_NAME, RULE_TYPE_TO_ROUTE_PART } from "../../../../constants/evidence";
import { DataTable } from "../../../Shared";
import { ActivityInterface, InvalidHighlight } from '../../interfaces/evidenceInterfaces';

const quillCheckmark = `/images/green_check.svg`;
const quillX = '/images/red_x.svg';

export const quillCloseX = '/images/x.svg';

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
      {
        !hideActivityName &&
        <React.Fragment>
          <h3>{title}</h3>
          <h4>{notes}</h4>
        </React.Fragment>
      }
    </section>
  );
}

export const renderInvalidHighlightLinks = (invalidHighlights: InvalidHighlight[], id: string) => {
  const formattedRows = invalidHighlights && invalidHighlights.length && invalidHighlights.map((highlight: InvalidHighlight) => {
    const { rule_id, rule_type, prompt_id  } = highlight;
    const ruleTypePart = RULE_TYPE_TO_ROUTE_PART[rule_type]
    const ruleName = RULE_TYPE_TO_NAME[rule_type]
    const idPart = (rule_type == 'autoML') ? `${prompt_id}/${rule_id}` : rule_id
    const invalidHighlightLink = (<Link to={`/activities/${id}/${ruleTypePart}/${idPart}`}>{ruleName} Rule #{rule_id}</Link>);
    return {
      id: rule_id,
      link: invalidHighlightLink
    }
  });

  const dataTableFields = [
    { name: "Invalid Highlights", attribute:"link", width: "100%", noTooltip: true }
  ];

  return (
    <DataTable
      className="activities-table"
      defaultSortAttribute="name"
      headers={dataTableFields}
      rows={formattedRows ? formattedRows : []}
    />
  )
}
