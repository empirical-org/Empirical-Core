import React from 'react'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import {connect} from 'react-redux'

const EndState = React.createClass({

  renderStaticText: function() {
    let message = ""
    if(this.props.answeredCorrectly) {
      message = "Good work! Here are the most popular strong answers:"
    } else {
      message = "Nice try, but that's not quite right. Keep going! Here are the most popular strong answers:"
    }
    return (
      <h5 className="title is-5">{message}</h5>
    )
  },

  renderTopThreeResponses: function() {
    let responses = this.props.questions.data[this.props.questionID].responses
    responses = hashToCollection(responses)
    responses = responses.filter((response) => {
      return response.optimal
    }).sort(function(a, b) {
      return b.count-a.count
    })

    let responsesToRender = _.first(responses, 3)
    const sum = _.reduce(responsesToRender, function(memo, response) {return memo+response.count}, 0)
    return responsesToRender.map((response, index) => {
      return (
        <li>{(index+1) + ". " + response.text + "\t(" + (Math.floor(response.count*100/sum)) + "%)"}</li>
      )
    })
  },

  render: function() {
    const listStyle = {
      "listStyle": "none",
      "marginLeft": "1em",
    }
    return (
      <div className="end-state-container">
        {this.renderStaticText()}
        <ul style={listStyle}>
          {this.renderTopThreeResponses()}
        </ul>
      </div>
    )
  }
})

function select(state) {
  return {
    questions: state.questions,
  }
}
export default connect(select)(EndState)
