class PagesController < ApplicationController
  before_filter :resolve_layout

  def home
    @body_id = 'home'
    @chapter = Chapter.find(16)
    @assessment = @chapter.assessment
  end

  def the_peculiar_institution
    @video_id = 'sIcGaamTFxk'

    @slides = Dir.entries('app/assets/images/slides/the_peculiar_institution')
    @slides.delete_if do |image|
      !image.include?('.jpg') &&
      !image.include?('.png') &&
      !image.include?('.gif')
    end
    @slides.map! { |slide| slide = "slides/the_peculiar_institution/#{slide}" }
  end

  def democracy_in_america
    @video_id = '48eoUKalprw'
  end

  def aggregation
    @video_id = '3lcqTp2A750'
  end

  private

  def resolve_layout
    case action_name
    when "about", "learning", "story"
      @body_class = "auxilliary"
    end
  end
end
