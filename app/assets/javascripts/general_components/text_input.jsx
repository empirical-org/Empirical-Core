'use strict';
EC.TextInput = React.createClass({
  propTypes: {
    update: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    default: React.PropTypes.string,
    errors: React.PropTypes.array
  },

  update: function () {
    var value = $(this.refs[this.props.name].getDOMNode()).val();
    this.props.update(this.props.name, value);
  },

  titleCase: function (string) {
    var result;
    result = string[0].toUpperCase() + string.substring(1);
    return result;
  },

  determine: function (desired, fallback) {
    return this.props[desired] ? this.props[desired] : fallback;
  },

  determineType: function () {
    return (this.props.name === 'password') ? 'password' : null;
  },

  determineLabel: function () {
    return this.determine('label', this.titleCase(this.props.name));
  },

  displayErrors: function () {
    var result;
    if (this.props.errors) {
      result = this.determine('errorLabel', this.determineLabel()) + ' ' + this.props.errors[0];
    } else {
      result = null;
    }
    return result;
  },

  render: function () {
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-xs-12'>
              <div className='form-label'>
                {this.determineLabel()}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-8'>
              <input id={this.props.name} type={this.determineType()} ref={this.props.name} onChange={this.update} defaultValue={this.determine('default', null)}/>
            </div>
            <div className='col-xs-4 error'>
              {this.displayErrors()}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
