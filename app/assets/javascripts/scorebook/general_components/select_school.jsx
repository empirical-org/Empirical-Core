EC.SelectSchool = React.createClass({
  propTypes: {
    updateSchool: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return ({
      options: options
    });
  },
  updateZip: function () {
    var zip = $(this.refs.zip.getDOMNode()).val();
    if (zip.length == 5) {
      this.requestSchools(zip);
    }
  },
  requestSchools: function (zip) {
    console.log('populate schools', zip);
    $.ajax({
      url: '/schools.json',
      data: {zipcode: zip},
      success: this.populateSchools
    });
  },
  populateSchools: function (data) {
    console.log('schools', data)
    this.setState({options: data});
  },
  selectOption: function () {
    console.log('select opotin');
    var x = $(this.refs.select.getDOMNode()).val();
    var y = _.findWhere(this.state.options, {text: x});
    this.props.updateSchool(y);
  },
  determineZipDefault: function () {
    console.log('props selectedSchool', this.props.selectedSchool);
    var zip;
    if (this.props.selectedSchool != null) {
      zip = this.props.selectedSchool.zipcode;
    } else {
      zip = null;
    }
    return zip;
  },
  render: function () {
    var options;
    if (this.state.options.length == 0) {
      options = <option selected="selected" >Enter Your School&#39;s Zip Code</option>;
    } else {
      options = _.map(this.state.options, function (option) {
        return <option>{option.text}</option>;
      });
      var defaultOption = <option selected="selected">Choose Your School</option>;
      options.unshift(defaultOption);
    }
    return (
      <div className='row'>
        <div className='form-label col-xs-2'>
          School
        </div>
        <div className='col-xs-2'>
          <input ref='zip' onChange={this.updateZip} placeholder="Zip" value={this.determineZipDefault()}/>
        </div>
        <div className='col-xs-4'>
          <select ref='select' onChange={this.selectOption}>
            {options}
          </select>
        </div>
      </div>
    );
  }
});