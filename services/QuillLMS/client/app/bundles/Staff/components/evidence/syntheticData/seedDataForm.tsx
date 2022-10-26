import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';
import ReactHtmlParser from 'react-html-parser'

import SubmissionModal from '../shared/submissionModal';
import { fetchActivity, createSeedData } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Input, Spinner } from '../../../../Shared/index';
import { TITLE } from "../../../../../constants/evidence";

const SeedDataForm = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const queryClient = useQueryClient()

  const [activityNouns, setActivityNouns] = React.useState<string>('');

  const [labelConfigs, setLabelConfigs] = React.useState<any>([
    { label: '', example1: '', example2: '' },
  ]);

  const handleLabelConfigsChange = (event, index) => {
    let data = [...labelConfigs];
    data[index][event.target.id] = event.target.value;
    setLabelConfigs(data);
  }

  const addLabelConfigs = () => {
    let object = { label: '', example1: '', example2: '' }

    setLabelConfigs([...labelConfigs, object])
  }

  const removeLabelConfig = (index) => {
    let data = [...labelConfigs];
    data.splice(index, 1);
    setLabelConfigs(data);
  }


  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const handleCreateSeedData = () => {
    if (!confirm('⚠️ Are you sure you want to generate seed data?')) return

    createSeedData(activityNouns, labelConfigs, activityId).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        setErrorOrSuccessMessage('Seed Data started! You will receive an email with the csv files');
        setActivityNouns('');
        toggleSubmissionModal();
      }
    });
  }

  const toggleSubmissionModal = () => setShowSubmissionModal(!showSubmissionModal);

  function renderSubmissionModal() {
    const message = errorOrSuccessMessage || 'Seed Data started!';
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  if(!activityId || !activityData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const { activity } = activityData

  return(
    <div className="seed-data-form-container">
      {showSubmissionModal && renderSubmissionModal()}
      {activity && renderHeader({activity: activity}, 'Create Seed Data', true)}
      <h4>{activity && activity.title}</h4>
      <p><b>Seed Data will be generated for each of these prompts:</b></p>
      <ul>
        {activity && activity.prompts.map((prompt, i) => <li key={i}>{prompt.text}</li>)}
      </ul>
      <details>
        <summary className="quill-button fun secondary outlined focus-on-light">Toggle Passage</summary>
        <br />
        <div className="passage">{ReactHtmlParser(activity && activity.passages[0].text)}</div>
      </details>
      <Input
        className="notes-input"
        error={errors[TITLE]}
        handleChange={e => setActivityNouns(e.target.value)}
        label="Optional: Noun list comma separated"
        value={activityNouns}
      />
      <h4>Label Examples</h4>
      {labelConfigs.map((form, index) => {
          return (
            <div key={index}>
              <Input
                id='label'
                label='Label'
                handleChange={e => handleLabelConfigsChange(e, index)}
                value={labelConfigs[index].label}
              />
              <Input
                id='example1'
                label='Example1'
                handleChange={e => handleLabelConfigsChange(e, index)}
                value={form.example1}
              />
              <Input
                id='example2'
                label='Example2'
                handleChange={e => handleLabelConfigsChange(e, index)}
                value={form.example2}
              />
              <button onClick={() => removeLabelConfig(index)}>Remove</button>
            </div>
          )
        })
      }
      <button onClick={addLabelConfigs}>Add Label</button>
      <div className="button-and-id-container">
        <button className="quill-button fun large primary contained focus-on-light" id="activity-submit-button" onClick={handleCreateSeedData} type="submit">
          <span aria-label="robot" role="img">🤖</span>
          <span aria-label="sunflower" role="img">🌻</span>

          Create Seed Data
        </button>
      </div>
      <br />
    </div>
  );
}

export default SeedDataForm;
