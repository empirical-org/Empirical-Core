import React from 'react'
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

export default createReactClass({

  propTypes: {
    handleFilterButtonClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    active: PropTypes.bool,
  },

  handleClick() {
    this.props.handleFilterButtonClick(this.props.data.id);
  },

  render() {
    const active = this.props.active ? 'active' : null;
    return (
      <button className={active} onClick={() => this.handleClick()}>
        <div className={`icon-${this.props.data.id}-gray`} />
        <div>
          <h4>{this.props.data.alias}</h4>
          <p>{this.props.data.description}</p>
        </div>
      </button>
    );
  },

});
