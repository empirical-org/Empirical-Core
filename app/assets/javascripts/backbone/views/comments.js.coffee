class PGSite.Views.Comments extends Backbone.View

  el: '.panel.response'
  template: JST['backbone/templates/comments/index']
  comment_template: JST['backbone/templates/comments/_comment']

  initialize: ->
    @collection.on('reset', @render, this)

  render: ->
    @$el.html(@template(comments: @collection))
    this

  events:
    'submit form.new-comment': 'createComment'
    # this is to override the default accordion functionality
    # when data-toggle is false, multiple divs can be expanded
    'click .accordion-toggle[data-toggle=false]': 'multiToggle'

  createComment: (event) ->
    event.preventDefault()
    @target = $(event.currentTarget)
    comment_attributes =
      title: @target.find('.new-comment-title').val(),
      body: @target.find('.new-comment-body').val(),
      parent_id: @target.find('.new-comment-parentid').val(),
      reply_type: @target.find('.new-comment-reply-type').val()
    attributes = comment: comment_attributes
    comment = @collection.create attributes,
      wait: true
      success: =>
        $('.new-comment-title, .new-comment-body').val('')
        $("#new-comment-accordion-for-#{comment.get('parent_id')}").collapse('toggle')
        @renderComment(comment, @target)
      error: @handleError

  renderComment: (comment, target) ->
    @collection.fetch # this is needed to build comments tree with ancestry
      silent: true
      success: =>
        locals =
          comment: comment,
          title: comment.get('title'), body: comment.get('body'),
          id: comment.id, depth: comment.get('depth'), children: comment.get('children'),
          parent_id: comment.get('parent_id'),
          reply_type: comment.get('reply_type')
        if comment.get('depth') == 2 and comment.get('reply_type') == 'con'
          # if user adds a con, group it with other cons
          # another way to do this would be to add another form under cons
          next_element = target.parents('.accordion-group.new-comment').parent().find('.pro').first()
        else
          next_element = target.parents('.accordion-group.new-comment')
        next_element.before(@comment_template(locals))
        $(".accordion-toggle[data-id=#{comment.id}]").animateHighlight("#d19d6d", 1500)

  multiToggle: (event) ->
    event.preventDefault()
    @target = $(event.currentTarget)
    $(@target.attr('href')).collapse('toggle')

  handleError: (entry, response) ->
    if response.status == 422
      errors  = $.parseJSON(response.responseText).errors
      for attribute, messages of errors
        alert "#{attribute} #{message}" for message in messages
