'use strict';
EC.TextInputGenerator = function (component, update) {


  var config = {
    errors: [],
    update: update
  };

  var fun1 = function (ele) {
      var default1;
      if (ele.default) {
        default1 = ele.default
      } else if (component.state.model) {
        default1 = component.state.model[ele.name];
      } else {
        default1 = null;
      }

      return <EC.TextInput key={ele.name}
                           update={config.update}
                           name={ele.name}
                           label={ele.label}
                           errors={config.errors}
                           errorLabel={ele.errorLabel}
                           size={ele.size}
                           default={default1}
                           errorKey={ele.errorKey}/>;
  };

  this.setErrors = function (errors) {
    config.errors = errors;
  };

  this.generate = function (fieldObjs) {
    var inputs;
    if (config.update !== null) {
      inputs = _.map(fieldObjs, fun1)
    } else {
      inputs = [];
    }
    return inputs;
  };
};