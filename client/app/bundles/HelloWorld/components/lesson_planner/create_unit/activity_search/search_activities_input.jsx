'use strict'

 import React from 'react'

 export default  React.createClass({

   getInitialState: function() {
     return {input: ''};
   },

   handleChange: function(e){
     this.setstate({input: e.target.value});
   },

	newSearchQuery: function () {
		this.props.updateSearchQuery(this.state.input);
	},

	render: function () {
		return (
			<span>
				<input id="search_activities_input" value={this.state.value} onChange={this.handleChange} type="text" placeholder="Search Activities" />
				<button onClick={this.newSearchQuery} id="search_activities_button" className="button-gray">Search</button>
			</span>
		);
	}

});
