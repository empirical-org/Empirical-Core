import React from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import { connect } from 'react-redux'
import NavBar from '../navbar/navbar.jsx';
import conceptActions from '../../actions/concepts'
import conceptsFeedbackActions from '../../actions/concepts-feedback'
import questionActions from '../../actions/questions'
import sentenceFragmentActions from '../../actions/sentenceFragments'
import pathwayActions from '../../actions/pathways'
import lessonActions from '../../actions/lessons'
import levelActions from '../../actions/item-levels'

const TabLink = activeComponent('li')

const adminContainer = React.createClass({
  componentWillMount: function () {
    this.props.dispatch( conceptActions.startListeningToConcepts() );
    this.props.dispatch( conceptsFeedbackActions.startListeningToConceptsFeedback() );
    this.props.dispatch( questionActions.startListeningToQuestions() );
    this.props.dispatch( sentenceFragmentActions.startListeningToSentenceFragments() );
    this.props.dispatch( pathwayActions.startListeningToPathways() );
    this.props.dispatch( lessonActions.startListeningToLessons() );
    this.props.dispatch( levelActions.startListeningToItemLevels() );
  },

  render: function () {
    return (
      <div>
        <NavBar/>
        <section className="section is-fullheight minus-nav">
          <div className="container">
            <div className="example">
              <div className="tabs">
                <ul>
                  <TabLink to={"/admin/concepts"} activeClassName="is-active">Concepts</TabLink>
                  <TabLink to={"/admin/questions"} activeClassName="is-active">Questions</TabLink>
                  <TabLink to={"/admin/sentence-fragments"} activeClassName="is-active">Sentence Fragments</TabLink>
                  <TabLink to={"/admin/lessons"} activeClassName="is-active">Lessons</TabLink>
                  <TabLink to={"/admin/diagnostics"} activeClassName="is-active">Diagnostics</TabLink>
                  <TabLink to={"admin/concepts-feedback"} activeClassName="is-active">Concept Feeback</TabLink>
                  <TabLink to={"/admin/item-levels"} activeClassName="is-active">Item Levels</TabLink>
                </ul>
              </div>
            </div>
            {this.props.children}
          </div>
        </section>
      </div>

    )
  }
})

function select(state) {
  return {
  }
}

export default connect(select)(adminContainer)
