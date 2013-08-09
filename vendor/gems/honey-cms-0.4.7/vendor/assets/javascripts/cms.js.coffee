#= require codemirror
#= require codemirror/xml
#= require epiceditor

class window.HtmlEditor extends Backbone.View
  events:
    'click a[href=#edit]': 'showEditor'
    'ajax:success [role=editor] form': 'showDisplay'

  initialize: ->
    CodeMirror.fromTextArea @$('[role=editor] .content')[0],
      mode: 'text/html'
      tabMode: 'indent'
    @$('[role=editor]').hide().css('visibility', 'visible')

  showDisplay: (e,data) ->
    e.preventDefault()
    @$('[role=editor]').hide()
    @$('[role=display]').show()
    @$('[role=display] .content').html data.formatted_content

  showEditor: (e) ->
    e.preventDefault()
    @$('[role=editor]').show()
    @$('[role=display]').hide()

jQuery ($) ->
  new HtmlEditor {el} for el in $('[role=html-editor]')



  $('body.cms form textarea').each ->
    $container = $('<div class="epiceditor-container">')
    $textarea = $(this).hide().after($container)

    editor = new EpicEditor
      container: $container[0]
      basePath: '/assets/epiceditor'
      clientSideStorage: false
      file:
        defaultContent: $textarea.val()

    editor.load()
    editor.on 'update', (response) ->
      $textarea.val response.content
