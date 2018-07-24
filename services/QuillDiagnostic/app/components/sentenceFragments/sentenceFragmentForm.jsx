import React from 'react';
import { Link } from 'react-router';
import ConceptSelector from '../shared/conceptSelector.jsx';
import { FlagDropdown } from 'quill-component-library/dist/componentLibrary';

const sentenceFragmentForm = React.createClass({

  getInitialState() {
    const fragment = this.props.data;
    if (fragment === undefined) { // creating new fragment
      return {
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
      return {
        prompt: fragment.prompt,
        isFragment: fragment.isFragment,
        optimalResponseText: fragment.optimalResponseText !== undefined ? fragment.optimalResponseText : '',
        needsIdentification: fragment.needsIdentification !== undefined ? fragment.needsIdentification : true,
        instructions: fragment.instructions ? fragment.instructions : '',
        conceptID: fragment.conceptID,
        wordCountChange: fragment.wordCountChange || {},
        flag: fragment.flag ? fragment.flag : 'alpha',
      };
    }
  },

  handleChange(key, e) {
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
        let newWordCountChange = Object.assign({}, this.state.wordCountChange);
        newWordCountChange.max = e.target.valueAsNumber;
        this.setState({ wordCountChange: newWordCountChange, });
        break;
      case 'minWordCountChange':
        newWordCountChange = Object.assign({}, this.state.wordCountChange);
        newWordCountChange.min = e.target.valueAsNumber;
        this.setState({ wordCountChange: newWordCountChange, });
        break;
      case 'flag':
        this.setState({ flag: e.target.value, });
        break;
      default:
    }
  },

  submitSentenceFragment() {
    const data = this.state;
    this.props.submit(data);
  },

  conceptsToOptions() {
    return _.map(this.props.concepts.data['0'], concept => (
        { name: concept.displayName, value: concept.uid, shortenedName: concept.name, }
      ));
  },

  renderOptimalResponseTextInput() {
    return (
    [
        (<label className="label">Optimal Answer Text (The most obvious short answer, you can add more later)</label>),
        (<p className="control">
          <input className="input" type="text" value={this.state.optimalResponseText} onChange={this.handleChange.bind(null, 'optimalResponseText')} />
        </p>)
    ]
    );
  },

  wordCountInfo(minOrMax) {
    if (this.state.wordCountChange && this.state.wordCountChange[minOrMax]) {
      return this.state.wordCountChange[minOrMax];
    }
  },

  render() {
    // console.log("State: ", this.state)
    const fuse = {
      keys: ['shortenedName', 'name'], // first search by specific concept, then by parent and grandparent
      threshold: 0.4,
    };
    return (
      <div>
        <label className="label">Sentence / Fragment Prompt</label>
        <p className="control">
          <input className="input" type="text" value={this.state.prompt} onChange={this.handleChange.bind(null, 'prompt')} />
        </p>
        <label className="label">Instructions</label>
        <p className="control">
          <textarea className="input" value={this.state.instructions} onChange={this.handleChange.bind(null, 'instructions')} />
        </p>

        <p className="control">
          <label className="checkbox">
            <input type="checkbox" checked={this.state.isFragment} onClick={this.handleChange.bind(null, 'isFragment')} />
            This is a fragment.
          </label>
        </p>
        <p className="control">
          <label className="max_word_count_change">
            Max Word Count Change
            <input type="number" value={this.wordCountInfo('max')} onChange={this.handleChange.bind(null, 'maxWordCountChange')} />
          </label>
          <br />
          <label className="min_word_count_change">
            Min Word Count Change
            <input type="number" value={this.wordCountInfo('min')} onChange={this.handleChange.bind(null, 'minWordCountChange')} />
          </label>
        </p>
        <p className="control">
          <label className="checkbox">
            <input type="checkbox" checked={this.state.needsIdentification} onClick={this.handleChange.bind(null, 'needsIdentification')} />
            Show a multiple choice question to identify sentence or fragment.
          </label>
        </p>
        {this.renderOptimalResponseTextInput()}
        <FlagDropdown flag={this.state.flag} handleFlagChange={this.handleChange.bind(null, 'flag')} isLessons={false}/>
        <p className="control">
          <label className="label">Associated Concept</label>
          <ConceptSelector
            currentConceptUID={this.state.conceptID}
            handleSelectorChange={this.handleChange.bind(null, 'concept')}
          />
        </p>
        <button className="button is-primary is-outlined" onClick={this.submitSentenceFragment}>Save</button>
      </div>
    );
  },
});

export default sentenceFragmentForm;
