import * as React from "react";

import LabelsTable from './labelsTable';

import { Spinner } from '../../../../Shared/index';

const SemanticRulesOverview = ({ prompts }) => {

function renderPrompts() {
  return prompts.map(prompt => {
    return(
      <React.Fragment key={prompt.id}>
        <LabelsTable prompt={prompt} />
        {/* <ModelsTable prompt={prompt} /> */}
      </React.Fragment>
    )
  });
}

  if(!prompts) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="semantic-rules-overview-container">
      {renderPrompts()}
    </div>
  );
}

export default SemanticRulesOverview
