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
    var className;
    if (index === 0) {
      className = 'col-xs-6 no-pr';
    } else {
      className = 'col-xs-6 no-pl';
    }
    return (
      <div key={model.id} className={`${className} small-screen-unit-template-container`}>
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
      <span className="related-activity-packs" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: '100%', display: 'flex', justifyContent: 'flex-start'}} className='row'>
          <div className='col-xs-12'>
            <h2>
              Related Activity Packs:
            </h2>
          </div>
        </div>
        <div>
          {cols}
        </div>
      </span>
    );
  }
});
