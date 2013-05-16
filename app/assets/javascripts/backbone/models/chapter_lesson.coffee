class PG.Models.ChapterLesson extends Backbone.Model
  initialize: ->
    @chunks = new PG.Collections.Chunks

