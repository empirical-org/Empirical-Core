class PagesController < ApplicationController
  before_filter :resolve_body_class, :determine_js_file, :determine_flag
  layout :determine_layout

  def home
    if signed_in?
      redirect_to(profile_path) && return
    end

    @body_class = 'home-page'

    @activity = Activity.with_classification.find_by_uid(ENV.fetch('HOMEPAGE_ACTIVITY_UID', ''))

    self.formats = ['html']
  end

  def home_new
    if signed_in?
      redirect_to(profile_path) && return
    end
    @title = 'Quill.org — Interactive Writing and Grammar'
    @description = 'Quill provides free writing and grammar activities for middle and high school students.'
  end

  def develop
  end

  def partners
  end

  def mission
  end

  def beta
  end

  def play
    @activity = Activity.with_classification.find_by_uid('-K0rnIIF_iejGqS3XPJ8')
    @module_url = @activity.anonymous_module_url
    redirect_to(@module_url.to_s)
  end

  def about
    @body_class = 'full-width-page white-page'
  end

  def media
  end

  def faq
  end

  def impact
  end

  def team
  end

  def tos
    @body_class = 'auxiliary white-page formatted-text'
  end

  def media_kit
  end

  def privacy
    @body_class = 'auxiliary white-page formatted-text'
  end

  def board
  end

  def diagnostic_tool
    @title = 'Quill Diagnostic - Free Diagnostic and Adaptive Lesson Plan'
    @description = 'Quickly determine which skills your students need to work on with our 22 question diagnostic.'
  end

  def grammar_tool
    @title = 'Quill Grammar - Free 10 Minute Activities for your Students'
    @description = 'Over 150 sentence writing activities to help your students practice basic grammar skills.'
  end

  def proofreader_tool
    @title = 'Quill Proofreader - Over 100 Expository Passages To Read And Edit'
    @description = 'Students edit passages and receive personalized exercises based on their results.'
  end

  def connect_tool
    @title = 'Quill Connect - Free Sentence Structure Activities'
    @description = 'Help your students advance from fragmented and run-on sentences to complex and well-structured sentences with Quill Connect.'
  end

  def lessons_tool
    @title = 'Quill Lessons - Free Group Writing Activities'
    @description = 'Lead whole-class and small group writing instruction with interactive writing prompts and discussion topics.'
  end

  def activities
    @body_class = 'full-width-page white-page'
    @section = if params[:section_id].present? then Section.find(params[:section_id]) else Section.first end
    @topics = @section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
  end

  # for link to premium within 'about' (discover) pages
  def premium
  end

  def tutorials
  end

  private

  def determine_layout
    case action_name
    when 'home'
      'home'
    when 'home_new', 'diagnostic_tool', 'connect_tool', 'grammar_tool', 'proofreader_tool', 'lessons_tool'
      'twenty_seventeen_home'
    end
  end

  def determine_js_file
    case action_name
    when 'partners', 'mission', 'news', 'media', 'faq', 'impact', 'team', 'tos', 'media_kit', 'media', 'faq', 'privacy', 'premium', 'map', 'teacher_resources', 'news', 'stats', 'activities'
      @js_file = 'public'
    when 'grammar_tool', 'connect_tool', 'grammar_tool', 'proofreader_tool', 'lessons_tool'
      @js_file = 'tools'
    end
  end


  def resolve_body_class
    case action_name
    when 'learning', 'story'
      @body_class = 'auxiliary'
    end
  end

  def determine_flag
    case action_name
    when 'grammar_tool', 'connect_tool', 'grammar_tool', 'proofreader_tool', 'lessons_tool'
      @beta_flag = current_user && current_user.flag == 'beta'
    end
  end
end
