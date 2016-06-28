export default function (component, kind) {
  // returns a set of data, options

  this.add = function (resource) {
    var newModel = component.state.model
    var newNest = _.chain(newModel[kind]).push(resource).value()
    newModel[kind] = newNest;
    return newModel
  }

  this.remove = function (resource) {
    var newModel = component.state.model
    var newNest = _.reject(newModel[kind], function (r) { return r.id == resource.id })
    newModel[kind] = newNest;
    return newModel
  }
}
