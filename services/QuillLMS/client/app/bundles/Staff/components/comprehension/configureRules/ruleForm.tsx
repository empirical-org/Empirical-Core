import * as React from "react";

import RuleFeedbacksSection from './ruleFeedbacksSection';

import { validateForm, buildRule } from '../../../helpers/comprehension';
import { BECAUSE, BUT, SO, ruleTypeOptions } from '../../../../../constants/comprehension';
import { ActivityInterface, RuleInterface, PromptInterface, RegexRuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { Input, DropdownInput } from '../../../../Shared/index'

interface RuleFormProps {
  activityData: ActivityInterface,
  rule: RuleInterface,
  closeModal: (event: React.MouseEvent) => void,
  submitRule: (argumentsHash: {
    ruleSet: { rule_set: RuleInterface},
    rules: RegexRuleInterface[],
    rulesToDelete: object,
    rulesToUpdate: object
  }) => void
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;

const RuleForm = ({ activityData, rule, closeModal, submitRule }: RuleFormProps) => {

  const { name, rule_type, id } = rule;
  const initialRuleType = rule_type ? ruleTypeOptions.filter(ruleType => ruleType.value === rule_type)[0] : ruleTypeOptions[0];

  const [ruleType, setRuleType] = React.useState<{ value: string, label: string}>(initialRuleType);
  const [ruleName, setRuleName] = React.useState<string>(name || '');
  const [firstPlagiarismFeedback, setFirstPlagiarismFeedback] = React.useState<any>({ text: '' });
  const [secondPlagiarismFeedback, setSecondPlagiarismFeedback] = React.useState<any>({ text: '' });
  const [regexFeedback, setRegexFeedback] = React.useState<any>({ text: '' });
  const [rulePrompts, setRulePrompts] = React.useState<object>({});
  const [regexRules, setRegexRules] = React.useState<object>({});
  const [rulesToCreate, setRulesToCreate] = React.useState<object>({});
  const [rulesToDelete, setRulesToDelete] = React.useState<object>({});
  const [rulesToUpdate, setRulesToUpdate] = React.useState<object>({});
  const [errors, setErrors] = React.useState<object>({});

  React.useEffect(() => {
    formatPrompts();
  }, [activityData]);

  React.useEffect(() => {
    formatRegexRules();
    formatFeedbacks();
  }, [rule]);

  function formatPrompts() {
    let checkedPrompts = {};
    let formatted = {};

    // get ids of all applied prompts
    rule && rule.prompt_ids && rule.prompt_ids.forEach(id => {
      checkedPrompts[id] = true;
    });

    // use activity data to apply each prompt ID
    activityData.prompts && activityData.prompts.forEach((prompt: PromptInterface) => {
      const { conjunction, id } = prompt;
      formatted[conjunction] = {
        id,
        checked: !!checkedPrompts[id]
      };
    });

    setRulePrompts(formatted);
  }

  function formatRegexRules() {
    let formatted = {};
    rule && rule.regex_rules && rule.regex_rules.map((rule, i) => {
      const { case_sensitive, id, regex_text } = rule;
      const formattedRule = {
        id: id,
        case_sensitive: case_sensitive,
        regex_text: regex_text
      }
      formatted[`regex-rule-${i}`] = formattedRule;
    });
    setRegexRules(formatted);
  }

  function formatFeedbacks() {
    if(rule && rule.feedbacks && Object.keys(rule.feedbacks).length) {
      const { feedbacks } =  rule;
      if(ruleType && ruleType.value === "Plagiarism") {
        const formattedFirstFeedback = {
          id: feedbacks[0].id,
          order: 0,
          description: feedbacks[0].description,
          text: feedbacks[0].text
        }
        const formattedSecondFeedback = {
          id: feedbacks[1].id,
          order: 1,
          description: feedbacks[1].description,
          text: feedbacks[1].text
        }
        setFirstPlagiarismFeedback(formattedFirstFeedback);
        setSecondPlagiarismFeedback(formattedSecondFeedback);
      }
      else if(ruleType && ruleType.value === "Regex") {
        const formattedFeedback = {
          id: feedbacks[0].id,
          order: 0,
          description: feedbacks[0].description,
          text: feedbacks[0].text
        }
        setRegexFeedback(formattedFeedback);
      }
    }
  }

  function handleSetRuleName(e: InputEvent) { setRuleName(e.target.value) };

  function handleSetFirstPlagiarismFeedback(text) {
    const feedback = {...firstPlagiarismFeedback};
    if(!feedback.order) {
      feedback.order = 0;
    }
    feedback.text = text;
    setFirstPlagiarismFeedback(feedback)
  }

  function handleSetSecondPlagiarismFeedback(text) {
    const feedback = {...secondPlagiarismFeedback};
    if(!feedback.order) {
      feedback.order = 1;
    }
    feedback.text = text;
    setSecondPlagiarismFeedback(feedback)
  }

  function handleSetRegexFeedback(text) {
    const feedback = {...regexFeedback};
    if(!feedback.order) {
      feedback.order = 0;
    }
    feedback.text = text;
    setRegexFeedback(feedback)
  }

  function handleSetRuleType(ruleType: { value: string, label: string }) { setRuleType(ruleType) };

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
      rule,
      ruleName,
      ruleType,
      rulePrompts,
      regexFeedback,
      firstPlagiarismFeedback,
      secondPlagiarismFeedback,
      regexRules
    });
    const keys: string[] = ['Name'];
    const state: any[] = [ruleName];
    if(ruleType.value === "Regex") {
      keys.push("Regex Feedback");
      state.push(regexFeedback.text)
    } else if(ruleType.value === "Plagiarism") {
      keys.concat(["First Plagiarism Feedback", "Second Plagiarism Feedback"]);
      state.concat([firstPlagiarismFeedback.text, secondPlagiarismFeedback.text]);
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
        <RuleFeedbacksSection
          errors={errors}
          firstPlagiarismFeedback={firstPlagiarismFeedback}
          handleAddRegexInput={handleAddRegexInput}
          handleDeleteRegexRule={handleDeleteRegexRule}
          handleSetRegexRule={handleSetRegexRule}
          regexFeedback={regexFeedback}
          regexRules={regexRules}
          ruleType={ruleType && ruleType.value}
          secondPlagiarismFeedback={secondPlagiarismFeedback}
          setFirstPlagiarismFeedback={handleSetFirstPlagiarismFeedback}
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
