'use strict';
import React from 'react'
import _ from 'lodash'
import TextInput from '../../general_components/text_input'

export default function (component, update, options) {

  var config = {
    errors: [],
    update: update
  };

  if (options) {
    config = _.merge(config, options)
  }

  var _fun1 = function (ele) {
      var default1;
      if (ele.default) {
        default1 = ele.default
      } else if (component.state.model) {
        default1 = component.state.model[ele.name];
      } else {
        default1 = null;
      }

      return <TextInput key={ele.name}
                           update={config.update}
                           name={ele.name}
                           label={ele.label}
                           errors={config.errors}
                           errorLabel={ele.errorLabel}
                           noLabel={ele.noLabel}
                           size={ele.size}
                           default={default1}
                           type={ele.type}
                           errorKey={ele.errorKey}
                           isSingleRow={config.isSingleRow}/>;
  };

  this.setErrors = function (errors) {
    config.errors = errors;
  };

  this.generate = function (fieldObjs) {
    var inputs;
    if (config.update !== null) {
      inputs = _.map(fieldObjs, _fun1)
    } else {
      inputs = [];
    }
    return inputs;
  };
};
