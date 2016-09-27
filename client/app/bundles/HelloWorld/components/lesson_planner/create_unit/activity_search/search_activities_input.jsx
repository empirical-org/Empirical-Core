'use strict'

 import React from 'react'

 export default  React.createClass({

   getInitialState: function() {
     return {value: ''};
   },

   handleChange: function(e){
     this.setState({value: e.target.value});
   },

   handleClick: function() {
     let that = this;
     this.setState({value: ''}, function(){that.newSearchQuery()});
   },

	newSearchQuery: function () {
		this.props.updateSearchQuery(this.state.value);
	},

	render: function () {
		return (
			<span>
				<input id="search_activities_input" value={this.state.value} onChange={this.handleChange} type="text" placeholder="Search Activities" />
        <img onClick={this.handleClick} src='/images/x.svg'/>
				<button onClick={this.newSearchQuery} id="search_activities_button" className="button-gray">Search</button>
			</span>
		);
	}

});
