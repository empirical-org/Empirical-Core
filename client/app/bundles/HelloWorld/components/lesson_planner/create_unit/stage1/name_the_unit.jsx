'use strict'

 import React from 'react'
 import $ from 'jquery'

 export default React.createClass({

	updateName: function (e) {
		var unitName = $(this.refs.name).val();
		this.props.updateUnitName(unitName);
	},

	render: function () {
		return (
			<section className="section-content-wrapper name-the-unit">
				<div className="col-xs-12 col-md-9 col-sm-9 col-xl-9 no-pl">
					<h3 className="section-header">Name the Activity Pack</h3>
				</div>

				<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 no-pl no-pr">

					<div className="how-we-grade">
						<p className="title title-not-started">

							<a href="http://support.quill.org/getting-started-for-teachers/assigning-activities/create-and-assign-your-own-activity-pack">
								{"What's an Activity Pack?"}
							</a>

							<a href=""><i className="fa fa-long-arrow-right"></i></a>
						</p>
					</div>

				</div>

				<input className={this.props.nameError} id="unit_name" ref='name' onChange={this.updateName} value={this.props.unitName} type="text"  placeholder="e.g. Learning How to Use Nouns" />
			</section>
		);
	}

});
