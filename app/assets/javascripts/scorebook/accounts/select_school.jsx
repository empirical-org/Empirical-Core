/*
used in teacher-facing teacher-account editor
and in admin-facing teacher-account editor
*/
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
    this.props.updateSchool(x);
  },
  render: function () {
    var schoolOptions;
    var initialValue;
    if (this.props.schoolOptions.length == 0) {
      schoolOptions = <option value="enter-zipcode" >Enter Your School&#39;s Zip Code</option>;
      initialValue = "enter-zipcode";
    } else {
      schoolOptions = _.map(this.props.schoolOptions, function (schoolOption) {
        return <option key={schoolOption.id} value={schoolOption.id}>{schoolOption.text}</option>;
      });
      if (this.props.selectedSchool != null) {
        initialValue = this.props.selectedSchool.id;
      } else {
        var defaultOption = <option value="choose">Choose Your School</option>;
        initialValue = "choose"
        schoolOptions.unshift(defaultOption);
      }
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
          <select ref='select' value={initialValue} onChange={this.selectOption}>
            {schoolOptions}
          </select>
        </div>
        <div className='col-xs-4 error'>
          {this.props.errors}
        </div>
      </div>
    );
  }
});