import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'

import SentenceFragmentsList from './sentenceFragmentsList.jsx'
import {hashToCollection} from '../../libs/hashToCollection'

const SentenceFragments = React.createClass({

  render() {
    const sentenceFragments = hashToCollection(this.props.sentenceFragments.data)
    return (
      <section className="section">
        <div className="container">
          <Link to={'admin/sentence-fragments/new'}>
            <button className="button is-primary">Create a New Sentence Fragment</button>
          </Link>
          <p className="menu-label">Sentence Fragments</p>
          <SentenceFragmentsList sentenceFragments={sentenceFragments || []}/>
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
