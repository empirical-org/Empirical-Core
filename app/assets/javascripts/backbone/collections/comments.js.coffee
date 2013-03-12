class PG.Collections.Comments extends Backbone.Collection
  model: PG.Models.Comment
  url: -> "/chapters/#{@chapterID}/comments.json"
