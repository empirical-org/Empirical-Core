class PagesController < ApplicationController
  def home
    @video_id = '6H07A5RYBns'
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
end
