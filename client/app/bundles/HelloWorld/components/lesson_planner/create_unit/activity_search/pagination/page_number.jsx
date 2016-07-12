'use strict'

 import React from 'react'

 export default React.createClass({

  getInitialState: function(){
    return {isCurrentPage: null, classy: null};
  },

  componentDidMount: function(){
    if (this.props.number == this.props.currentPage) {
      this.setState({isCurrentPage: true, classy: 'page_number active'});
    } else {
      this.setState({isCurrentPage: false, classy: 'page_number'});
    }
  },

	clickNumber: function () {
		if (this.state.isCurrentPage === false) {
			this.props.selectPageNumber(this.props.number);
		}
	},

	render: function () {
		return (
			<li onClick={this.clickNumber} className={this.state.classy}>
				<span>{this.props.number}</span>
			</li>
		);
	}
});
