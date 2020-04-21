import React from 'react';
import ConceptSelector from '../shared/conceptSelector.jsx';
import { FlagDropdown } from 'quill-component-library/dist/componentLibrary';

class sentenceFragmentForm extends React.Component {
  constructor(props) {
    super(props);
    console.log('props', props)
    const { data } = props

    if (!data) {
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
    } else {
      const { prompt, isFragment, optimalResponseText, needsIdentification, instructions, conceptID, wordCountChange, flag } = data
      this.state = {
        prompt,
        isFragment,
        optimalResponseText: optimalResponseText || '',
        needsIdentification: needsIdentification || true,
        instructions: instructions || '',
        conceptID,
        wordCountChange: wordCountChange || {},
        flag: flag || 'alpha'
      };
    }
  }

  conceptsToOptions = () => {
    const { concepts } = this.props
    const { data } = concepts
    return _.map(data['0'], concept => (
        { name: concept.displayName, value: concept.uid, shortenedName: concept.name, }
      ));
  };

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
      case 'concept':
        this.setState({ conceptID: e.value, });
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

  submitSentenceFragment = () => {
    const { submit } = this.props
    const data = this.state;
    submit(data);
  };

  wordCountInfo = (minOrMax) => {
    const { wordCountChange } = this.state
    if (wordCountChange && wordCountChange[minOrMax]) {
      return wordCountChange[minOrMax];
    }
  };

  renderOptimalResponseTextInput = () => {
    const { optimalResponseText } = this.state
    return (
    [
        (<label className="label">Optimal Answer Text (The most obvious short answer, you can add more later)</label>),
        (<p className="control">
          <input className="input" onChange={this.handleChange.bind(null, 'optimalResponseText')} type="text" value={optimalResponseText} />
        </p>)
    ]
    );
  };

  render() {
    const { prompt, isFragment, needsIdentification, instructions, conceptID, flag } = this.state
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
            <input onChange={(e) => this.handleChange('maxWordCountChange', e)} type="number" value={this.wordCountInfo('max')} />
          </label>
          <br />
          <label className="min_word_count_change">
            Min Word Count Change
            <input onChange={(e) => this.handleChange('minWordCountChange', e)} type="number" value={this.wordCountInfo('min')} />
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
            handleSelectorChange={(e) => this.handleChange('concept', e)}
          />
        </p>
        <button className="button is-primary is-outlined" onClick={this.submitSentenceFragment}>Save</button>
      </div>
    );
  }
}

export default sentenceFragmentForm;
