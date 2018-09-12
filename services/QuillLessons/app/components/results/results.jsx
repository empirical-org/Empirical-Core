import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { QuestionListByConcept } from 'quill-component-library/dist/componentLibrary'
import _ from 'underscore'

const Results = React.createClass({
  render: function () {
    const {questions, concepts} = this.props
    return (
      <section className="section is-fullheight minus-nav">
        <div className="container">
          <h1 className="title">
            Choose a lesson
          </h1>
          <h2 className="subtitle">
            You can analyze the results here.
          </h2>
          <QuestionListByConcept displayNoConceptQuestions={false} questions={questions} concepts={concepts} baseRoute={"results"} />
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

export default connect(select)(Results)
