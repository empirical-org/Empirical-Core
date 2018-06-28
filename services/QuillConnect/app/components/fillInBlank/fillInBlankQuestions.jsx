import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { QuestionList } from 'quill-component-library/dist/componentLibrary';
import { hashToCollection } from 'quill-component-library/dist/componentLibrary';
import ArchivedButton from '../shared/archivedButton.jsx'
import { getNonDiagnosticQuestions } from '../../libs/getNonDiagnosticQuestions'

class FillInBlankQuestions extends Component {
  constructor() {
    super();
    this.state = {
      showOnlyArchived: false,
      questions: {}
    }
    this.toggleShowArchived = this.toggleShowArchived.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { fillInBlank, diagnosticLessons } = nextProps
    if (fillInBlank.hasreceiveddata && diagnosticLessons.hasreceiveddata) {
      if (Object.keys(this.state.questions).length === 0 || !_.isEqual(this.props.fillInBlank.data, fillInBlank.data) || (!_.isEqual(this.props.diagnosticLessons.data, diagnosticLessons.data))) {
        this.setState({ questions: getNonDiagnosticQuestions(diagnosticLessons.data, fillInBlank.data) })
      }
    }
  }

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <Link to={'admin/fill-in-the-blanks/new'}>
            <button className="button is-primary">Create a New Fill In The Blank</button>
          </Link>
          <ArchivedButton showOnlyArchived={this.state.showOnlyArchived} toggleShowArchived={this.toggleShowArchived} lessons={false} />
          <p className="menu-label">Fill In The Blank</p>
          <QuestionList
            questions={hashToCollection(this.state.questions) || []}
            showOnlyArchived={this.state.showOnlyArchived}
            basePath="fill-in-the-blanks"
          />
        </div>
      </section>
    );
  }

}

function select(props) {
  return {
    fillInBlank: props.fillInBlank,
    diagnosticLessons: props.diagnosticLessons
  };
}

export default connect(select)(FillInBlankQuestions);
