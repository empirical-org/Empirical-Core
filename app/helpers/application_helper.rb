module ApplicationHelper
  def form_for *args, &block
    options = args.extract_options!

    layout = if options.delete(:layout) == 'vertical'
      'form-vertical'
    else
      'form-horizontal'
    end

    args << options.reverse_merge(builder: EgFormBuilder, format: 'html', html: {class: layout})
    super *args, &block
  end

  def next_page
    next_action = pages[pages.index(params[:action]) + 1] || 'home'
    url_for(controller: 'pages', action: next_action)
  end

  def pages
    %w(home
       the_peculiar_institution
       democracy_in_america
       aggregation)
  end

  def question_section

  end

  def body_class
    @body_class
  end

  def body_id
    @body_id
  end

  def active_on_first(i)
    "active" if i == 0
  end
end
