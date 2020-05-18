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
  const [regexRules, setRegexRules] = React.useState({})
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
    formatPrompts();
    formatRegexRules();
  }, []);

  const formatPrompts = () => {
    let formatted = {};
    prompts && prompts.forEach(prompt => {
      const { conjunction } = prompt;
      formatted[conjunction] = true;
    });
    setRuleSetStems(formatted);
  }

  const formatRegexRules = () => {
    let formatted = {};
    rules && rules.map((rule, i) => {
      formatted[`regex-rule-${i}`] = rule;
    });
    setRegexRules(formatted);
  }

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

  const handleSetRegexRule = (e) => {
    const { target } = e;
    const { id, value } = target;
    let updatedRules = {...regexRules};
    if(value === 'change-case-sensitivity') {
      updatedRules[id].case_sensitive = !regexRules[id].case_sensitive;
    } else {
      updatedRules[id].regex_text = value;
    }
    setRegexRules(updatedRules);
  }

  const handleAddRegexInput = () => {
    let updatedRules = {...regexRules};
    let id = Object.keys(updatedRules).length;
    const newRegexRule = { regex_text: '', case_sensitive: false };
    // increment id so exisiting rules are not overwritten
    while(updatedRules[`regex-rule-${id}`] ) {
      id += 1;
    }
    updatedRules[`regex-rule-${id}`] = newRegexRule;
    setRegexRules(updatedRules);
  }

  const handleDeleteRegexRule = (e) => {
    const { target } = e;
    const { id } = target;
    let updatedRules = {...regexRules};
    delete updatedRules[id];
    setRegexRules(updatedRules);
  }

  const renderRegexSection = () => {
    const regexRuleKeys = Object.keys(regexRules);
    return(
      <div className="regex-rules-container">
        {regexRuleKeys.length !== 0 && regexRuleKeys.map((ruleKey, i) => {
          return(
            <div className="regex-rule-container" key={`regex-rule-container-${i}`}>
              <div className="regex-input-container">
                <Input
                  className="regex-input"
                  handleChange={handleSetRegexRule}
                  id={ruleKey}
                  value={regexRules[ruleKey].regex_text}
                />
                <div className="checkbox-container">
                  <label className="case-sensitive-label" htmlFor={ruleKey}>
                    Case Sensitive?
                  </label>
                  <input
                    aria-labelledby={ruleKey}
                    checked={regexRules[ruleKey].case_sensitive}
                    id={ruleKey}
                    onChange={handleSetRegexRule}
                    type="checkbox"
                    value="change-case-sensitivity"
                  />
                </div>
              </div>
              <button className="quill-button fun primary outlined delete-regex-button" id={ruleKey} onClick={handleDeleteRegexRule} type="submit">
                remove
              </button>
            </div>
          );
        })}
        <button className="quill-button fun primary outlined add-regex-button" onClick={handleAddRegexInput} type="submit">
          Add Regex Rule +
        </button>
      </div>
    )
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
        <p className="form-subsection-label" id="regex-rules-label">Regex Rules</p>
        {renderRegexSection()}
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
