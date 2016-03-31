import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const play = React.createClass({
  renderQuestions: function () {
    const {data} = this.props.questions;
    const keys = _.keys(data);
    return keys.map((key) => {
      return (<li key={key}><Link to={'/play/questions/' + key} activeClassName="is-disabled">{data[key].prompt}</Link></li>)
    })
  },

  render: function () {
    return (
      <section className="section is-fullheight minus-nav">
        <div className="container">
          <h1 className="title">
            Choose a Question
          </h1>
          <h2 className="subtitle">
            Combine multiple sentences into one strong one!
          </h2>
          <ul>
            {this.renderQuestions()}
          </ul>
        </div>
      </section>
    )
  }
})

function select(state) {
  return {
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(play)
