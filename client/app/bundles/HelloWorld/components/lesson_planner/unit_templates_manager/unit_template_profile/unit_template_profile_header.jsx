'use strict'

 import React from 'react'
 import CategoryLabel from '../../category_labels/category_label'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  divStyle: function () {
    return {
      backgroundColor: this.props.data.model.unit_template_category.primary_color
    };
  },

  render: function () {
    return (
      <div className='big-title row' style={this.divStyle()}>
        <CategoryLabel data={this.props.data.model.unit_template_category}
                          filterByCategory={this.props.actions.filterByCategory}
                          backgroundColor={this.props.data.model.unit_template_category.secondaryColor} />
        <h1><strong>{this.props.data.model.name}</strong></h1>
        <div className="author-details">
          <div className="author-picture">
            <img src={this.props.data.model.author.avatar_url}></img>
          </div>
          <p>by {this.props.data.model.author.name}</p>
        </div>
      </div>
    )
  }

});
