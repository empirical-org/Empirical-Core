import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
// import questionActions from '../../actions/questions'
import _ from 'underscore'
// import {hashToCollection} from '../../libs/hashToCollection'
import C from '../../constants'

export default React.createClass({
    propTypes: {
      getFocusPoint: React.PropTypes.func.isRequired
    },

    render: function() {
        let fp = this.props.getFocusPoint();
        if (fp) {
          return (
            <div className="box">
              <h4 className="control title is-4">Focus Point: '{fp.text}'</h4>
              <h6 className="control sub-title is-6">Feedback: {fp.feedback}</h6>
            </div>
          );
    } else {
      return (<h1>NO FOCUS POINT</h1>);
    }
  }

});
