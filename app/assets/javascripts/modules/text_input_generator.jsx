'use strict';
EC.TextInputGenerator = function (component, update) {


  var config = {
    errors: [],
    update: update
  };

  var fun1 = function (ele) {
      return <EC.TextInput key={ele.name}
                           update={config.update}
                           name={ele.name}
                           label={ele.label}
                           errors={config.errors}
                           errorLabel={ele.errorLabel}
                           size={ele.size}
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