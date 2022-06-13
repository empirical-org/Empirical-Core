import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { QuestionList } from '../shared/questionList.tsx'
import { hashToCollection, ArchivedButton } from '../../../Shared/index'

class FillInBlankQuestions extends Component {
  constructor(props) {
    super(props)

    const { fillInBlank } = props

    this.state = {
      diagnosticQuestions: fillInBlank.data || null
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { fillInBlank, lessons } = nextProps
    const { diagnosticQuestions } = this.state;
    if (fillInBlank.hasreceiveddata && lessons.hasreceiveddata) {
      if (Object.keys(diagnosticQuestions).length === 0 || !_.isEqual(this.props.fillInBlank.data, fillInBlank.data) || (!_.isEqual(this.props.lessons.data, lessons.data))) {
        this.setState({ diagnosticQuestions: fillInBlank.data })
      }
    }
  }

  toggleShowArchived = () => {
    const { showOnlyArchived } = this.state;
    this.setState({
      showOnlyArchived: !showOnlyArchived,
    });
  };

  render() {
    const { diagnosticQuestions, showOnlyArchived } = this.state;
    return (
      <section className="section">
        <div className="admin-container">
          <Link to="/admin/fill-in-the-blanks/new">
            <button className="button is-primary">Create a New Fill In The Blank</button>
          </Link>
          <ArchivedButton lessons={false} showOnlyArchived={showOnlyArchived} toggleShowArchived={this.toggleShowArchived} />
          <p className="menu-label">Fill In The Blank</p>
          <QuestionList
            basePath="fill-in-the-blanks"
            questions={hashToCollection(diagnosticQuestions) || []}
            showOnlyArchived={showOnlyArchived}
          />
        </div>
      </section>
    );
  }
}

function select(props) {
  return {
    fillInBlank: props.fillInBlank,
    lessons: props.lessons,

  };
}

export default connect(select)(FillInBlankQuestions);
