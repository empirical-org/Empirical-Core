'use strict'


export default  function () {

  this.sayNumberOfThings = function (number, singular, plural) {
    let value;
    if (number == 1) {
      value = singular;
    } else {
      value = plural;
    }
    return [number, value].join(' ');
  }
}
