import * as React from "react";
import { useQuery } from 'react-query';

import RuleAttributesSection from './ruleAttributesSection';

import { fetchRules } from '../../../utils/comprehension/ruleSetAPIs';
import { validateForm, buildRule, formatPrompts, formatFeedbacks, formatRegexRules } from '../../../helpers/comprehension';
import { BECAUSE, BUT, SO, ruleTypeOptions, ruleOptimalOptions } from '../../../../../constants/comprehension';
import { ActivityInterface, RuleInterface, RuleFeedbackInterface  } from '../../../interfaces/comprehensionInterfaces';
import { Input, DropdownInput } from '../../../../Shared/index'

interface RuleFormProps {
  activityData: ActivityInterface,
  activityId: string,
  rule: RuleInterface,
  closeModal: (event: React.MouseEvent) => void,
  submitRule: (rule: {rule: RuleInterface}) => void
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;

const RuleForm = ({ activityData, activityId, rule, closeModal, submitRule }: RuleFormProps) => {

  const { name, rule_type, id, optimal, plagiarism_text, concept_uid } = rule;
  const initialRuleType = rule_type ? ruleTypeOptions.filter(ruleType => ruleType.value === rule_type)[0] : ruleTypeOptions[0];
  const initialRuleOptimal = optimal ? ruleOptimalOptions[0] : ruleOptimalOptions[1];
  const initialPlagiarismText = plagiarism_text ? plagiarism_text : { text: '' }

  const [ruleType, setRuleType] = React.useState<any>(initialRuleType);
  const [ruleName, setRuleName] = React.useState<string>(name || '');
  const [ruleOptimal, setRuleOptimal] = React.useState<any>(initialRuleOptimal);
  const [ruleConceptUID, setRuleConceptUID] = React.useState<string>(concept_uid);
  const [plagiarismText, setPlagiarismText] = React.useState<RuleInterface["plagiarism_text"]>(initialPlagiarismText);
  const [firstPlagiarismFeedback, setFirstPlagiarismFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [secondPlagiarismFeedback, setSecondPlagiarismFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [regexFeedback, setRegexFeedback] = React.useState<RuleFeedbackInterface >(null);
  const [rulePrompts, setRulePrompts] = React.useState<object>({});
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [rulesToCreate, setRulesToCreate] = React.useState<object>({});
  const [rulesToDelete, setRulesToDelete] = React.useState<object>({});
  const [rulesToUpdate, setRulesToUpdate] = React.useState<object>({});
  const [rulesCount, setRulesCount] = React.useState<number>(null);
  const [errors, setErrors] = React.useState<object>({});

  // cache ruleSets data for handling rule suborder
  const { data: rulesData } = useQuery({
    queryKey: [`rules-${activityId}`, activityId],
    queryFn: fetchRules
  });

  React.useEffect(() => {
    formatPrompts({ activityData, rule, setRulePrompts });
  }, [activityData]);

  React.useEffect(() => {
    formatRegexRules({ rule, setRegexRules });
    formatFeedbacks({ rule, ruleType, setFirstPlagiarismFeedback, setSecondPlagiarismFeedback, setRegexFeedback });
  }, [rule]);

  React.useEffect(() => {
    if(rulesData && rulesData.rules) {
      const { rules } = rulesData;
      setRulesCount(rules.length);
    }
  }, [rulesData])

  function handleSetRuleName(e: InputEvent) { setRuleName(e.target.value) };

  function handleSetRuleConceptUID(e: InputEvent) { setRuleConceptUID(e.target.value) };

  function handleSetPlagiarismText(text: string) {
    const plagiarismTextObject = {...plagiarismText};
    plagiarismTextObject.text = text;
    setPlagiarismText(plagiarismTextObject)
  }

  function handleSetFirstPlagiarismFeedback(text: string) {
    const feedback = {...firstPlagiarismFeedback};
    if(!feedback.order) {
      feedback.order = 0;
    }
    feedback.text = text;
    setFirstPlagiarismFeedback(feedback)
  }

  function handleSetSecondPlagiarismFeedback(text: string) {
    const feedback = {...secondPlagiarismFeedback};
    if(!feedback.order) {
      feedback.order = 1;
    }
    feedback.text = text;
    setSecondPlagiarismFeedback(feedback)
  }

  function handleSetRegexFeedback(text: string) {
    const feedback = {...regexFeedback};
    if(!feedback.order) {
      feedback.order = 0;
    }
    feedback.text = text;
    setRegexFeedback(feedback)
  }

  function handleSetRuleType(ruleType: { value: string, label: string }) { setRuleType(ruleType) };

  function handleSetRuleOptimal(ruleOptimal: { value: boolean, label: string }) { setRuleOptimal(ruleOptimal) };

  function handleRulePromptChange(e: InputEvent) {
    const { target } = e;
    const { id, value } = target;
    let updatedPrompts = {...rulePrompts};
    const checked = updatedPrompts[value].checked;
    updatedPrompts[value] = {
      id: parseInt(id),
      checked: !checked
    };
    setRulePrompts(updatedPrompts);
  };

  function handleSubmitRule() {
    const newOrUpdatedRule = buildRule({
      plagiarismText,
      firstPlagiarismFeedback,
      regexFeedback,
      regexRules,
      rule,
      ruleName,
      ruleConceptUID,
      ruleOptimal,
      rulePrompts,
      rulesCount,
      ruleType,
      secondPlagiarismFeedback,
    });
    let keys: string[] = ['Name', 'Concept UID'];
    let state: any[] = [ruleName, ruleConceptUID];
    if(ruleType.value === "Regex") {
      keys.push("Regex Feedback");
      state.push(regexFeedback.text)
    } else if(ruleType.value === "Plagiarism") {
      keys = keys.concat(["Plagiarism Text", "First Plagiarism Feedback", "Second Plagiarism Feedback"]);
      state = state.concat([plagiarismText.text, firstPlagiarismFeedback.text, secondPlagiarismFeedback.text]);
    }
    Object.keys(regexRules).map((key, i) => {
      keys.push(`Regex rule ${i + 1}`);
      state.push(regexRules[key].regex_text);
    });
    keys.push('Stem Applied');
    state.push(rulePrompts);
    const validationErrors = validateForm(keys, state);
    if(validationErrors && Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      submitRule(newOrUpdatedRule);
    }
  }

  function handleSetRegexRule(e: InputEvent) {
    const { target } = e;
    const { id, type, value } = target;
    let updatedRules = {...regexRules};
    if(type === 'checkbox') {
      updatedRules[value].case_sensitive = !regexRules[value].case_sensitive;
    } else {
      updatedRules[id].regex_text = value;
    }
    const rule = updatedRules[value] || updatedRules[id];
    if(rule.id) {
      const updatedHash = rulesToUpdate;
      updatedHash[rule.id] = rule;
      setRulesToUpdate(updatedHash);
    } else {
      const updatedHash = rulesToCreate;
      updatedHash[rule] = rule;
      setRulesToCreate(updatedHash);
    }
    setRegexRules(updatedRules);
  }

  function handleAddRegexInput() {
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

  function handleDeleteRegexRule(e: InputEvent) {
    const { target } = e;
    const { value } = target;
    let updatedRules = {...regexRules};
    const rule = updatedRules[value]
    // add to regexRulesToDelete array to delete during ruleSet update
    if(rule.id) {
      const updatedHash = rulesToDelete;
      updatedHash[rule.id] = rule;
      setRulesToDelete(updatedHash);
    }
    delete updatedRules[value];
    setRegexRules(updatedRules);
  }

  const becausePrompt = rulePrompts[BECAUSE];
  const butPrompt = rulePrompts[BUT];
  const soPrompt = rulePrompts[SO];
  const errorsPresent = !!Object.keys(errors).length;
  const ruleTypeDisabled = id ? 'disabled' : '';

  return(
    <div className="rule-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="rule-form">
        <DropdownInput
          className={`rule-type-input ${ruleTypeDisabled}`}
          disabled={!!ruleTypeDisabled}
          handleChange={handleSetRuleType}
          isSearchable={true}
          label="Rule Type"
          options={ruleTypeOptions}
          value={ruleType}
        />
        <Input
          className="name-input"
          error={errors['Name']}
          handleChange={handleSetRuleName}
          label="Name"
          value={ruleName}
        />
        <Input
          className="concept-uid-input"
          error={errors['Concept UID']}
          handleChange={handleSetRuleConceptUID}
          label="Concept UID"
          value={ruleConceptUID}
        />
        <DropdownInput
          className='rule-type-input'
          handleChange={handleSetRuleOptimal}
          isSearchable={true}
          label="Optimal?"
          options={ruleOptimalOptions}
          value={ruleOptimal}
        />
        <RuleAttributesSection
          errors={errors}
          firstPlagiarismFeedback={firstPlagiarismFeedback}
          handleAddRegexInput={handleAddRegexInput}
          handleDeleteRegexRule={handleDeleteRegexRule}
          handleSetRegexRule={handleSetRegexRule}
          plagiarismText={plagiarismText}
          regexFeedback={regexFeedback}
          regexRules={regexRules}
          ruleType={ruleType && ruleType.value}
          secondPlagiarismFeedback={secondPlagiarismFeedback}
          setFirstPlagiarismFeedback={handleSetFirstPlagiarismFeedback}
          setPlagiarismText={handleSetPlagiarismText}
          setRegexFeedback={handleSetRegexFeedback}
          setSecondPlagiarismFeedback={handleSetSecondPlagiarismFeedback}
        />
        <p className="form-subsection-label">Apply To Stems</p>
        <div className="checkboxes-container">
          <div className="checkbox-container">
            <label htmlFor={becausePrompt && becausePrompt.id} id="stem-label-1">Because</label>
            <input
              aria-labelledby="stem-label-1"
              checked={becausePrompt && becausePrompt.checked}
              id={becausePrompt && becausePrompt.id}
              name="Because"
              onChange={handleRulePromptChange}
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
              onChange={handleRulePromptChange}
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
              onChange={handleRulePromptChange}
              type="checkbox"
              value="so"
            />
          </div>
        </div>
        {errors['Stem Applied'] && <p className="error-message">{errors['Stem Applied']}</p>}
        <div className="submit-button-container">
          {errorsPresent && <div className="error-message-container">
            <p className="all-errors-message">Please check that all fields have been completed correctly.</p>
          </div>}
          <button className="quill-button fun primary contained" id="activity-submit-button" onClick={handleSubmitRule} type="button">
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

export default RuleForm;
