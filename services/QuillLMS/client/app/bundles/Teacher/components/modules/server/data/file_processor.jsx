'use strict'

import _ from 'lodash'

export default  function () {
  // we have to go through all of this because in order to send files (for example images) over ajax, we have to turn the request data into a FormData object,
  // and adding nested values to FormData objects requires much of the code you see below.

  // can probably move this into EC.fnl
  var _getAllValues = function (value) {
    let values;
    let total;

    if (value instanceof Object) {
      values = _.values(value);
      let next = _.map(values, function (val) {
        return _getAllValues(val);
      })
      let flattenedNext = _.flattenDeep(next);
      total = _(values).concat(flattenedNext).value();
    } else {
      total = [value];
    }
    return total;
  }

  let _isFile = function (item) {
    return item instanceof File;
  }

  let _includesFile = function (array) {
    return (_.filter(array, _isFile).length !== 0)
  }


  var _intoFormData = function (obj, form, namespace) {
    // FROM : (with correction that commenter pointed out aboug passing in namespace to recursive call) : https://gist.github.com/ghinda/8442a57f22099bdb2e34
    // works because of http://stackoverflow.com/questions/12854259/square-brackets-in-name-attribute-of-input-tag
    let fd = form || new FormData();
    let formKey;

    for(let property in obj) {
      if(obj.hasOwnProperty(property)) {

        if(namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }

        // if the property is an object, but not a File,
        // recur
        if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {

          _intoFormData(obj[property], fd, formKey);

        } else {

          // if it's a string or a File object
          fd.append(formKey, obj[property]);
        }

      }
    }

    return fd;
  }


  this.process = function (data) {
    let values, newData;

    values = _getAllValues(data);
    if (_includesFile(values)) {
      newData = _intoFormData(data);
    } else {
      newData = data
    }
    return newData;
  }

}
