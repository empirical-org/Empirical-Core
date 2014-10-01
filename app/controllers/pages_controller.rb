class PagesController < ApplicationController
  before_filter :resolve_layout

  def home
    if signed_in?
      redirect_to(profile_path) && return
    end

    @body_class = 'home-page'

    topic = if ENV['HOMEPAGE_CHAPTER_ID'].blank? && Topic.first
      Topic.find_by_id(1) || Topic.first
    elsif ENV['HOMEPAGE_CHAPTER_ID'].present?
      Topic.find_by_id(ENV['HOMEPAGE_CHAPTER_ID'])
    end

    @activity = if topic
      topic.activities.where(
        activity_classification_id: ActivityClassification.find_by_key('story').id
      ).first
    end

    self.formats = ['html']
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
		#@topics = @section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
		@topics = @section.topics.map{|topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
  end

  private

  def resolve_layout
    case action_name
    when 'learning', 'story'
      @body_class = 'auxiliary'
    end
  end
end
