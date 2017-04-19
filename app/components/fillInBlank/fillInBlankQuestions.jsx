import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FillInTheBlankList from './fillInBlankList.jsx';
import { hashToCollection } from '../../libs/hashToCollection';

class FillInBlankQuestions extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <Link to={'admin/fill-in-the-blanks/new'}>
            <button className="button is-primary">Create a New Fill In The Blank</button>
          </Link>
          <p className="menu-label">Fill In The Blank</p>
          <FillInTheBlankList fillInTheBlanks={hashToCollection(this.props.fillInBlank.data) || []} />
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
