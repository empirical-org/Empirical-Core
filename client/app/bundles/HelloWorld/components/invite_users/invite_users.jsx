import TextInputGenerator from '../modules/componentGenerators/text_input_generator.jsx'
import _ from 'lodash'
import React from 'react'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    var options = {
      isSingleRow: true
    }
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.props.actions.update, options)
    }
    return {}
  },

  render: function () {
    var input_objs = _.map(_.keys(this.props.data.model), function (field) {
      return {name: field,
              noLabel: true}
    }, this);
    var inputs = this.modules.textInputGenerator.generate(input_objs);
    return (
      <span>
        {inputs}
        <button onClick={this.props.actions.save}
                className='button-green add-user'>
            {"Add " + this.props.data.userType}
        </button>
      </span>
    );
  }
});
