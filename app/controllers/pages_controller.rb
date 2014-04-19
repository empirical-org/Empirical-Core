class PagesController < ApplicationController
  before_filter :resolve_layout

  def home
    @body_class = 'home-page'

    @activity = Topic.find(ENV['HOMEPAGE_CHAPTER_ID']).activities.where(
      activity_classification_id: ActivityClassification.find_by_key('story').id
    ).first
  end

  def develop
    @body_class = 'white-page'
  end

  def mission
    @body_class = 'white-page'
  end

  def about
    @body_class = 'full-width-page white-page'
  end

  def faq
    @body_class = 'white-page'
  end

  def tos
    @body_class = 'auxiliary white-page formatted-text'
  end

  def lessons
    @body_class = 'auxiliary white-page formatted-text'
    @section = if params[:section_id].present? then Section.find(params[:section_id]) else Section.first end
    @topics = @section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
  end

  private

  def resolve_layout
    case action_name
    when 'learning', 'story'
      @body_class = 'auxiliary'
    end
  end
end
