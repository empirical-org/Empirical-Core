export default function () {
  this.run = function (value) {
    if (value == null) {
      return "Not completed yet";
    } else {
      return (Math.round(100*value)) + "%";
    }
  }
}
