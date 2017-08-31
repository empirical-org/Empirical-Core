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

  iconType() {
    let type = this.props.data.key;
    if (type === 'passage') {
      type = 'flag';
    } else if (type === 'sentence') {
      type = 'puzzle';
    }
    return type;
  },

  description() {
    switch (this.props.data.key) {
      case 'connect':
        return 'Combine Sentences';
      case 'sentence':
        return 'Practice Mechanics';
      case 'passage':
        return 'Fix Errors in Passages';
      case 'diagnostic':
        return 'Identify Learning Gaps';
    }
  },

  render() {
    const active = this.props.active ? 'active' : null;
    return (
      <button className={active} onClick={() => this.handleClick()}>
        <div className={`icon-${this.iconType()}-gray`} />
        <div>
          <h4>{this.props.data.alias}</h4>
          <p>{this.description()}</p>
        </div>
      </button>
    );
  },

});
