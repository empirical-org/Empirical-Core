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

  const because = 'because';
  const but = 'but';
  const so = 'so';

  const blankLabelConfig = { label: '', examples: ['',''],};
  const blankLabelConfigs = {because : [], but : [], so : [],};

  const [labelConfigs, setLabelConfigs] = React.useState({...blankLabelConfigs});

  const handleLabelConfigsChange = (event, index, conjunction, key) => {
    let data = labelConfigs
    let conjunctionData = [...data[conjunction]];

    conjunctionData[index][key] = event.target.value;
    data[conjunction] = conjunctionData;

    setLabelConfigs(labelConfigs => ({...data}));
  }

  const handleExampleChange = (event, index, conjunction, exampleIndex) => {
    let data = labelConfigs
    let conjunctionData = [...data[conjunction]];

    conjunctionData[index].examples[exampleIndex] = event.target.value;
    data[conjunction] = conjunctionData;

    setLabelConfigs(labelConfigs => ({...data}));
  }

  const addLabelConfigs = (conjunction) => {
    let data = labelConfigs
    let conjunctionData = [...data[conjunction], {...blankLabelConfig}];

    data[conjunction] = conjunctionData
    setLabelConfigs(labelConfigs => ({...data}))
  }

  const removeLabelConfig = (index, conjunction) => {
    let data = labelConfigs
    let conjunctionData = [...data[conjunction]]
    conjunctionData.splice(index, 1)
    data[conjunction] = conjunctionData

    setLabelConfigs(labelConfigs => ({...data}))
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
        setLabelConfigs({...blankLabelConfigs});
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

  const renderExample = (value, index, conjunction, exampleIndex) => {
    return (
      <Input
        handleChange={e => handleExampleChange(e, index, conjunction, exampleIndex)}
        label={`Example ${exampleIndex + 1}`}
        value={value}
      />
    );
  }

  const renderLabelConfig = (labelConfig, index, conjunction) => {
    return (
      <div key={index} className="seed-label-form">
        <button
          className='right quill-button fun secondary outlined'
          onClick={() => removeLabelConfig(index, conjunction)}
        >
          Remove
        </button>
        <div>
          <Input
            className="label-input"
            handleChange={e => handleLabelConfigsChange(e, index, conjunction, 'label')}
            label='Label'
            value={labelConfig.label}
          />
        </div>
        {labelConfig.examples.map((example, exampleIndex) => renderExample(example, index, conjunction, exampleIndex))}

      </div>
    );
  }

  const renderLabelSection = (conjunction) => {
    let capitalizeConjunction = conjunction.charAt(0).toUpperCase() + conjunction.substring(1)
    return (
      <div className='label-section'>
        <h4 className='bg-quillteal label-title'>
          <span className='highlight'>{capitalizeConjunction}</span>
          &nbsp;Label Examples
        </h4>
        {labelConfigs[conjunction].map((labelConfig, index) => renderLabelConfig(labelConfig, index, conjunction))}
        <button className='quill-button small primary outlined' onClick={e => addLabelConfigs(conjunction)}>
          <span className='plus'>+</span>

          &nbsp;Add {capitalizeConjunction} Label
        </button>
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
        <summary className="quill-button fun primary outlined focus-on-light">Toggle Passage</summary>
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

      {renderLabelSection(because)}
      {renderLabelSection(but)}
      {renderLabelSection(so)}
      <br />
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
