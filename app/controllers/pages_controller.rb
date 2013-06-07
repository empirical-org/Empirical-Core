class PagesController < ApplicationController
  layout :resolve_layout

  def home
    # render layout: false
    @chapter = Chapter.find(16)
    @assessment = @chapter.assessment
    @assignment_id = 0
    @user_id = 0
  end

  def about
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
    when "about", "teachers", "middle_school", "story", "learning"
      "alternative"
    else
      "application"
    end
  end

end
