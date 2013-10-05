class PagesController < ApplicationController
  before_filter :resolve_layout

  def home
    @body_class = 'home-page'
    @chapter = Chapter.find(ENV['HOMEPAGE_CHAPTER_ID'])
    @assessment = @chapter.assessment
  end

  def develop
    @body_class = 'white-page'
  end

  def mission
    @body_class = 'white-page'
  end

  def about
    @body_class = 'auxilliary white-page'
  end

  private

  def resolve_layout
    case action_name
    when 'learning', 'story'
      @body_class = 'auxilliary'
    end
  end
end
