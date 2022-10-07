import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';
import { useHistory, } from 'react-router-dom';

import Navigation from './navigation';

import { HintInterface } from '../../interfaces/evidenceInterfaces';
import { createHint, deleteHint, fetchHints, updateHint, } from '../../utils/evidence/hintAPIs';
import { DropdownInput, Error, Spinner, Snackbar, defaultSnackbarTimeout, } from '../../../Shared/index';
import { renderErrorsContainer } from "../../helpers/evidence/renderHelpers";
import RuleHint from "./configureRules/ruleHint";
import RuleHintDropdown from "./configureRules/ruleHintDropdown";

const Hints = ({ location, match }) => {
  const { params } = match;
  const { hintId } = params;

  const history = useHistory();

  const newHint: HintInterface = {
    id: '',
    name: '',
    explanation: '',
    image_link: 'no image',
    image_alt_text: ''
  }

  // cache hint data for updates
  const { data: hintsData } = useQuery("hints", fetchHints);
  const [errors, setErrors] = React.useState<string[]>([])
  const [hint, setHint] = React.useState<HintInterface>(newHint)
  const [snackbarText, setSnackbarText] = React.useState<string[]>('')
  const [snackbarVisible, setSnackbarVisible] = React.useState<Boolean>(false)

  const queryClient = useQueryClient()

  if (hintId && hintsData && hint.id != hintId) {
    const hintFromUrl = hintsData.hints.find((hint) => hint.id == hintId)
    if (hintFromUrl) setHint(hintFromUrl)
  }

  const onHintChange = (selectedHint) => {
    if (!selectedHint) {
      return setHint(newHint)
    }
    setHint(selectedHint)
    history.push({
      pathname: `/hints/${selectedHint.id}`
    })
  }

  const handleSaveHint = () => {
    if (hint.id == '') {
      createHint(hint).then(handleSaveResponse)
    } else {
      updateHint(hint.id, hint).then(handleSaveResponse)
    }
  }

  const handleSaveResponse = (response) => {
    if (response.errors.length > 0) setErrors(result.errors)

    queryClient.refetchQueries("hints")
    if (response.hint) {
      setHint(response.hint)
    }
  }

  const handleDeleteHint = () => {
    if (!window.confirm('Are you sure you want to delete this Hint?  Doing so will affect all Rules that it is attached to.')) return

    flashSnackbar('Hint deleted.')
    deleteHint(hint.id).then(handleSaveResponse)
      .then(() => setHint(newHint))
  }

  const flashSnackbar = (text: string) => {
    setSnackbarText(text)
    setSnackbarVisible(true)
    setTimeout(() => setSnackbarVisible(false), defaultSnackbarTimeout)
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
    const buttonText = hint.id == '' ? 'Create Hint' : 'Update Hint'
    return (<button className="quill-button medium primary outlined save-hint" onClick={handleSaveHint} type="button">{buttonText}</button>)
  }

  const deleteButton = () => {
    if (hint.id == '') return;

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
        <Snackbar text={snackbarText} visible={snackbarVisible} />
      </div>
    </React.Fragment>
  );
}

export default Hints
