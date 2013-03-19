class PG.Views.GrammarTest extends Backbone.View
  template: JST['backbone/templates/grammar_test']
  resultsTemplate: JST['backbone/templates/grammar_test_results']

  events:
    'focus  .edit-word': 'wordFocused'
    'blur .edit-word': 'wordChanged'
    'click  .show-results': 'showResults'

  initialize: ->
    # _.bindAll 'render'
    @grammarTest = grammarTests.get(@$el.data('id'))
    @chunks = @grammarTest.chunks
    @questions = @chunks.select (c) -> c.get('answer')
    @render()
    @updateProgress()

  render: ->
    @$('.text').html @template(chunks: @grammarTest.chunks)
    @$('.edit-word').attr 'contentEditable', true
    this

  wordFocused: (e) ->
    # debugger
    # @currentWord = @chunks.get($(e.target).data('id'))
    # console.log @currentWord

  wordChanged: (e) ->
    chunk = @chunks.get($(e.target).data('id'))
    chunk.input = $(e.target).text().trim()
    @updateProgress()

  updateProgress: ->
    @$('.progress').html ''

    _.each @questions, (chunk) ->
      if chunk.grade()
        @$('.progress').append @$('<div class="unit">').html('&nbsp;').addClass('correct')
      else
        @$('.progress').append @$('<div class="unit">').html('&nbsp;')

  showResults: ->
    _this = this;
    lessons = []

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
          if chunk.grammar then lessons.push chunk.rule()

    lessons = _.uniq(lessons)
    console.log(lessons)
    @$('.results').show().html @resultsTemplate(@grammarTest)

    # @$('.results a.lessons').href('/lessons?')

jQuery ($) ->
  $('.grammar-test').each ->
    new PG.Views.GrammarTest el: this
