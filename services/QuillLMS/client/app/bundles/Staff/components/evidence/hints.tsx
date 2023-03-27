import * as React from "react";
import { useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import Navigation from './navigation';

import { blankHint } from "../../../../constants/evidence";
import useSnackbarMonitor from '../../../Shared/hooks/useSnackbarMonitor';
import { defaultSnackbarTimeout, Error, Snackbar, Spinner } from '../../../Shared/index';
import { renderErrorsContainer } from "../../helpers/evidence/renderHelpers";
import { HintInterface } from '../../interfaces/evidenceInterfaces';
import { createHint, deleteHint, fetchHints, updateHint } from '../../utils/evidence/hintAPIs';
import RuleHint from "./configureRules/ruleHint";
import RuleHintDropdown from "./configureRules/ruleHintDropdown";

const Hints = ({ location, match }) => {
  const { params } = match;
  const { hintId } = params;

  const history = useHistory();

  // cache hint data for updates
  const { data: hintsData } = useQuery("hints", fetchHints);
  const [errors, setErrors] = React.useState<string[]>([])
  const [hint, setHint] = React.useState<HintInterface>(blankHint)
  const [snackbarText, setSnackbarText] = React.useState<string[]>('')
  const [showSnackbar, setShowSnackbar] = React.useState<Boolean>(false)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  const queryClient = useQueryClient()

  const NO_VALUE = ''

  if (hintId && hintsData && hint.id !== hintId) {
    const hintFromUrl = hintsData.hints.find((hint) => hint.id === hintId)
    if (hintFromUrl) setHint(hintFromUrl)
  }

  const onHintChange = (selectedHint) => {
    if (!selectedHint) {
      setHint(blankHint)
      history.push({
        pathname: `/hints`
      })
      return
    }
    setHint(selectedHint)
    history.push({
      pathname: `/hints/${selectedHint.id}`
    })
  }

  const handleSaveHint = () => {
    if (hint.id === NO_VALUE) {
      createHint(hint).then(handleSaveResponse)
      flashSnackbar('New hint created.')
    } else {
      updateHint(hint.id, hint).then(handleSaveResponse)
      flashSnackbar('Hint updated.')
    }
  }

  const handleSaveResponse = (response) => {
    if (response.errors.length) setErrors(result.errors)

    queryClient.refetchQueries("hints")
    if (response.hint) {
      setHint(response.hint)
    }
  }

  const handleDeleteHint = () => {
    if (!window.confirm('Are you sure you want to delete this Hint?  Doing so will affect all Rules that it is attached to.')) return

    flashSnackbar('Hint deleted.')
    deleteHint(hint.id).then(handleSaveResponse)
      .then(() => setHint(blankHint))
  }

  const flashSnackbar = (text: string) => {
    setSnackbarText(text)
    setShowSnackbar(true)
  }

  if(!hintsData) {
    return(
      <React.Fragment>
        <Navigation location={location} match={match} />
        <div className="loading-spinner-container">
          <Spinner />
        </div>
      </React.Fragment>
    );
  }

  if(hintsData.error) {
    return(
      <div className="error-container">
        <Error error={`${hintsData.error}`} />
      </div>
    );
  }

  const hintDropdown = () => {
    return (
      <RuleHintDropdown
        emptySelectionText="Create new hint"
        onHintChange={onHintChange}
        selectedHintId={hint.id}
      />
    )
  }

  const hintForm = () => {
    return (
      <RuleHint
        errors={errors}
        hint={hint}
        setHint={setHint}
      />
    )
  }

  const saveButton = () => {
    const buttonText = hint.id === NO_VALUE ? 'Create Hint' : 'Update Hint'
    return (<button className="quill-button medium primary outlined save-hint" onClick={handleSaveHint} type="button">{buttonText}</button>)
  }

  const deleteButton = () => {
    if (hint.id === NO_VALUE) return;

    return (<button className="quill-button medium primary outlined delete-hint" onClick={handleDeleteHint} type="button">Delete Hint</button>)
  }

  return(
    <React.Fragment>
      <Navigation location={location} match={match} />
      <div className="hints-container">
        <h3>Rule Hints</h3>
        {hintDropdown()}
        {errors && renderErrorsContainer(true, errors)}
        <div className="hint-form">
          {hintForm()}
          <div className="button-wrapper">
            {saveButton()}
            {deleteButton()}
          </div>
        </div>
        <Snackbar text={snackbarText} visible={showSnackbar} />
      </div>
    </React.Fragment>
  );
}

export default Hints
