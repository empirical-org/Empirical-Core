EC.NameTheUnit = React.createClass({

	keyUp: function (e) {
		var unitName = $('#unit_name').val();
		this.props.updateUnitName(unitName);
	},

	render: function () {
		return (
			<section className="section-content-wrapper">
				<div className="col-xs-12 col-md-9 col-sm-9 col-xl-9 no-pl">
					<h3 className="section-header">Name the New Unit</h3>
				</div>	

				<div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 no-pl no-pr">

					<div className="how-we-grade">
						<p className="title title-not-started">

							<a href="http://support.quill.org/knowledgebase/articles/369614-assigning-lessons">
								{"What's a Unit?"}
								<i className="fa fa-long-arrow-right"></i>
							</a>

							<a href=""><i class="fa fa-long-arrow-right"></i></a>
						</p>
					</div>

				</div>

				<input id="unit_name" onKeyUp={this.keyUp} type="text"  placeholder="e.g. Learning How to Use Nouns" />
			</section>
		);
	}

});


