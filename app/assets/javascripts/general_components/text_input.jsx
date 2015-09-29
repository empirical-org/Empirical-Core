'use strict';
EC.TextInput = React.createClass({
  propTypes: {
    update: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    default: React.PropTypes.string,
    errors: React.PropTypes.object,
    label: React.PropTypes.string,
    errorLabel: React.PropTypes.string,
    errorKey: React.PropTypes.string,
    size: React.PropTypes.string
  },

  update: function () {
    var value = $(this.refs[this.props.name].getDOMNode()).val();
    var hash = {}
    hash[this.props.name] = value;
    this.props.update(hash);
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

  determineErrorLabel: function () {
    return this.determine('errorLabel', this.determineLabel());
  },

  determineErrorKey: function () {
    return this.determine('errorKey', this.props.name);
  },

  determineError: function () {
    var errorKey, error;
    errorKey = this.determineErrorKey();
    if ((this.props.errors) && (this.props.errors[errorKey])) {
      error = this.props.errors[errorKey][0];
    } else {
      error = null;
    }
    return error;
  },

  displayErrors: function () {
    var error, result;
    error = this.determineError();

    if ((error !== null) && (error !== undefined)) {
      result = this.determineErrorLabel() + ' ' + error;
    } else {
      result = null;
    }
    return result;
  },

  determineInputTag: function () {
    var result;
    if (this.props.size == 'medium') {
      result = (<textarea id={this.props.name}
                         type={this.determineType()}
                         ref={this.props.name}
                         onChange={this.update}
                         defaultValue={this.determine('default', null)} />)

    } else {
      result = (<input id={this.props.name}
                       type={this.determineType()}
                       ref={this.props.name}
                       onChange={this.update}
                       defaultValue={this.determine('default', null)} />);
    }
    return result;
  },

  render: function () {
    return (
      <div className='row text-input-row'>
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
              {this.determineInputTag()}
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
