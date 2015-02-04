EC.ActivitySearchFilter = React.createClass({
	
	selectFilterOption: function (optionId) {
		this.props.selectFilterOption(this.props.data.field, optionId)
	},
	clearFilterOptionSelection: function () {
		this.props.selectFilterOption(this.props.data.field, null);
	},

	render: function () {
		var unselectedOptions, selectedOption, isThereASelection, filterHeader, clearSelection;

		if (this.props.data.selected == null) {
			isThereASelection = false;
			unselectedOptions = this.props.data.options;
			filterHeader = "Filter by " + this.props.data.alias;
		} else {
			isThereASelection = true;
			selectedOption = _.find(this.props.data.options, {id: this.props.data.selected}, this);
			
			filterHeader = selectedOption.name;
		
			unselectedOptions = _.reject(this.props.data.options, {id: this.props.data.selected}, this);
			


		}
		
		
		unselectedOptions = _.map(unselectedOptions, function (option) {
			return (
				<EC.FilterOption selectFilterOption={this.selectFilterOption} data={option} />
			);
		}, this);

		if (isThereASelection) {
			clearSelection = (
				<li onClick={this.clearFilterOptionSelection}>
					<span className='filter_option all'>
						{"All " + this.props.data.alias + "s "}
					</span>
				</li>
			);
			unselectedOptions.unshift(clearSelection);
		}

			
		
		

		return (
			<div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
				<div className="button-select">
					
					<button type="button" className="select-mixin select-gray button-select button-select-wrapper" data-toggle="dropdown">
						{filterHeader}				
						<i className="fa fa-caret-down"></i>
					</button>

					<ul className="dropdown-menu" role="menu">
						{unselectedOptions}
					</ul>

				</div>
			</div>
		);

	}


});

/*
		<div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
				<div id=<%="filter_#{filter[:type]}"%> class="button-select">
					
					<button data-filter-type=<%=filter[:type]%>  type="button" class="select-mixin select-gray button-select button-select-wrapper" data-toggle="dropdown">
					<%= "Filter by #{filter[:alias]}"%>
					<i class="fa fa-caret-down"></i>
					</button>

					<ul class="dropdown-menu" role="menu">
						<li>
							<span class='filter_option all' data-filter-type=<%=filter[:type]%> data-model-id=''>
								<%= "All #{filter[:alias]}s" %>
							</span>
						</li>
					</ul>
					
				</div>
			</div>
		);


*/
