import * as React from "react";

import LabelsTable from './labelsTable';
import ModelsTable from './modelsTable';

import { Spinner } from '../../../../Shared/index';

const SemanticLabelsOverview = ({ activityId, prompts }) => {

  function renderPrompts() {
    return prompts.map(prompt => {
      return(
        <section className="prompt-section" key={prompt.id}>
          <ModelsTable activityId={activityId} prompt={prompt} />
          <LabelsTable activityId={activityId} prompt={prompt} />
        </section>
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
    <div className="semantic-labels-overview-container">
      {renderPrompts()}
    </div>
  );
}

export default SemanticLabelsOverview
