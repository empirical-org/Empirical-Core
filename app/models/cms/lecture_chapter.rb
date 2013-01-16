class CMS::LectureChapter < ActiveRecord::Base
  self.table_name = 'lecture_chapters'
  belongs_to :chapter_group, class_name: 'CMS::ChapterGroup'
  has_many :lecture_chapter_images, class_name: 'CMS::LectureChapterImage'
  has_many :questions
  attr_accessible :annotatable_text, :chapter_group_id, :chart_embed_code, :citation_text, :discussion_text, :globe_embed_code, :position, :quiz_embed_code, :reading_text, :slideshow_embed_code, :subtitle, :title, :youtube_embed_code
  include CMS::Orderable
  orderable(:position, order_scope: "lecture")

  has_many :comments

  def self.name
    'LectureChapter'
  end
end
