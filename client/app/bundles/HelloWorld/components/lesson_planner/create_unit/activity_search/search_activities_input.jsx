'use strict'

 import React from 'react'

 export default  React.createClass({

   getInitialState: function() {
     return {value: this.props.searchQuery};
   },

   handleChange: function(e){
     this.setState({value: e.target.value});
   },

  componentWillReceiveProps: function(nextProps){
    this.setState({value: nextProps.searchQuery})
 	},

	newSearchQuery: function () {
		this.props.updateSearchQuery(this.state.value);
	},

	render: function () {
		return (
			<span>
				<input id="search_activities_input" value={this.state.value} onChange={this.handleChange} type="text" placeholder="Search Concepts and Activities" />
				<button onClick={this.newSearchQuery} id="search_activities_button" className="button-gray">Search</button>
			</span>
		);
	}

});
