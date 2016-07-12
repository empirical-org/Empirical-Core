import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const Diagnostics = React.createClass({
  getInitialState() {
    return {
      title: '',
      diagnosticQuestions: [],
    }
  },
  wellFormedConcepts(questionsWithConceptIDs) {
    const allConcepts = this.props.concepts.data
    let concepts = {}
    for (const key in questionsWithConceptIDs) {
      concepts[key] = { ...allConcepts[key], key }
    }
    return concepts
  },
  wellFormedQuestions() {
    let questions = this.props.questions.data
    for (const key in questions) {
      questions[key] = { ...questions[key], key }
    }
    return questions
  },
  changeTitle(event) {
    this.setState({title: event.target.value})
  },
  changeConcept(i, event) {
    let diagnosticQuestions = this.state.diagnosticQuestions
    diagnosticQuestions[i] = {
      ...diagnosticQuestions[i],
      concept: this.state.concepts[event.target.value]
    }
    this.setState({ diagnosticQuestions })
  },
  changeQuestion(i, event) {
    let diagnosticQuestions = this.state.diagnosticQuestions
    diagnosticQuestions[i] = {
      ...diagnosticQuestions[i],
      question: this.state.allQuestions[event.target.value]
    }
    this.setState({ diagnosticQuestions })
  },
  addQuestion() {
    let concepts = this.state.concepts
    let questions = this.state.questions
    if (!questions) {
      const allQuestions = this.wellFormedQuestions()
      questions = _.groupBy(allQuestions, 'conceptID')
      this.setState({ questions, allQuestions })
    }
    if (!concepts) {
      concepts = this.wellFormedConcepts(questions)
      this.setState({ concepts })
    }
    const firstConcept = Object.values(concepts)[0]
    const newDiagnosticQuestion = {
      concept: firstConcept,
      question: questions[firstConcept.key][0],
    }
    this.setState({
      diagnosticQuestions: this.state.diagnosticQuestions.concat(newDiagnosticQuestion)
    })
  },
  questionsForConcept(concept) {
    const conceptKey = concept && concept.key
    return this.state.questions[conceptKey] || []
  },
  render() {
    if (this.props.concepts.hasreceiveddata === false) {
      return (<p>Loading...</p>)
    }
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">
            <Link to={"/admin/diagnostics"}>
              <button
                className="button is-primary"
              >
                &#8592; Back
              </button>
            </Link>
          </h1>
          <div>
            <ul className="menu-list">
              Diagnostics are a series of questions where each question has
              up to two questions succeeding it:
              <li>
                -- No succeeding questions means this question is terminal and
                after answering it the student will be given their results.
              </li>
              <li>
                -- One succeeding question is a linear scenario: upon answering
                the question the student will go to the next question.
              </li>
              <li>
                -- Two succeeding questions is a branching scenario: each of
                the two questions are labeled as either optimal or
                sub-optimal and the diagnostic will choose the next question
                based on the student's success at the current question.
              </li>
            </ul>
          </div>
          <div className="columns">
            <div className="column is-half">
              <label className="label">Title</label>
              <input
                className="input"
                placeholder="Diagnostic title"
                value={this.state.title}
                onChange={this.changeTitle}
              />
            </div>
          </div>
          <div className="columns">
            <div className="column is-half">
              <button
                className="button is-primary"
                onClick={this.addQuestion}
              >
                &#43; Add question
              </button>
            </div>
          </div>
          { this.state.diagnosticQuestions.map((diagnosticQuestion, i) =>
            <div className="columns" key={diagnosticQuestion.key}>
              <div className="column is-half">
                <label className="label">{'Question #' + (i + 1)}</label>
                <p className="control is-grouped">
                  <span className="select">
                    <select
                      value={diagnosticQuestion.concept.key}
                      onChange={this.changeConcept.bind(this, i)}
                    >
                      { Object.values(this.state.concepts).map(concept =>
                      <option value={concept.key}>{ concept.name }</option>
                      ) }
                    </select>
                  </span>
                  <span className="select">
                    <select
                      value={diagnosticQuestion.question.key}
                      onChange={this.changeQuestion.bind(this, i)}
                    >
                      { this.questionsForConcept(diagnosticQuestion.concept).map(question =>
                      <option value={question.key}>{ question.prompt }</option>
                      ) }
                    </select>
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }
})

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing,
    questions: state.questions,
  }
}

export default connect(select)(Diagnostics)
