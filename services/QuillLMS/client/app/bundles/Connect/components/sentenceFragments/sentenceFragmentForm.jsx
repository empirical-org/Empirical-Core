import React from 'react';
import { FlagDropdown } from '../../../Shared/index';
import C from '../../constants.js';
import ConceptSelector from '../shared/conceptSelector.jsx';

class sentenceFragmentForm extends React.Component {
  constructor(props) {
    super(props);
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
        flag: 'alpha',
        showDefaultInstructions: false
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
        flag: flag || 'alpha',
        showDefaultInstructions: false
      };
    }
  }

  handleChange = e => {
    const key = e.currentTarget.getAttribute('data-value')
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
        if (e.target.value == '/') {
          this.setState({ showDefaultInstructions: true})
        } else {
          this.setState({ showDefaultInstructions: false})
        }
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
      default:
    }
  };

  handleFlagChange = e => {
    this.setState({ flag: e.target.value, });
  }

  handleConceptChange = e => {
    this.setState({ conceptID: e.value, });
  }

  submitSentenceFragment = () => {
    const { submit } = this.props
    const { isFragment, needsIdentification, prompt, optimalResponseText, wordCountChange, conceptID } = this.state
    if (!isFragment && !needsIdentification) {
      alert('If the prompt is a sentence, the student must identify whether it is a sentence or fragment. Please try again.');
      return;
    }
    let optimalResponse = {}
    if (isFragment) {
      optimalResponse = {
        text: optimalResponseText,
        optimal: true,
        feedback: "That's a strong sentence!",
      };
    } else {
      optimalResponse = {
        text: prompt,
        optimal: true,
        feedback: "That's a strong sentence!",
      };
    }

    const data = this.state;
    submit(data, optimalResponse);
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
          <input className="input" data-value="optimalResponseText" onChange={this.handleChange} type="text" value={optimalResponseText} />
        </p>)
      ]
    );
  };

  renderDefaultInstructions = () => {
    const { showDefaultInstructions } = this.state
    const defaultInstructionsDiv = C.DEFAULT_SENTENCE_FRAGMENT_INSTRUCTIONS.map((item, i) =>
      (<button
        className="default"
        data-value="instructions"
        key={i}
        onClick={this.handleChange}
        type="button"
        value={item}
      >
        {item}
      </button>)
    )
    if (showDefaultInstructions) {
      return <div className='default-instructions'>{defaultInstructionsDiv}</div>
    }
  };

  render() {
    const { instructions } = this.state
    return(
      <div className="box">
        <h6 className="title is-h6">Edit Sentence Fragment</h6>
        <div>
          <label className="label">Sentence / Fragment Prompt</label>
          <p className="control">
            <input className="input" data-value="prompt" onChange={this.handleChange} type="text" value={this.state.prompt} />
          </p>
          <label className="label">Instructions</label>
          <p className="control">
            <input className="input" data-value="instructions" onChange={this.handleChange} placeholder="Type '/' for list of instructions" value={instructions} />
          </p>
          {this.renderDefaultInstructions()}
          <p className="control">
            <label className="checkbox">
              <input checked={this.state.isFragment} data-value="isFragment" onClick={this.handleChange} type="checkbox" />
              This is a fragment.
            </label>
          </p>
          <p className="control">
            <label className="max_word_count_change">
              Max Word Count Change
              <input data-value="maxWordCountChange" onChange={this.handleChange} type="number" value={this.wordCountInfo('max')} />
            </label>
            <br />
            <label className="min_word_count_change">
              Min Word Count Change
              <input data-value="minWordCountChange" onChange={this.handleChange} type="number" value={this.wordCountInfo('min')} />
            </label>
          </p>
          <p className="control">
            <label className="checkbox">
              <input checked={this.state.needsIdentification} data-value="needsIdentification" onClick={this.handleChange} type="checkbox" />
              Show a multiple choice question to identify sentence or fragment.
            </label>
          </p>
          {this.renderOptimalResponseTextInput()}
          <FlagDropdown data-value="flag" flag={this.state.flag} handleFlagChange={this.handleFlagChange} isLessons={false} />
          <p className="control">
            <label className="label">Associated Concept</label>
            <ConceptSelector
              currentConceptUID={this.state.conceptID}
              data-value="concept"
              handleSelectorChange={this.handleConceptChange}
            />
          </p>
          <button className="button is-primary is-outlined" onClick={this.submitSentenceFragment}>Save</button>
        </div>
      </div>
    );
  }
}

export default sentenceFragmentForm;
