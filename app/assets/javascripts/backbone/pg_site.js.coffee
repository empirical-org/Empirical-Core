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
    @comments.chapterID = window.chapterID
    @comments.fetch()
    @comments_view = new PGSite.Views.Comments(collection: @comments)
