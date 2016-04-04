import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {hashToCollection} from '../../libs/hashToCollection'
import _ from 'underscore'

const play = React.createClass({
  renderQuestions: function () {
    const concepts = hashToCollection(this.props.concepts.data);
    const questions = hashToCollection(this.props.questions.data);
    return concepts.map((concept) => {
      var label = (
        <p className="menu-label">
          {concept.name}
        </p>
      )
      var questionsForConcept = _.where(questions, {conceptID: concept.key})
      var listItems = questionsForConcept.map((question) => {
        return (<li key={question.key}><Link to={'/play/questions/' + question.key} activeClassName="is-disabled">{question.prompt}</Link></li>)
      })

      if (questionsForConcept.length === 0) {
        return
      }

      return [
        label,
        (<ul className="menu-list">
          {listItems}
        </ul>)
      ]

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
          <aside className="menu">
            {this.renderQuestions()}
          </aside>
        </div>
      </section>
    )
  }
})

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(play)
