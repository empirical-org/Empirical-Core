class PG.Views.ChapterAssessment extends Backbone.View
  template: JST['backbone/templates/chapter_assessment']
  resultsTemplate: JST['backbone/templates/chapter_assessment_results']

  events:
    'focus .edit-word': 'wordFocused'
    'blur  .edit-word': 'wordChanged'
    'click .show-results': 'showResults'
    'click .show-lessons': 'showLessons'

  initialize: (options) ->
    @$el = $('.grammar-test')
    @assessment = options.assessment
    @chunks = @assessment.chunks
    @questions = @chunks.select (c) -> c.get('answer')
    @rules = options.rules
    @lessons = options.lessons
    @render()
    #@updateProgress()

  render: ->
    @$('.text').html @template(chunks: @assessment.chunks)
    @$('.edit-word').attr 'contentEditable', true
    this

  wordFocused: (e) ->
    # @currentWord = @chunks.get($(e.target).data('id'))
    # console.log @currentWord

  wordChanged: (e) ->
    chunk = @chunks.get($(e.target).data('id'))
    chunk.input = $(e.target).text().trim()
    #@updateProgress()

  testFn: ->
    console.log('click')

  updateProgress: ->
    @$('.progress').html ''

    _.each @questions, (chunk) ->
      if chunk.grade()
        @$('.progress').append $('<div class="unit">').html('&nbsp;').addClass('correct')
      else
        @$('.progress').append $('<div class="unit">').html('&nbsp;')

  showResults: ->
    _this = this;
    @missedRules = []

    @$('.edit-word')
      .removeClass('edit-word')
      .addClass('graded-word')
      .each (word) ->
        $word = $(this)
        $word.attr 'contentEditable', false
        chunk = _this.chunks.get($word.data('id'))
        if chunk.grade() && chunk.inputPresent()
          $word.addClass('correct')
        else if not chunk.grade()
          $word.addClass('error')
          if chunk.grammar then _this.missedRules.push chunk.rule()

    @missedRules = _.uniq(@missedRules)
    @$('.results').show().html @resultsTemplate(@assessment)
    @percentMissed = 100 - (@missedRules.length / chapterRules.length * 100)

  showLessons: ->
    $('.grammar-test').children().hide()
    $lessons = $('.lessons')
      .show()
      .html JST['backbone/templates/chapter_lessons'](missedRules:@missedRules)

    @lessonsView = new PG.Views.ChapterLessons(el: $lessons, percentMissed: @percentMissed)