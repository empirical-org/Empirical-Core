'use strict';

import React from 'react'
import $ from 'jquery'
import _ from 'underscore'

export default React.createClass({
  propTypes: {
    update: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    default: React.PropTypes.string,
    errors: React.PropTypes.object,
    label: React.PropTypes.string,
    errorLabel: React.PropTypes.string,
    errorKey: React.PropTypes.string,
    size: React.PropTypes.string,
    noLabel: React.PropTypes.bool
  },

  update: function (event) {
    this.props.update(this.props.name, event.target.value);
  },

  titleCase: function (string) {
    var words = string.split(' ')
    var TitleCaseWords = _.map(words, function (word) {
      return this.titleCaseHelper(word)
    }, this);
    var result = _.reduce(TitleCaseWords, function (acc, word) {
      return acc + ' ' + word;
    }, '')

    return result;
  },

  titleCaseHelper: function (word) {
    return word[0].toUpperCase() + word.substring(1);
  },

  determine: function (desired, fallback) {
    return this.props[desired] ? this.props[desired] : fallback;
  },

  determineType: function () {
    var type = null;
    if (this.props.type != undefined) {
      type = this.props.type
    } else if (this.props.name === 'password') {
      type = 'password';
    }
    return type;
  },

  determineLabel: function () {
    return this.determine('label', this.titleCase(this.removeUnderscore(this.props.name)));
  },

  removeUnderscore: function (string) {
    return string.replace(/_/g, ' ');
  },

  determinePlaceholder: function () {
    return this.determineLabel();
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

  getId: function () {
    return this.props.name;
  },

  getUpdateFn: function () {
    var fn = null
    if (this.determineType() !== 'file') {
      fn = this.update;
    }
    return fn;
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
      result = (<input id={this.getId()}
                       placeholder={this.determinePlaceholder()}
                       type={this.determineType()}
                       ref={this.props.name}
                       onChange={this.getUpdateFn()}
                       defaultValue={this.determine('default', null)} />);
    }
    return result;
  },

  componentDidMount: function () {
    var that = this;
    if (this.determineType() == 'file') {
      $('#' + this.getId()).fileupload({
        dataType: 'json',
        add: function (e, data) {
          var file = data.files[0]
          that.props.update(that.props.name, file);
        }
      });
    }
  },

  labelOrNot: function () {
    if (this.props.noLabel) {
      return null;
    } else {
      return (
        <div className='row'>
          <div className='col-xs-12'>
            <div className='form-label'>
              {this.determineLabel()}
            </div>
          </div>
        </div>
      );
    }
  },

  render: function () {
    var result;
    if (this.props.isSingleRow) {
      result = this.determineInputTag();
    } else {
      result = (
          <div className='row text-input-row'>
            <div className='col-xs-12'>
              {this.labelOrNot()}
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
    return result;
  }
});
