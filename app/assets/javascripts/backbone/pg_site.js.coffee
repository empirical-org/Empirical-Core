#= require_self
#= require_tree ./templates
#= require_tree ./models
#= require_tree ./views
#= require_tree ./collections

window.PG =
  Models: {}
  Collections: {}
  Views: {}
  Routers: {}

  init: ->
  	###
	    @comments = new PG.Collections.Comments
	    @comments.chapterID = window.chapterID
	    @comments_view = new PG.Views.Comments(collection: @comments)
	    @comments.fetch()
    ###
