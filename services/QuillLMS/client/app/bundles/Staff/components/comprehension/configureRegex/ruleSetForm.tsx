import * as React from "react";
import { Input, TextEditor } from 'quill-component-library/dist/componentLibrary';
import { EditorState, ContentState } from 'draft-js'
import { validateForm } from '../../../../../helpers/comprehension';
import useSWR from 'swr';

const RuleSetForm = (props) => {

  // get cached activity data 
  const { data } = useSWR("activity");

  const { activityRuleSet, closeModal, submitRuleSet } = props;
  const { feedback, id, name, rules } = activityRuleSet;
  const [ruleSetName, setRuleSetName] = React.useState(name || '');
  const [ruleSetFeedback, setRuleSetFeedback] = React.useState(feedback || '');
  const [ruleSetPrompts, setRuleSetPrompts] = React.useState({})
  const [regexRules, setRegexRules] = React.useState({})
  const [errors, setErrors] = React.useState([]);

  const handleSetRuleSetName = (e) => { setRuleSetName(e.target.value) };
  const handleSetRuleSetFeedback = (text) => { setRuleSetFeedback(text) };
  const handleRuleSetPromptChange = (e) => {
    const { target } = e;
    const { id, value } = target;
    let updatedPrompts = {...ruleSetPrompts};
    const checked = updatedPrompts[value].checked
    updatedPrompts[value] = {
      id: parseInt(id),
      checked: !checked
    };
    setRuleSetPrompts(updatedPrompts);
  };

  React.useEffect(() => {  
    formatPrompts();
    formatRegexRules();
  }, []);

  const formatPrompts = () => {
    let checkedPrompts = {};
    let formatted = {};

    // get ids of all applied prompts 
    activityRuleSet && activityRuleSet.prompts && activityRuleSet.prompts.forEach(prompt => {
      const { id } = prompt;
      checkedPrompts[id] = true;
    });

    // use activity data to apply each prompt ID
    data && data.prompts && data.prompts.forEach(prompt => {
      const { conjunction, prompt_id } = prompt;
      formatted[conjunction] = {
        id: prompt_id,
        checked: !!checkedPrompts[prompt_id] 
      };
    });
    setRuleSetPrompts(formatted);
  }

  const formatRegexRules = () => {
    let formatted = {};
    rules && rules.map((rule, i) => {
      formatted[`regex-rule-${i}`] = rule;
    });
    setRegexRules(formatted);
  }

  const buildRuleSet = () => {
    const promptIds = [];
    const rules = [];
    const ruleSet = {
      name: ruleSetName,
      feedback: ruleSetFeedback
    };
    if(id) {
      ruleSet.id = id;
    }
    Object.keys(ruleSetPrompts).forEach(key => {
      ruleSetPrompts[key].checked && promptIds.push(ruleSetPrompts[key].id);
    });
    Object.keys(regexRules).forEach(key => {
      rules.push(regexRules[key]);
    });
    ruleSet.prompt_ids = promptIds;
    ruleSet.rules = rules;
    return ruleSet;
  }

  const handleSubmitRuleSet = () => {
    const ruleSet = buildRuleSet();
    const keys = ['Name', 'Feedback'];
    const state = [ruleSetName, ruleSetFeedback];
    // add input values of each regex rule
    Object.keys(regexRules).map((key, i) => {
      keys.push(`Regex rule ${i + 1}`);
      state.push(regexRules[key].regex_text);
    });
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
                  error={errors[`Regex rule ${i + 1}`]}
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
              <button className="quill-button fun primary outlined delete-regex-button" id={ruleKey} onClick={handleDeleteRegexRule} type="button">
                remove
              </button>
            </div>
          );
        })}
        <button className="quill-button fun primary outlined add-regex-button" onClick={handleAddRegexInput} type="button">
          Add Regex Rule +
        </button>
      </div>
    )
  }

  const becausePrompt = ruleSetPrompts['because'];
  const butPrompt = ruleSetPrompts['but'];
  const soPrompt = ruleSetPrompts['so'];
  const errorsPresent = Object.keys(errors).length !== 0;

  return(
    <div className="ruleset-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="ruleset-form">
        <Input
          className="name-input"
          error={errors['Name']}
          handleChange={handleSetRuleSetName}
          label="Name"
          value={ruleSetName}
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
            <label htmlFor={becausePrompt && becausePrompt.id} id="stem-label-1">Because</label>
            <input
              aria-labelledby="stem-label-1"
              checked={becausePrompt && becausePrompt.checked}
              id={becausePrompt && becausePrompt.id}
              name="Because"
              onChange={handleRuleSetPromptChange}
              type="checkbox"
              value="because"
            />
          </div>
          <div className="checkbox-container">
            <label htmlFor={butPrompt && butPrompt.id} id="stem-label-2">But</label>
            <input
              aria-labelledby="stem-label-2"
              checked={butPrompt && butPrompt.checked}
              id={butPrompt && butPrompt.id}
              name="But"
              onChange={handleRuleSetPromptChange}
              type="checkbox"
              value="but"
            />
          </div>
          <div className="checkbox-container">
            <label htmlFor={soPrompt && soPrompt.id} id="stem-label-3">So</label>
            <input
              aria-labelledby="stem-label-3"
              checked={soPrompt && soPrompt.checked}
              id={soPrompt && soPrompt.id}
              name="So"
              onChange={handleRuleSetPromptChange}
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
          <button className="quill-button fun primary contained" id="activity-submit-button" onClick={handleSubmitRuleSet} type="button">
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
