import React from 'react'
import $ from 'jquery'
import _ from 'underscore'

export default class TextInput extends React.Component {
  componentDidMount() {
    let that = this;
    if (this.determineType() == 'file') {
      $('#' + this.getId()).fileupload({
        dataType: 'json',
        add: function (e, data) {
          let file = data.files[0]
          that.props.update(that.props.name, file);
        }
      });
    }
  }

  update = (event) => {
    this.props.update(this.props.name, event.target.value);
  };

  titleCase = (string) => {
    let words = string.split(' ')
    let TitleCaseWords = _.map(words, function (word) {
      return this.titleCaseHelper(word)
    }, this);
    let result = _.reduce(TitleCaseWords, function (acc, word) {
      return acc + ' ' + word;
    }, '')

    return result;
  };

  titleCaseHelper = (word) => {
    return word[0].toUpperCase() + word.substring(1);
  };

  determine = (desired, fallback) => {
    return this.props[desired] ? this.props[desired] : fallback;
  };

  determineType = () => {
    let type = null;
    if (this.props.type != undefined) {
      type = this.props.type
    } else if (this.props.name === 'password') {
      type = 'password';
    }
    return type;
  };

  determineLabel = () => {
    return this.determine('label', this.titleCase(this.removeUnderscore(this.props.name)));
  };

  removeUnderscore = (string) => {
    return string.replace(/_/g, ' ');
  };

  determinePlaceholder = () => {
    return this.determineLabel();
  };

  determineErrorLabel = () => {
    return this.determine('errorLabel', this.determineLabel());
  };

  determineErrorKey = () => {
    return this.determine('errorKey', this.props.name);
  };

  determineError = () => {
    let errorKey, error;
    errorKey = this.determineErrorKey();
    if ((this.props.errors) && (this.props.errors[errorKey])) {
      error = this.props.errors[errorKey][0];
    } else {
      error = null;
    }
    return error;
  };

  displayErrors = () => {
    let error, result;
    error = this.determineError();

    if ((error !== null) && (error !== undefined)) {
      result = this.determineErrorLabel() + ' ' + error;
    } else {
      result = null;
    }
    return result;
  };

  getId = () => {
    return this.props.name;
  };

  getUpdateFn = () => {
    let fn = null
    if (this.determineType() !== 'file') {
      fn = this.update;
    }
    return fn;
  };

  determineInputTag = () => {
    let result;
    if (this.props.size == 'medium') {
      result = (<textarea
        defaultValue={this.determine('default', null)}
        id={this.props.name}
        onChange={this.update}
        ref={this.props.name}
        type={this.determineType()}
      />)

    } else {
      result = (<input
        defaultValue={this.determine('default', null)}
        id={this.getId()}
        onChange={this.getUpdateFn()}
        placeholder={this.determinePlaceholder()}
        ref={this.props.name}
        type={this.determineType()}
      />);
    }
    return result;
  };

  labelOrNot = () => {
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
  };

  render() {
    let result;
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
}
