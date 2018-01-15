'use strict'

 import React from 'react'
 import _ from 'underscore'
 import UnitTemplateMini from '../unit_template_minis/unit_template_mini/unit_template_mini'

 export default React.createClass({
  propTypes: {
    models: React.PropTypes.array,
    actions: React.PropTypes.object
  },

  miniView: function(model, index) {
    return (
      <div key={model.id} className={`unit-template-container  small-screen-unit-template-container`}>
        <UnitTemplateMini data={model}  index={index} signedInTeacher={this.props.authenticated}/>
      </div>
    );
  },

  render: function() {
    var displayedId = this.props.data;
    var relatedModels = _.reject(this.props.models, function(other) {
      return other.id === displayedId;
    });
    var cols = _.map(relatedModels.slice(0, 2), this.miniView);
    return (
      <div>
            <h2>
              Related Activity Packs:
            </h2>
        <div className='flex-row space-between featured-cards'>
          {cols}
        </div>
      </div>
    );
  }
});
