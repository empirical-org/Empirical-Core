import * as React from 'react';
import _ from 'underscore';
import ConceptSelector from '../shared/conceptSelector.jsx';
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';

export interface ChooseModelProps {
  children: any,
  conceptsFeedback: { data: {} },
  modelConceptUID: string,
  onUpdateModelConcept(model: {} | null): void
}

export class ChooseModel extends React.Component<ChooseModelProps, {}> {
  removeModelConcept = () => {
    const { onUpdateModelConcept } = this.props;
    onUpdateModelConcept(null);
  };
  selectConcept = (e: { value: string }) => {
    const { onUpdateModelConcept } = this.props;
    onUpdateModelConcept(e.value);
  }
  renderButtons = () => {
    return(
      <p className="control">
        <button
          className="button is-outlined is-danger"
          onClick={this.removeModelConcept} // eslint-disable-line react/jsx-handler-names
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
