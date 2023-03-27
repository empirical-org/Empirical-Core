import * as React from 'react';
import { ConceptExplanation } from '../../../Shared/index';
import ConceptSelector from '../shared/conceptSelector.jsx';

export interface ChooseModelProps {
  children?: any,
  conceptsFeedback: { data: {} },
  modelConceptUID: string,
  updateModelConcept(model: {} | null): void
}

export class ChooseModel extends React.Component<ChooseModelProps, {}> {
  handleRemoveModelConcept = () => {
    const { updateModelConcept } = this.props;
    updateModelConcept(null);
  };
  selectConcept = (e: { value: string }) => {
    const { updateModelConcept } = this.props;
    updateModelConcept(e.value);
  }
  renderButtons = () => {
    return(
      <p className="control">
        <button
          className="button is-outlined is-danger"
          onClick={this.handleRemoveModelConcept}
          style={{marginLeft: 5}}
          type="submit"
        >
          Remove
        </button>
      </p>
    );
  }
  render() {
    const { children, conceptsFeedback, modelConceptUID } = this.props;
    return(
      <div className="box">
        <h4 className="title">Choose Model</h4>
        <div className="control">
          <ConceptSelector currentConceptUID={modelConceptUID} handleSelectorChange={this.selectConcept} onlyShowConceptsWithConceptFeedback />
          <ConceptExplanation {...conceptsFeedback.data[modelConceptUID]} />
          {children}
        </div>
        {this.renderButtons()}
      </div>
    );
  }
}

export default ChooseModel;
