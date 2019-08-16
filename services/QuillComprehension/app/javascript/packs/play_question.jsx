import * as React from 'react'
import * as ReactDOM from 'react-dom'
import request from 'request';

class PlayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '', feedback: null};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    this.setState({feedback: null})

    request.post({
      url: this.props.endpoint,
      form: {entry: this.state.value}
    }, function callback(_, response, body) {

      if (response.statusCode === 200) {
        const feedback = JSON.parse(body).message
        this.setState({feedback: feedback})
      } else {
        this.setState({feedback: "Something went wrong"})
      }
    }.bind(this))
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          {this.props.prompt}
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
        {this.state.feedback === null ? '' : (<div className="feedback">{this.state.feedback}</div>)}
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