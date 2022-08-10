import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';
import { fetchActivity, createSeedData } from '../../../utils/evidence/activityAPIs';
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Input, Spinner } from '../../../../Shared/index';
import { TITLE } from "../../../../../constants/evidence";

const SeedDataForm = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [errorOrSuccessMessage, setErrorOrSuccessMessage] = React.useState<string>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const queryClient = useQueryClient()

  const [activityNouns, setActivityNouns] = React.useState<string>('');

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const handleCreateSeedData = () => {
    if (!confirm('⚠️ Are you sure you want to generate seed data?')) return

    createSeedData(activityNouns, activityId).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        setErrorOrSuccessMessage('Seed Data started! You will receive an email with the csv files');
      }
    });
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
      {activity && renderHeader({activity: activity}, 'Create Seed Data', true)}
      <p>
        <b>Activity Title:</b> {activity && activity.title}
      </p>
      <p>
        <b>Prompts:</b>
      </p>
      <ul>
        {activity.prompts.map((prompt) => {return <li>{prompt.text}</li>;}}
      </ul>

      <Input
        className="notes-input"
        error={errors[TITLE]}
        handleChange={e => setActivityNouns(e.target.value)}
        label="Optional: Noun list comma separated"
        value={activityNouns}
      />

      <div className="button-and-id-container">
        <button
          className="quill-button fun primary contained focus-on-light"
          id="activity-submit-button"
          onClick={handleCreateSeedData}
          type="submit">
            Create Seed Data
        </button>
      </div>
    </div>
  );
}

export default SeedDataForm;
