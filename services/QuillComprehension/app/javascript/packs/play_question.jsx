import * as React from 'react'
import * as ReactDOM from 'react-dom'
import request from 'request';

class PlayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      feedback: null,
      correct: false,
      label: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    // early exit for empty form
    if (this.state.value === '') {
      this.setState({feedback: "Please finish the thesis statement using evidence from the passage."})
      return
    }

    this.setState({feedback: null, label: null})

    request.post({
      url: this.props.endpoint,
      form: {entry: this.state.value}
    }, function callback(_, response, body) {

      if (response.statusCode === 200) {
        const json = JSON.parse(body)
        this.setState({feedback: json.message, correct: json.correct, label: json.label})
      } else {
        this.setState({feedback: "Something went wrong", correct: false})
      }
    }.bind(this))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <span className="prompt">{this.props.prompt}</span>
          <input className="entry" onChange={this.handleChange} type="text" value={this.state.value} />
        </label>
        <input className="right btn" type="submit" value="Submit" />
        {this.state.feedback === null ? '' : (<div className={"feedback " + (this.state.correct ? 'correct' : '')}>{this.state.feedback}</div>)}
        {this.state.label === null ? '' : (<div className="feedback_label">{this.state.label}</div> )}
      </form>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const targetID = document.getElementById('play-form')

  ReactDOM.render(
    <PlayForm
      endpoint={targetID.dataset.target}
      prompt={targetID.dataset.prompt}
    />,
    targetID
  )
})
