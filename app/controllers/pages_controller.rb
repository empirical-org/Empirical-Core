class PagesController < ApplicationController
  before_filter :resolve_layout
  layout :determine_layout
  #layout "about", only: [:mission, :develop, :about, :faq]

  def home
    if signed_in?
      redirect_to(profile_path) && return
    end

    @body_class = 'home-page'

    @activity = Activity.with_classification.find_by_uid(ENV.fetch('HOMEPAGE_ACTIVITY_UID', ''))

    self.formats = ['html']
  end

  def develop
  end

  def mission 
  end

  def about
    @body_class = 'full-width-page white-page'
  end

  def faq
  end

  def new
    @body_class = 'full-width-white-page'
  end
  
  def impact
    @body_class = 'white-page'
  end

  def tos
    @body_class = 'auxiliary white-page formatted-text'
  end

  def privacy
    @body_class = 'auxiliary white-page formatted-text'
  end

  def lessons
    @body_class = 'auxiliary white-page formatted-text'
    @section = if params[:section_id].present? then Section.find(params[:section_id]) else Section.first end
    @topics = @section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
  end

  private

  def determine_layout
    case action_name
    when 'home'
      'home'
    when 'mission', 'develop', 'faq'
      'about'
    else
      'application'
    end
  end


  def resolve_layout
    case action_name
    when 'learning', 'story'
      @body_class = 'auxiliary'
    end
  end
end
