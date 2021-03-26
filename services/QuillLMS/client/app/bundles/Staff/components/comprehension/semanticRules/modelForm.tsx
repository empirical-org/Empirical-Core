import * as React from "react";
import { withRouter, Link } from 'react-router-dom';

import { InputEvent } from '../../../interfaces/comprehensionInterfaces';
import { Input, Spinner } from '../../../../Shared/index';
import { createModel } from '../../../utils/comprehension/modelAPIs';

const ModelForm = ({ history, match }) => {
  const { params } = match;
  const { activityId, promptId } = params;

  const [errors, setErrors] = React.useState<object>({});
  const [modelId, setModelId] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  function handleSetModelId(e: InputEvent) {
    setModelId(e.target.value);
  }

  function submitModel() {
    if(!modelId) {
      const updatedErrors = {...errors};
      updatedErrors['Model ID'] = 'Model ID cannot be blank.';
      setErrors(updatedErrors);
    } else {
      setIsLoading(true);
      createModel(modelId, promptId).then((response) => {
        const { error, model } = response;
        if(error) {
          const updatedErrors = {};
          updatedErrors['Model Submission Error'] = error;
          setErrors(updatedErrors);
          setIsLoading(false);
        } else {
          history.push(`/activities/${activityId}/semantic-rules/model/${model.id}`);
        }
      });
    }
  }

  if(isLoading) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <div className="model-form-container">
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-rules`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <Input
        className="model-id"
        error={errors['Model ID']}
        handleChange={handleSetModelId}
        label="Model ID"
        value={modelId}
      />
      <button className="quill-button fun primary contained" id="add-model-button" onClick={submitModel} type="submit">Submit</button>
      {errors['Model Submission Error'] && <p className="error-message">{errors['Model Submission Error']}</p>}
    </div>
  );
}

export default withRouter(ModelForm)
