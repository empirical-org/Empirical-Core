import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ArchivedButton, hashToCollection } from '../../../Shared/index';
import { QuestionList } from '../shared/questionList';

class FillInBlankQuestions extends Component {
  constructor(props) {
    super(props)

    const { fillInBlank } = props

    this.state = {
      questions: fillInBlank.data || null,
      showOnlyArchived: false
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { fillInBlank, } = nextProps
    if (fillInBlank.hasreceiveddata) {
      if (Object.keys(this.state.questions).length === 0 || !_.isEqual(this.props.fillInBlank.data, fillInBlank.data)) {
        this.setState({ questions: fillInBlank.data, })
      }
    }
  }

  toggleShowArchived = () => {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <ArchivedButton lessons={false} showOnlyArchived={this.state.showOnlyArchived} toggleShowArchived={this.toggleShowArchived} />
          <p className="menu-label">Fill In The Blank</p>
          <QuestionList
            basePath="fill-in-the-blanks"
            questions={hashToCollection(this.state.questions) || []}
            showOnlyArchived={this.state.showOnlyArchived}
          />
        </div>
      </section>
    );
  }
}

function select(props) {
  return {
    fillInBlank: props.fillInBlank
  };
}

export default connect(select)(FillInBlankQuestions);
