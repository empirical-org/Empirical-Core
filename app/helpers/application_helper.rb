module ApplicationHelper
  def form_for *args, &block
    options = args.extract_options!

    layout = if options.delete(:layout) == 'vertical'
      'form-vertical'
    else
      'form-horizontal'
    end

    args << options.reverse_merge(builder: CMS::FormBuilder, format: 'html', html: {class: layout})
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
end
