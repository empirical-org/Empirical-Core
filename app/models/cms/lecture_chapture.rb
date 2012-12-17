class CMS::LectureChapture < ActiveRecord::Base
  self.table_name = 'lecture_chaptures'
  belongs_to :lecture, class_name: 'CMS::Lecture'
  has_many :lecture_chapter_images, class_name: 'CMS::LectureChapterImage'
  attr_accessible :annotatable_text, :chart_embed_code, :citation_text, :globe_embed_code, :lecture_id, :position, :quiz_embed_code, :reading_text, :slideshow_embed_code, :subtitle, :title, :youtube_embed_code
  include CMS::Orderable
  orderable(:position)

  def self.name
    'LectureChapture'
  end
end
