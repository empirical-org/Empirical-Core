import React from 'react';

export default React.createClass({

  propTypes: {
    handleFilterButtonClick: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool,
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
