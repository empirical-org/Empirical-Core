'use strict';
EC.SelectSchool = React.createClass({
  propTypes: {
    updateSchool: React.PropTypes.func.isRequired,
    requestSchools: React.PropTypes.func.isRequired,
    selectedSchool: React.PropTypes.object,
    schoolOptions: React.PropTypes.array,
    errors: React.PropTypes.array
  },

  getInitialState: function(){
    return {editSchool: false}
  },

  updateZip: function () {
    var zip = $(this.refs.zip.getDOMNode()).val();
    if (zip.length == 5) {
      this.props.requestSchools(zip);
    }
  },

  stateSpecificComponents: function(){
    if (this.state.editSchool) {
      return (<div className='account-form'><EC.EducatorType analytics={new EC.AnalyticsWrapper()}/></div>);
    }
  },

  determineDefaultZip: function () {
    var zip;
    if (this.props.selectedSchool == null) {
      zip = null;
    } else {
      zip = this.props.selectedSchool.zipcode;
    }
    return zip;
  },

  selectOption: function () {
    var schoolId, schoolObject;
    schoolId = $(this.refs.select.getDOMNode()).val();
    schoolObject = _.findWhere(this.props.schoolOptions, {id: parseInt(schoolId)});
    this.props.updateSchool(schoolObject);
  },

  schoolName: function(){
    if (this.props.selectedSchool && this.props.selectedSchool.text) {
      return this.props.selectedSchool.text;
    }
  },

  editSchool: function(){
    this.setState({editSchool: true})
  },

  render: function () {
    var schoolOptions, initialValue;
    if (this.props.schoolOptions.length == 0) {
      schoolOptions = <option value="enter-zipcode">Enter Your School&#39;s Zip Code</option>;
      initialValue = "enter-zipcode";
    } else {
      schoolOptions = _.map(this.props.schoolOptions, function (schoolOption) {
        return <option key={schoolOption.id} value={schoolOption.id}>{schoolOption.text}</option>;
      });
      if ((this.props.selectedSchool != null) && (this.props.selectedSchool.zipcode == this.props.schoolOptions[0].zipcode)) {
        initialValue = this.props.selectedSchool.id;
      } else {
        var defaultOption = <option key='choose' value="choose">Choose Your School</option>;
        initialValue = "choose";
        schoolOptions.unshift(defaultOption);
      }
    }

    if (this.props.isForSignUp) {
      return (
        <div>
              <div className='zip-row'>
                <div className='form-label zip'>
                  Add Your School's ZIP Code
                </div>
                <div>
                  <input name='zip'
                         id='zip'
                         ref='zip'
                         className='zip-input'
                         onChange={this.updateZip}
                         placeholder="Zip"/>
                </div>
              </div>
              <div className='form-label'>
                  School Name
              </div>
                <div>
                  <select ref='select'
                          id='select_school'
                          value={initialValue}
                          onChange={this.selectOption}>
                    {schoolOptions}
                  </select>
                </div>
                </div>
      );
    } else {
      return (
        <div>
        <div className='row '>
          <div className='form-label col-xs-2'>
            School
          </div>
          <div className='col-xs-3'>
            <input
                    className='inactive'
                    value={this.schoolName()}>
            </input>
          </div>
          <div className='col-xs-3'>
            <button className='button btn button-green' onClick={this.editSchool}>
              Add/Edit School
            </button>
          </div>
          <div className='error'>
            {this.props.errors}
          </div>
        </div>
      {this.stateSpecificComponents()}
      </div>
      );
    }
  }
});
