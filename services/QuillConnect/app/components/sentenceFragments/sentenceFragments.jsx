import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import { QuestionList } from 'quill-component-library/dist/componentLibrary';
import SentenceFragmentsList from './sentenceFragmentsList.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import ArchivedButton from '../shared/archivedButton.jsx'

const SentenceFragments = React.createClass({

  getInitialState() {
    return {
      showOnlyArchived: false,
    };
  },

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  },

  render() {
    const sentenceFragments = hashToCollection(this.props.sentenceFragments.data)
    return (
      <section className="section">
        <div className="container">
          <Link to={'admin/sentence-fragments/new'}>
            <button className="button is-primary">Create a New Sentence Fragment</button>
          </Link>
          <ArchivedButton showOnlyArchived={this.state.showOnlyArchived} toggleShowArchived={this.toggleShowArchived} lessons={false} />

          <p className="menu-label">Sentence Fragments</p>
          <QuestionList
            questions={sentenceFragments || []}
            showOnlyArchived={this.state.showOnlyArchived}
            basePath={'sentence-fragments'}
          />
        </div>
      </section>
    )
  }
})

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    routing: state.routing
  }
}

export default connect(select)(SentenceFragments)
