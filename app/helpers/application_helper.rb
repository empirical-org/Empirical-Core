module ApplicationHelper

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

  def combine(array_1, array_2)
    array_1 + array_2
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

  def root_path
    root_url
  end
end
