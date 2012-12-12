#= require_self
#= require_tree ./templates
#= require_tree ./models
#= require_tree ./views
#= require_tree ./collections

window.PGSite =
  Models: {}
  Collections: {}
  Views: {}
  Routers: {}

  init: ->
    @comments = new PGSite.Collections.Comments
    @comments.fetch()
    @comments_view = new PGSite.Views.Comments(collection: @comments)
