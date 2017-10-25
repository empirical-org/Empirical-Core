import React from 'react';
import $ from 'jquery';

export default React.createClass({

  updateName(e) {
    const unitName = $(this.refs.name).val();
    this.props.updateUnitName(unitName);
  },

  render() {
    return (
      <section className="section-content-wrapper name-the-unit">
        <p className="section-header">Name Your Activity Pack:</p>
        <input className={this.props.nameError} id="unit_name" ref="name" onChange={this.updateName} value={this.props.unitName} type="text" placeholder="e.g. Learning How to Use Nouns" />
      </section>
    );
  },

});
