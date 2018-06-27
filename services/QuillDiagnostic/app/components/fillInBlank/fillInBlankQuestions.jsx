import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { QuestionList } from 'quill-component-library/dist/componentLibrary';
import { hashToCollection } from '../../libs/hashToCollection';
import ArchivedButton from '../shared/archivedButton.jsx'
import { getDiagnosticQuestions } from '../../libs/getDiagnosticQuestions'

class FillInBlankQuestions extends Component {
  constructor() {
    super();
    this.state = {
      showOnlyArchived: false,
      diagnosticQuestions: {}
    }
    this.toggleShowArchived = this.toggleShowArchived.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { fillInBlank, lessons } = nextProps
    if (fillInBlank.hasreceiveddata && lessons.hasreceiveddata) {
      if (Object.keys(this.state.diagnosticQuestions).length === 0 || !_.isEqual(this.props.fillInBlank.data, fillInBlank.data) || (!_.isEqual(this.props.lessons.data, lessons.data))) {
        this.setState({ diagnosticQuestions: getDiagnosticQuestions(lessons.data, fillInBlank.data) })
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
            questions={hashToCollection(this.state.diagnosticQuestions) || []}
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
    lessons: props.lessons
  };
}

export default connect(select)(FillInBlankQuestions);
