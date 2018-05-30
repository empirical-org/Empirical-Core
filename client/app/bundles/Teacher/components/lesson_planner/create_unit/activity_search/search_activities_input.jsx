import React from 'react';

export default React.createClass({

  getInitialState() {
    return { value: this.props.searchQuery, };
  },

  handleChange(e) {
    this.setState({ value: e.target.value, }, this.props.updateSearchQuery(e.target.value));
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.searchQuery, });
 	},

  newSearchQuery() {
    this.props.updateSearchQuery(this.state.value);
  },

  render() {
    return (
      <span>
        <input id="search_activities_input" value={this.state.value} onChange={this.handleChange} type="text" placeholder="Search Concepts and Activities" />
        <button onClick={this.newSearchQuery} id="search_activities_button" className="button-gray">Search</button>
      </span>
    );
  },

});
