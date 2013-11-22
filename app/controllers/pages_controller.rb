class PagesController < ApplicationController
  before_filter :resolve_layout

  def home
    @body_class = 'home-page'
    @chapter = Chapter.find(1)
    @assessment = @chapter.assessment
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
    @body_class = 'full-width-page white-page'
  end

  def tos
    @body_class = 'auxiliary white-page formatted-text'
  end

  def lessons
    @body_class = 'auxiliary white-page formatted-text'
    @chapter_levels = ChapterLevel.all.map{ |level| [level, level.chapters] }.select{ |group| group.second.any? }
  end

  private

  def resolve_layout
    case action_name
    when 'learning', 'story'
      @body_class = 'auxiliary'
    end
  end
end
