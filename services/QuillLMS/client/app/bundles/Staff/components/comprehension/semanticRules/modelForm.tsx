import * as React from "react";
import { withRouter } from 'react-router-dom';
import { EditorState, ContentState } from 'draft-js'

import { InputEvent } from '../../../interfaces/comprehensionInterfaces';
import { Input, TextEditor } from '../../../../Shared/index';
import { createModel } from '../../../utils/comprehension/modelAPIs';

const ModelForm = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;

  const [errors, setErrors] = React.useState<object>({});
  const [modelId, setModelId] = React.useState<string>('');
  const [modelDescription, setModelDescription] = React.useState<string>('');

  function handleSetModelId(e: InputEvent) {
    setModelId(e.target.value);
  }

  function handleSetModelDescription(text: string) {
    setModelDescription(text);
  }

  function submitModel() {
    if(!modelId) {
      const updatedErrors = {...errors};
      updatedErrors['Model ID'] = 'Model ID cannot be blank.';
      setErrors(updatedErrors);
    } else {
      createModel(modelId).then((response) => {
        const { error, model } = response;
        console.log("🚀 ~ file: modelForm.tsx ~ line 33 ~ createModel ~ response", response)
        if(error) {
          const updatedErrors = {};
          updatedErrors['Model Submission Error'] = error;
          setErrors(updatedErrors);
        }
        // update rules cache to display newly created rule
        history.push({
          pathname: `/activities/${activityId}/semantic-rules/model`,
          state: { model: model }
        });
      });
    }
  }

  return(
    <div className="model-form-container">
      <Input
        className="model-id"
        error={errors['Model ID']}
        handleChange={handleSetModelId}
        label="Model ID"
        value={modelId}
      />
      <p className="form-subsection-label">Rule Description</p>
      <TextEditor
        ContentState={ContentState}
        EditorState={EditorState}
        handleTextChange={handleSetModelDescription}
        key="rule-description"
        text={modelDescription}
      />
      <button className="quill-button fun primary contained" id="add-model-button" onClick={submitModel} type="submit">Submit</button>
      {errors['Model Submission Error'] && <p className="error-message">{errors['Model Submission Error']}</p>}
    </div>
  );
}

export default withRouter(ModelForm)
