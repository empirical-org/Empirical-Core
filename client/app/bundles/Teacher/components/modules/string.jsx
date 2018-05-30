'use strict'


 export default  function () {

  this.sayNumberOfThings = function (number, singular, plural) {
    var value;
    if (number == 1) {
      value = singular;
    } else {
      value = plural;
    }
    return [number, value].join(' ');
  }
}
