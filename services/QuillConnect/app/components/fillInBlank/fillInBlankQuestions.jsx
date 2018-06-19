import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FillInTheBlankList from './fillInBlankList.jsx';
import { hashToCollection } from '../../libs/hashToCollection';
import ArchivedButton from '../shared/archivedButton.jsx'
import { QuestionList } from 'quill-component-library/dist/componentLibrary';

class FillInBlankQuestions extends Component {
  constructor() {
    super();
    this.state = {
      showOnlyArchived: false,
    }
    this.toggleShowArchived = this.toggleShowArchived.bind(this);
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
            questions={hashToCollection(this.props.fillInBlank.data) || []}
            showOnlyArchived={this.state.showOnlyArchived}
            basePath={'fill-in-the-blanks'}
          />
        </div>
      </section>
    );
  }

}

function select(props) {
  return {
    fillInBlank: props.fillInBlank,
  };
}

export default connect(select)(FillInBlankQuestions);
