EC.SelectSchool = React.createClass({
  propTypes: {
    updateSchool: React.PropTypes.func.isRequired,
    requestSchools: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return ({
      schoolOptions: []
    });
  },
  updateZip: function () {
    var zip = $(this.refs.zip.getDOMNode()).val();
    if (zip.length == 5) {
      this.props.requestSchools(zip);
    }
  },
  determineDefaultZip: function () {
    var zip;
    if (this.props.selectedSchool == null) {
      zip = null;
    } else {
      zip = this.props.selectedSchool.zipcode;
    }
    console.log('determineDefaultZip', zip)
    return zip;
  },
  selectOption: function () {
    console.log('select opotin');
    var x = $(this.refs.select.getDOMNode()).val();
    var y = _.findWhere(this.props.schoolOptions, {text: x});
    this.props.updateSchool(y);
  },
  render: function () {
    var schoolOptions;
    if (this.props.schoolOptions.length == 0) {
      schoolOptions = <option selected="selected" >Enter Your School&#39;s Zip Code</option>;
    } else {
      schoolOptions = _.map(this.props.schoolOptions, function (schoolOption) {
        return <option key={schoolOption.id}>{schoolOption.text}</option>;
      });
      var defaultOption = <option selected="selected">Choose Your School</option>;
      schoolOptions.unshift(defaultOption);
    }

    return (
      <div className='row'>
        <div className='form-label col-xs-2'>
          School
        </div>
        <div className='col-xs-2'>
           <input ref='zip' className='zip-input' onChange={this.updateZip} placeholder="Zip"/>
        </div>
        <div className='col-xs-4'>
          <select ref='select' onChange={this.selectOption}>
            {schoolOptions}
          </select>
        </div>
      </div>
    );
  }
});