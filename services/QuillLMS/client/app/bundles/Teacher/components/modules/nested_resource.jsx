import _ from 'underscore'

export default function (component, kind) {
  // returns a set of data, options
  this.add = function (resource) {
    let newModel = component.state.model
    let newNest = _.chain(newModel[kind]).push(resource).value()
    newModel[kind] = newNest;
    return newModel
  }


  this.remove = function (resource) {
    let newModel = component.state.model
    let newNest = _.reject(newModel[kind], function (r) { return r.id == resource.id })
    newModel[kind] = newNest;
    return newModel
  }
}
