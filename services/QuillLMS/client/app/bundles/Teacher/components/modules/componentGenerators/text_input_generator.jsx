
import _ from 'lodash';
import React from 'react';
import TextInput from '../../general_components/text_input';

export default function (component, update, options) {

  let config = {
    errors: [],
    update: update
  };

  if (options) {
    config = _.merge(config, options)
  }

  let _fun1 = function (ele) {
    let default1;
    if (ele.default) {
      default1 = ele.default
    } else if (component.state.model) {
      default1 = component.state.model[ele.name];
    } else {
      default1 = null;
    }

    return (
      <TextInput
        default={default1}
        errorKey={ele.errorKey}
        errorLabel={ele.errorLabel}
        errors={config.errors}
        isSingleRow={config.isSingleRow}
        key={ele.name}
        label={ele.label}
        name={ele.name}
        noLabel={ele.noLabel}
        size={ele.size}
        type={ele.type}
        update={update}
      />
    );
  };

  this.setErrors = function (errors) {
    config.errors = errors;
  };

  this.generate = function (fieldObjs) {
    let inputs;
    if (config.update !== null) {
      inputs = _.map(fieldObjs, _fun1)
    } else {
      inputs = [];
    }
    return inputs;
  };
}
