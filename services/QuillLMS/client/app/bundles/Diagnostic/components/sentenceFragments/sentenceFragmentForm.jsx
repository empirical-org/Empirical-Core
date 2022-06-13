import React from 'react';
import { Link } from 'react-router-dom';
import ConceptSelector from '../shared/conceptSelector.jsx';
import { FlagDropdown } from '../../../Shared/index';

class sentenceFragmentForm extends React.Component {
  constructor(props) {
    super(props);
    const fragment = props.data;
    if (fragment === undefined) {
      this.state = {
        prompt: '',
        isFragment: false,
        optimalResponseText: '',
        needsIdentification: true,
        instructions: '',
        conceptID: '',
        wordCountChange: {},
        flag: 'alpha'
      };

      return;
    } else {
      this.state = {
        prompt: fragment.prompt,
        isFragment: fragment.isFragment,
        optimalResponseText: fragment.optimalResponseText !== undefined ? fragment.optimalResponseText : '',
        needsIdentification: fragment.needsIdentification !== undefined ? fragment.needsIdentification : true,
        instructions: fragment.instructions ? fragment.instructions : '',
        conceptID: fragment.conceptID,
        wordCountChange: fragment.wordCountChange || {},
        flag: fragment.flag ? fragment.flag : 'alpha',
      };

      return;
    }
  }

  handleChange = (key, e) => {
    const { wordCountChange } = this.state
    switch (key) {
      case 'prompt':
        this.setState({ prompt: e.target.value, });
        break;
      case 'optimalResponseText':
        this.setState({ optimalResponseText: e.target.value, });
        break;
      case 'instructions':
        this.setState({ instructions: e.target.value, });
        break;
      case 'isFragment':
        this.setState({ isFragment: e.target.checked, });
        break;
      case 'needsIdentification':
        this.setState({ needsIdentification: e.target.checked, });
        break;
      case 'maxWordCountChange':
        let newWordCountChange = { ...wordCountChange }
        newWordCountChange.max = e.target ? e.target.value : '';
        this.setState({ wordCountChange: newWordCountChange, });
        break;
      case 'minWordCountChange':
        newWordCountChange = { ...wordCountChange }
        newWordCountChange.min = e.target ? e.target.value : '';
        this.setState({ wordCountChange: newWordCountChange, });
        break;
      case 'flag':
        this.setState({ flag: e.target.value, });
        break;
      default:
    }
  };

  handleSelectorChange = (e) => {
    this.setState({ conceptID: e.value, });
  }

  submitSentenceFragment = () => {
    const data = this.state;
    this.props.submit(data);
  };

  conceptsToOptions = () => {
    return _.map(this.props.concepts.data['0'], concept => (
      { name: concept.displayName, value: concept.uid, shortenedName: concept.name, }
    ));
  };

  renderOptimalResponseTextInput = () => {
    return (
      [
        (<label className="label">Optimal Answer Text (The most obvious short answer, you can add more later)</label>),
        (<p className="control">
          <input className="input" onChange={(e) => this.handleChange('optimalResponseText', e)} type="text" value={this.state.optimalResponseText} />
        </p>)
      ]
    );
  };

  wordCountInfo = (minOrMax) => {
    if (this.state.wordCountChange && this.state.wordCountChange[minOrMax]) {
      return this.state.wordCountChange[minOrMax];
    }
  };

  render() {
    const { conceptID, flag, isFragment, instructions, needsIdentification, prompt } = this.state
    return (
      <div>
        <label className="label">Sentence / Fragment Prompt</label>
        <p className="control">
          <input className="input" onChange={(e) => this.handleChange('prompt', e)} type="text" value={prompt} />
        </p>
        <label className="label">Instructions</label>
        <p className="control">
          <textarea className="input" onChange={(e) => this.handleChange('instructions', e)} value={instructions} />
        </p>

        <p className="control">
          <label className="checkbox">
            <input checked={isFragment} onClick={(e) => this.handleChange('isFragment', e)} type="checkbox" />
            This is a fragment.
          </label>
        </p>
        <p className="control">
          <label className="max_word_count_change">
            Max Word Count Change
            <input onChange={(e) => this.handleChange('maxWordCountChange', e)} pattern="^-?[0-9]\d*\.?\d*$" type="tel" value={this.wordCountInfo('max')} />
          </label>
          <br />
          <label className="min_word_count_change">
            Min Word Count Change
            <input onChange={(e) => this.handleChange('minWordCountChange', e)} pattern="^-?[0-9]\d*\.?\d*$" type="tel" value={this.wordCountInfo('min')} />
          </label>
        </p>
        <p className="control">
          <label className="checkbox">
            <input checked={needsIdentification} onClick={(e) => this.handleChange('needsIdentification', e)} type="checkbox" />
            Show a multiple choice question to identify sentence or fragment.
          </label>
        </p>
        {this.renderOptimalResponseTextInput()}
        <FlagDropdown flag={flag} handleFlagChange={(e) => this.handleChange('flag', e)} isLessons={false} />
        <p className="control">
          <label className="label">Associated Concept</label>
          <ConceptSelector
            currentConceptUID={conceptID}
            handleSelectorChange={this.handleSelectorChange}
          />
        </p>
        <button className="button is-primary is-outlined" onClick={this.submitSentenceFragment}>Save</button>
      </div>
    );
  }
}

export default sentenceFragmentForm;
