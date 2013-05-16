class PG.Models.ChapterAssessment extends Backbone.Model
  initialize: ->
    @chunks = new PG.Collections.Chunks