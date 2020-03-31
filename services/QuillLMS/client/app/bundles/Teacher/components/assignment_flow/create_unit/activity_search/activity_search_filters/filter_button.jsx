import PropTypes from 'prop-types';
import React from 'react';

export default class FilterButton extends React.Component {
  static propTypes = {
    handleFilterButtonClick: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    active: PropTypes.bool,
  };

  handleClick = () => {
    this.props.handleFilterButtonClick(this.props.data.id);
  };

  render() {
    const { data, active, } = this.props
    const activeClassName = active ? 'active' : null;
    return (
      <button className={`${activeClassName} ${data.key} filter-button`} onClick={this.handleClick}>
        <div className={`tool-${data.key}-gray`} />
        <div>
          <h4>{data.alias}</h4>
          <p>{data.description}</p>
        </div>
      </button>
    );
  }
}
