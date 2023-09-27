import * as React from "react";
import { useQuery } from 'react-query';
import { Link, withRouter } from 'react-router-dom';

import { DropdownInput, Input, Spinner, TextArea } from '../../../../Shared/index';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { InputEvent } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { createModel } from '../../../utils/evidence/modelAPIs';

const ModelForm = ({ location, history, match }) => {
  const { params } = match;
  const { activityId, promptId } = params;

  const [errors, setErrors] = React.useState<object>({});
  const [modelName, setModelName] = React.useState<string>('');
  const [modelNotes, setModelNotes] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function handleSetModelName(e) {
    setModelName(e.value);
  }

  function handleSetModelNotes(e: InputEvent) {
    setModelNotes(e.target.value);
  }

  function submitModel() {
    if (!modelName) {
      const updatedErrors = { ...errors };
      updatedErrors['endpointName'] = 'Please select an endpoint name';
      setErrors(updatedErrors);
    } else {
      setIsLoading(true);
      createModel(modelName, promptId, modelNotes).then((response) => {
        const { error, model } = response;
        if (error) {
          const updatedErrors = {};
          updatedErrors['Model Submission Error'] = error;
          setErrors(updatedErrors);
          setIsLoading(false);
        } else {
          history.push(`/activities/${activityId}/semantic-labels/model/${model.id}`);
        }
      });
    }
  }

  if (isLoading) {
    return (
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const conjunction = location && location.state && location.state.conjunction || '';
  const header = `Semantic Labels - Add Model (${conjunction})`
  const endpointNameOptions = [{ value: 'endpointName', label: 'endpointName' }]

  return (
    <div className="model-form-container">
      {renderHeader(activityData, header)}
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-labels`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <DropdownInput
        disabled={false}
        handleChange={handleSetEndpointName}
        isSearchable={true}
        label="Endpoint Name"
        options={endpointNameOptions}
        value={endpointName}
      />
      <TextArea
        characterLimit={1000}
        handleChange={handleSetModelNotes}
        label='Please write out any notes about the new model you are adding here. Did you add any labels or remove any labels? What changes did you make?'
        timesSubmitted={0}
        value={modelNotes}
      />
      <button className="quill-button fun primary contained" id="add-model-button" onClick={submitModel} type="submit">Submit</button>
      {errors['Model Submission Error'] && <p className="error-message">{errors['Model Submission Error']}</p>}
    </div>
  );
}

export default withRouter(ModelForm)
