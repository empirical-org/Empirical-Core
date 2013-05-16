class PG.Views.ChapterAssessment extends Backbone.View
  template: JST['backbone/templates/chapter_assessment']

  initialize: (options) ->
    @assessments = options.assessments
    @rules = options.rules
    @lessons = options.lessons
    @render()

  render: ->
    @$('chapter-assessment').html @template
    this


