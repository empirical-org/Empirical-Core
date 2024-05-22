import * as React from "react";
import { useQuery } from 'react-query';
import { Link, withRouter } from 'react-router-dom';

import { DropdownInput, Spinner, TextArea } from '../../../../Shared/index';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { InputEvent } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { createModel, fetchDeployedModelNames } from '../../../utils/evidence/modelAPIs';

const ModelForm = ({ location, history, match }) => {
  const { params } = match;

  const { activityId, promptId } = params;

  const [errors, setErrors] = React.useState<object>({});
  const [name, setName] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');
  const [nameOptions, setNameOptions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: deployedModelNamesData, isError: isNamesError } = useQuery({
    queryKey: ['deployedModelNames'],
    queryFn: fetchDeployedModelNames,
  });

  React.useEffect(() => {
    if (deployedModelNamesData && deployedModelNamesData.names) {
      const newOptions = deployedModelNamesData.names.map((name) => ({
        value: name,
        label: name,
      }));
      setNameOptions(newOptions);
    }
  }, [deployedModelNamesData]);

  React.useEffect(() => {
  }, [name]);

  function handleSetName(option: { value: string }) {
    setName(option.value);
  }

  function handleSetNotes(e: InputEvent) {
    setNotes(e.target.value);
  }

  function submitModel() {
    if (!name) {
      const updatedErrors = { ...errors };
      updatedErrors['name'] = 'Please select an name';
      setErrors(updatedErrors);
    } else {
      setIsLoading(true);
      createModel(name, notes, promptId).then((response) => {
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

  return (
    <div className="model-form-container">
      {renderHeader(activityData, header)}
      <Link className="return-link" to={{ pathname: `/activities/${activityId}/semantic-labels`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
      <DropdownInput
        handleChange={handleSetName}
        isSearchable={true}
        label="Name (note: if you're not finding a particular name, ensure that endpoint and model name are identical including leading/trailing whitespace)"
        options={nameOptions}
        value={nameOptions.find(opt => opt.value === name)}
      />
      <TextArea
        characterLimit={1000}
        handleChange={handleSetNotes}
        label='Please write out any notes about the new model you are adding here. Did you add any labels or remove any labels? What changes did you make?'
        timesSubmitted={0}
        value={notes}
      />
      <button className="quill-button fun primary contained" id="add-model-button" onClick={submitModel} type="submit">Submit</button>
      {errors['Model Submission Error'] && <p className="error-message">{errors['Model Submission Error']}</p>}
    </div >
  );
}

export default withRouter(ModelForm)
