import * as React from "react";
import stripHtml from "string-strip-html";

import RuleFeedbacksSection from './ruleFeedbacksSection';

import { validateForm } from '../../../helpers/comprehension';
import { BECAUSE, BUT, SO, ruleTypeOptions } from '../../../../../constants/comprehension';
import { ActivityInterface, ActivityRuleInterface, PromptInterface, RegexRuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { Input, DropdownInput } from '../../../../Shared/index'

interface RuleFormProps {
  activityData: ActivityInterface,
  rule: ActivityRuleInterface,
  closeModal: (event: React.MouseEvent) => void,
  submitRule: (argumentsHash: {
    ruleSet: { rule_set: ActivityRuleInterface},
    rules: RegexRuleInterface[],
    rulesToDelete: object,
    rulesToUpdate: object
  }) => void
}

type InputEvent = React.ChangeEvent<HTMLInputElement>;

const RuleForm = ({ activityData, rule, closeModal, submitRule }: RuleFormProps) => {

  const { name, rule_type } = rule;
  const initialRuleType = rule_type ? ruleTypeOptions.filter(ruleType => ruleType.value === rule_type)[0] : ruleTypeOptions[0];

  const [ruleType, setRuleType] = React.useState<{ value: string, label: string}>(initialRuleType);
  const [ruleName, setRuleName] = React.useState<string>(name || '');
  const [firstPlagiarismFeedback, setFirstPlagiarismFeedback] = React.useState<any>({});
  const [secondPlagiarismFeedback, setSecondPlagiarismFeedback] = React.useState<any>({});
  const [regexFeedback, setRegexFeedback] = React.useState<any>({});
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
    rule && rule.regex_rules_attributes && rule.regex_rules_attributes.map((rule, i) => {
      formatted[`regex-rule-${i}`] = rule;
    });
    setRegexRules(formatted);
  }

  function formatFeedbacks() {
    if(rule && rule.feedbacks && Object.keys(rule.feedbacks).length) {
      const { feedbacks } =  rule;
      if(ruleType && ruleType.value === "Plagiarism") {
        setFirstPlagiarismFeedback(feedbacks[0]);
        setSecondPlagiarismFeedback(feedbacks[1]);
      }
      else if(ruleType && ruleType.value === "Regex") {
        const formattedFeedback = {
          id: feedbacks[0].id,
          order: feedbacks[0].order,
          description: feedbacks[0].description,
          text: stripHtml(feedbacks[0].text)
        }
        setRegexFeedback(formattedFeedback);
      }
    }
  }

  function buildFeedbacks() {
    if(ruleType.value === "Regex") {
      return [regexFeedback];
    } else if(ruleType.value === "Plagiarism") {
      return [firstPlagiarismFeedback, secondPlagiarismFeedback];
    }
  }

  function buildRule() {
    const promptIds = [];
    const rules = [];
    const newRule = {
      name: ruleName,
      feedbacks_attributes: buildFeedbacks()
    };
    Object.keys(rulePrompts).forEach(key => {
      rulePrompts[key].checked && promptIds.push(rulePrompts[key].id);
    });
    newRule.prompt_ids = promptIds;
    if(ruleType.value === 'Regex'){
      Object.keys(regexRules).forEach(key => {
        rules.push(regexRules[key]);
      });
      newRule.regex_rules_attributes = rules;
    }
    return newRule;
  }

  function handleSetRuleName(e: InputEvent) { setRuleName(e.target.value) };

  function handleSetFirstPlagiarismFeedback(text) {
    const feedback = firstPlagiarismFeedback;
    feedback.text = text;
    if(!feedback.order) {
      feedback.order = 0;
    }
    setFirstPlagiarismFeedback(feedback)
  }

  function handleSetSecondPlagiarismFeedback(text) {
    const feedback = secondPlagiarismFeedback;
    feedback.text = text;
    if(!feedback.order) {
      feedback.order = 1;
    }
    setSecondPlagiarismFeedback(feedback)
  }

  function handleSetRegexFeedback(e) {
    const { target } = e;
    const { value } = target;
    const feedback = {...regexFeedback};
    feedback.text = value;
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
    const rule = buildRule();
    const keys = ['Name', 'Feedback'];
    const state = [ruleName];
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
    const validationErrors = validateForm(keys, state);
    if(validationErrors && Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      submitRule({ rule });
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

  return(
    <div className="rule-form-container">
      <div className="close-button-container">
        <button className="quill-button fun primary contained" id="activity-close-button" onClick={closeModal} type="submit">x</button>
      </div>
      <form className="rule-form">
        <DropdownInput
          className="rule-type-input"
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
