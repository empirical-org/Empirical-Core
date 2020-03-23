import React from 'react'
import { connect } from 'react-redux'
import { QuestionListByConcept } from 'quill-component-library/dist/componentLibrary'
import _ from 'underscore'

const Results = props => {
  const {questions, concepts} = props
  return (
    <section className="section is-fullheight minus-nav">
      <div className="container">
        <h1 className="title">
          Choose a lesson
        </h1>
        <h2 className="subtitle">
          You can analyze the results here.
        </h2>
        <QuestionListByConcept baseRoute={"results"} concepts={concepts} displayNoConceptQuestions={false} questions={questions} />
      </div>
    </section>
  )
};

function select(state) {
  return {
    concepts: state.concepts,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(Results)
