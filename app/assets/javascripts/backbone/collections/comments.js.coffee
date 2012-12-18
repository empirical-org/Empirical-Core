class PGSite.Collections.Comments extends Backbone.Collection
  model: PGSite.Models.Comment
  url: -> "/chapters/#{@chapterID}/comments.json"
