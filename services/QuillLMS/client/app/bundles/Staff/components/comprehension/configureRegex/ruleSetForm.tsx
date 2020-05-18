import * as React from "react";
import { Input, TextEditor } from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import { validateForm } from '../../../../../helpers/comprehension';

const RuleSetForm = (props) => {

  const { activityRuleSet, closeModal, submitRuleSet } = props;
  const { description, feedback, prompts, rules } = activityRuleSet;
  const [ruleSetDescription, setRuleSetDescription] = React.useState(description || '');
  const [ruleSetFeedback, setRuleSetFeedback] = React.useState(feedback || '');
  const [ruleSetStems, setRuleSetStems] = React.useState({})
  const [errors, setErrors] = React.useState([]);

  const handleSetRuleSetDescription = (e) => { setRuleSetDescription(e.target.value) };
  const handleSetRuleSetFeedback = (text) => { setRuleSetFeedback(text) };
  const handleRuleSetStemChange = (e) => {
    const stem = e.target.value;
    let updatedStems = {...ruleSetStems};
    updatedStems[stem] = !ruleSetStems[stem];
    setRuleSetStems(updatedStems);
  };

  React.useEffect(() => {  
    let formatted = {};
    prompts && prompts.forEach(prompt => {
      const { conjunction } = prompt;
      formatted[conjunction] = true;
    });
    setRuleSetStems(formatted);
  }, []);

  const buildRuleSet = () => {
    return {
      description: ruleSetDescription,
      feedback: ruleSetFeedback
    };
  }

  const handleSubmitRuleSet = () => {
    const ruleSet = buildRuleSet();
    const keys = ['Description', 'Feedback'];
    const state = [ruleSetDescription, ruleSetFeedback];
    const validationErrors = validateForm(keys, state);
    if(validationErrors && Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
    } else {
      submitRuleSet(ruleSet);
    }
  }

  const errorsPresent = Object.keys(errors).length !== 0;

  return(
    <div className="ruleset-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="ruleset-form">
        <Input
          className="description-input"
          error={errors['Description']}
          handleChange={handleSetRuleSetDescription}
          label="Description"
          value={ruleSetDescription}
        />
        <p className="form-subsection-label">Feedback</p>
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetRuleSetFeedback}
          key="feedback-description"
          text={ruleSetFeedback}
        />
        {errors['Feedback'] && <p className="error-message">{errors['Feedback']}</p>}
        <p className="form-subsection-label">Apply To Stems</p>
        <div className="checkboxes-container">
          <div className="checkbox-container">
            <label htmlFor="because-stem" id="stem-label-1">Because</label>
            <input
              aria-labelledby="stem-label-1"
              checked={ruleSetStems['because']}
              id="because-stem"
              name="Because"
              onChange={handleRuleSetStemChange}
              type="checkbox"
              value="because"
            />
          </div>
          <div className="checkbox-container">
            <label htmlFor="but-stem" id="stem-label-2">But</label>
            <input
              aria-labelledby="stem-label-2"
              checked={ruleSetStems['but']}
              id="but-stem"
              name="But"
              onChange={handleRuleSetStemChange}
              type="checkbox"
              value="but"
            />
          </div>
          <div className="checkbox-container">
            <label htmlFor="but-stem" id="stem-label-3">So</label>
            <input
              aria-labelledby="stem-label-3"
              checked={ruleSetStems['so']}
              id="so-stem"
              name="So"
              onChange={handleRuleSetStemChange}
              type="checkbox"
              value="so"
            />
          </div>
        </div>
        <div className="submit-button-container">
          {errorsPresent && <div className="error-message-container">
            <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
          </div>}
          <button className="quill-button fun primary contained" id="activity-submit-button" onClick={handleSubmitRuleSet} type="submit">
            Submit
          </button>
          <button className="quill-button fun primary contained" id="activity-cancel-button" onClick={closeModal} type="submit">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default RuleSetForm;
