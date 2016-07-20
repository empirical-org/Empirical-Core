import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
// import questionActions from '../../actions/questions'
import _ from 'underscore'
import Modal from '../modal/modal.jsx'
// import {hashToCollection} from '../../libs/hashToCollection'
import C from '../../constants'

export default React.createClass({
  render: function() {
      let text="";
      let feedback="";
      if(this.props.fp) {
        text = this.props.fp.text;
        feedback = this.props.fp.feedback;
      }
      return (
        <div className="box">
              <h4 className="control title is-4">Focus Point: {text}</h4>
              <h6 className="control sub-title is-6">Feedback: {feedback}</h6>
              {this.props.children}
        </div>
      );
  }
});
