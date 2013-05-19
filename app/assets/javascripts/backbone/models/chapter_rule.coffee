class PG.Models.ChapterRule extends Backbone.Model
  initialize: ->
    @lessons = new PG.Collections.ChapterLessons


