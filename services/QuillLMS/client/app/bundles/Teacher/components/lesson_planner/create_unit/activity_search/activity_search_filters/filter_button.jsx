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
    const { data, active, } = this.props
    const activeClassName = active ? 'active' : null;
    return (
      <button className={`${activeClassName} ${data.key}`} onClick={() => this.handleClick()}>
        <div className={`tool-${data.key}-gray`} />
        <div>
          <h4>{data.alias}</h4>
          <p>{data.description}</p>
        </div>
      </button>
    );
  },

});
