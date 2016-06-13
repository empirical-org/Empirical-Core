'use strict'

 import React from 'react'
 import _ from 'underscore'

 export default  function () {
    // we have to go through all of this because in order to send files (for example images) over ajax, we have to turn the request data into a FormData object,
    // and adding nested values to FormData objects requires much of the code you see below.

    // can probably move this into EC.fnl
    var _getAllValues = function (value) {
        var values;
        var total;

        if (value instanceof Object) {
            values = _.values(value);
            var next = _.map(values, function (val) {
                return _getAllValues(val);
            })
            var flattenedNext = _.flattenDeep(next);
            total = _(values).concat(flattenedNext).value();
        } else {
            total = [value];
        }
        return total;
    }

    var _isFile = function (item) {
        return item instanceof File;
    }

    var _includesFile = function (array) {
        return (_.filter(array, _isFile).length !== 0)
    }


    var _intoFormData = function (obj, form, namespace) {
        // FROM : (with correction that commenter pointed out aboug passing in namespace to recursive call) : https://gist.github.com/ghinda/8442a57f22099bdb2e34
        // works because of http://stackoverflow.com/questions/12854259/square-brackets-in-name-attribute-of-input-tag
        var fd = form || new FormData();
        var formKey;

        for(var property in obj) {
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
        var values, newData;

        values = _getAllValues(data);
        if (_includesFile(values)) {
            newData = _intoFormData(data);
        } else {
            newData = data
        }
        return newData;
    }

}
